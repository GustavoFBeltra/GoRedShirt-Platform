import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const {
      weight,
      mood_score,
      energy_level,
      sleep_quality,
      stress_level,
      notes,
      measurements,
      workout_intensity,
      nutrition_adherence,
    } = await req.json()

    if (!mood_score || !energy_level) {
      return NextResponse.json({ 
        error: 'Mood score and energy level are required' 
      }, { status: 400 })
    }

    const supabase = await createClient()

    // Get authenticated user
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify user is a client
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.user.id)
      .single()

    if (!profile || profile.role !== 'client') {
      return NextResponse.json({ 
        error: 'Only clients can submit progress entries' 
      }, { status: 403 })
    }

    // Create the progress entry
    const { data: progressEntry, error: entryError } = await supabase
      .from('client_progress_entries')
      .insert({
        client_id: user.user.id,
        entry_date: new Date().toISOString().split('T')[0],
        weight: weight || null,
        mood_score,
        energy_level,
      })
      .select()
      .single()

    if (entryError) {
      console.error('Error creating progress entry:', entryError)
      return NextResponse.json({ 
        error: 'Failed to save progress entry' 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      entry: progressEntry,
      message: 'Progress entry saved successfully' 
    })

  } catch (error: any) {
    console.error('Error in progress entry API:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')
    const limit = parseInt(searchParams.get('limit') || '50')

    const supabase = await createClient()

    // Get authenticated user
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Build query
    let query = supabase
      .from('client_progress_entries')
      .select('*')
      .eq('client_id', user.user.id)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (startDate) {
      query = query.gte('created_at', startDate)
    }
    if (endDate) {
      query = query.lte('created_at', endDate)
    }

    const { data: entries, error } = await query

    if (error) {
      console.error('Error fetching progress entries:', error)
      return NextResponse.json({ 
        error: 'Failed to fetch progress entries' 
      }, { status: 500 })
    }

    return NextResponse.json({ entries })

  } catch (error: any) {
    console.error('Error in progress entries GET API:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}