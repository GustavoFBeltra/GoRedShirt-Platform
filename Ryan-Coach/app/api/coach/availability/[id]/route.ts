import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const supabase = await createClient()

    // Get user information
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Delete availability slot (RLS policy will ensure user owns it)
    const { error } = await supabase
      .from('coach_availability')
      .delete()
      .eq('id', id)
      .eq('coach_id', user.user.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Availability deleted successfully' 
    })

  } catch (error: any) {
    console.error('Error deleting availability:', error)
    return NextResponse.json({ 
      error: 'Failed to delete availability' 
    }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { 
      day_of_week, 
      start_time, 
      end_time, 
      timezone,
      effective_date,
      end_date,
      is_active
    } = await req.json()

    const supabase = await createClient()

    // Get user information
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Validate times if provided
    if (start_time && end_time && start_time >= end_time) {
      return NextResponse.json({ 
        error: 'End time must be after start time' 
      }, { status: 400 })
    }

    // Update availability slot (RLS policy will ensure user owns it)
    const { data: updatedAvailability, error } = await supabase
      .from('coach_availability')
      .update({
        ...(day_of_week !== undefined && { day_of_week }),
        ...(start_time && { start_time }),
        ...(end_time && { end_time }),
        ...(timezone && { timezone }),
        ...(effective_date && { effective_date }),
        ...(end_date !== undefined && { end_date }),
        ...(is_active !== undefined && { is_active }),
      })
      .eq('id', id)
      .eq('coach_id', user.user.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      availability: updatedAvailability,
      message: 'Availability updated successfully' 
    })

  } catch (error: any) {
    console.error('Error updating availability:', error)
    return NextResponse.json({ 
      error: 'Failed to update availability' 
    }, { status: 500 })
  }
}