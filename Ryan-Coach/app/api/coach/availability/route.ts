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

    // Get coach availability
    const { data: availability, error } = await supabase
      .from('coach_availability')
      .select('*')
      .eq('coach_id', user.user.id)
      .order('day_of_week', { ascending: true })
      .order('start_time', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ availability: availability || [] })

  } catch (error: any) {
    console.error('Error fetching availability:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch availability' 
    }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { 
      day_of_week, 
      start_time, 
      end_time, 
      timezone = 'UTC',
      effective_date,
      end_date
    } = await req.json()

    if (day_of_week === undefined || !start_time || !end_time || !effective_date) {
      return NextResponse.json({ 
        error: 'Day of week, start time, end time, and effective date are required' 
      }, { status: 400 })
    }

    // Validate day_of_week
    if (day_of_week < 0 || day_of_week > 6) {
      return NextResponse.json({ 
        error: 'Day of week must be between 0 (Sunday) and 6 (Saturday)' 
      }, { status: 400 })
    }

    // Validate times
    if (start_time >= end_time) {
      return NextResponse.json({ 
        error: 'End time must be after start time' 
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
        error: 'Only coaches can set availability' 
      }, { status: 403 })
    }

    // Create availability slot
    const { data: newAvailability, error } = await supabase
      .from('coach_availability')
      .insert({
        coach_id: user.user.id,
        day_of_week,
        start_time,
        end_time,
        timezone,
        effective_date,
        end_date: end_date || null,
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      availability: newAvailability,
      message: 'Availability created successfully' 
    })

  } catch (error: any) {
    console.error('Error creating availability:', error)
    return NextResponse.json({ 
      error: 'Failed to create availability' 
    }, { status: 500 })
  }
}