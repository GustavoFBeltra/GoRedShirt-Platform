import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()

    // Get user information
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get coach pricing packages
    const { data: packages, error } = await supabase
      .from('coach_packages')
      .select('*')
      .eq('coach_id', user.user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ packages: packages || [] })

  } catch (error: any) {
    console.error('Error fetching pricing:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch pricing' 
    }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { 
      name, 
      description, 
      price, 
      duration_minutes, 
      session_count = 1, 
      package_type = 'individual',
      is_active = true 
    } = await req.json()

    if (!name || !price || !duration_minutes) {
      return NextResponse.json({ 
        error: 'Name, price, and duration are required' 
      }, { status: 400 })
    }

    const supabase = await createClient()

    // Get user information
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify user is a coach
    const { data: coachProfile } = await supabase
      .from('coach_profiles')
      .select('user_id')
      .eq('user_id', user.user.id)
      .single()

    if (!coachProfile) {
      return NextResponse.json({ 
        error: 'Only coaches can create pricing packages' 
      }, { status: 403 })
    }

    // Create pricing package
    const { data: newPackage, error } = await supabase
      .from('coach_packages')
      .insert({
        coach_id: user.user.id,
        name,
        description,
        price: Math.round(price * 100), // Convert to cents
        duration_minutes,
        session_count,
        package_type,
        is_active,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      package: newPackage,
      message: 'Pricing package created successfully' 
    })

  } catch (error: any) {
    console.error('Error creating pricing package:', error)
    return NextResponse.json({ 
      error: 'Failed to create pricing package' 
    }, { status: 500 })
  }
}