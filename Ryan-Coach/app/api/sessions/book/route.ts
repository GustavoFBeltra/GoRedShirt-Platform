import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { 
      coach_id, 
      package_id, 
      start_time, 
      end_time, 
      duration_minutes,
      location_type = 'virtual',
      notes
    } = await req.json()

    if (!coach_id || !start_time || !end_time || !duration_minutes) {
      return NextResponse.json({ 
        error: 'Coach ID, start time, end time, and duration are required' 
      }, { status: 400 })
    }

    const supabase = await createClient()

    // Get user information
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify the package exists and get pricing
    let packageData = null
    let price = null

    if (package_id) {
      const { data: pkg, error: packageError } = await supabase
        .from('coach_packages')
        .select('*')
        .eq('id', package_id)
        .eq('coach_id', coach_id)
        .eq('is_active', true)
        .single()

      if (packageError || !pkg) {
        return NextResponse.json({ 
          error: 'Package not found or inactive' 
        }, { status: 404 })
      }

      packageData = pkg
      price = pkg.price
    }

    // Check if the time slot is still available
    const { data: existingSessions, error: checkError } = await supabase
      .from('coaching_sessions')
      .select('id')
      .eq('coach_id', coach_id)
      .gte('scheduled_start', start_time)
      .lte('scheduled_end', end_time)
      .in('status', ['scheduled', 'confirmed'])

    if (checkError) {
      return NextResponse.json({ error: checkError.message }, { status: 500 })
    }

    if (existingSessions && existingSessions.length > 0) {
      return NextResponse.json({ 
        error: 'This time slot is no longer available' 
      }, { status: 409 })
    }

    // Create the session
    const { data: newSession, error: sessionError } = await supabase
      .from('coaching_sessions')
      .insert({
        client_id: user.user.id,
        coach_id,
        package_id: package_id || null,
        scheduled_start: start_time,
        scheduled_end: end_time,
        duration_minutes,
        status: 'scheduled',
        price_paid: price,
        location_type,
        client_notes: notes || null,
        timezone: 'UTC', // TODO: Use client timezone
      })
      .select(`
        *,
        coach:coach_id(
          profiles(name)
        ),
        package:package_id(
          name,
          price
        )
      `)
      .single()

    if (sessionError) {
      return NextResponse.json({ error: sessionError.message }, { status: 500 })
    }

    // If there's a package with price, we might want to create a payment record
    // For now, we'll mark it as pending payment
    if (price) {
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          client_id: user.user.id,
          coach_id,
          amount: price,
          platform_fee: Math.round(price * 0.10), // 10% platform fee
          currency: 'usd',
          status: 'pending',
          description: `Coaching session - ${packageData?.name}`,
          metadata: {
            session_id: newSession.id,
            package_id: package_id,
          },
        })

      if (paymentError) {
        console.error('Error creating payment record:', paymentError)
        // Continue anyway - session is booked
      }
    }

    return NextResponse.json({ 
      session: newSession,
      message: 'Session booked successfully' 
    })

  } catch (error: any) {
    console.error('Error booking session:', error)
    return NextResponse.json({ 
      error: 'Failed to book session' 
    }, { status: 500 })
  }
}