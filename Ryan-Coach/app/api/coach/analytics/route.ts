import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { subDays, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter } from 'date-fns'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const period = searchParams.get('period') || 'month'

    const supabase = await createClient()

    // Get authenticated user
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify user is a coach
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.user.id)
      .single()

    if (!profile || profile.role !== 'coach') {
      return NextResponse.json({ 
        error: 'Only coaches can access analytics' 
      }, { status: 403 })
    }

    // Calculate date ranges
    let startDate: Date
    let endDate: Date = new Date()

    switch (period) {
      case 'week':
        startDate = subDays(new Date(), 7)
        break
      case 'quarter':
        startDate = startOfQuarter(new Date())
        endDate = endOfQuarter(new Date())
        break
      default: // month
        startDate = startOfMonth(new Date())
        endDate = endOfMonth(new Date())
    }

    const startDateISO = startDate.toISOString()
    const endDateISO = endDate.toISOString()

    // Get client statistics
    const { data: clientStats } = await supabase.rpc('get_coach_client_stats', {
      coach_id: user.user.id,
      start_date: startDateISO,
      end_date: endDateISO
    })

    // Get revenue statistics  
    const { data: revenueStats } = await supabase.rpc('get_coach_revenue_stats', {
      coach_id: user.user.id,
      start_date: startDateISO,
      end_date: endDateISO
    })

    // Get session statistics
    const { data: sessionStats } = await supabase.rpc('get_coach_session_stats', {
      coach_id: user.user.id,
      start_date: startDateISO,
      end_date: endDateISO
    })

    // Get client progress statistics
    const { data: progressStats } = await supabase.rpc('get_coach_client_progress_stats', {
      coach_id: user.user.id,
      start_date: startDateISO,
      end_date: endDateISO
    })

    // Get top performing clients
    const { data: topPerformers } = await supabase.rpc('get_coach_top_performers', {
      coach_id: user.user.id,
      limit_count: 5
    })

    const analytics = {
      clients: clientStats?.[0] || {
        total: 0,
        active: 0,
        new_this_month: 0
      },
      revenue: revenueStats?.[0] || {
        total_this_month: 0,
        total_all_time: 0,
        average_session_value: 0,
        platform_fees_paid: 0
      },
      sessions: sessionStats?.[0] || {
        total_this_month: 0,
        completed_this_month: 0,
        completion_rate: 0,
        upcoming_count: 0
      },
      client_progress: progressStats?.[0] || {
        avg_mood_improvement: 0,
        avg_energy_improvement: 0,
        clients_with_progress: 0,
        total_progress_entries: 0
      },
      top_performers: topPerformers || []
    }

    return NextResponse.json({ analytics })

  } catch (error: any) {
    console.error('Error fetching coach analytics:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch analytics data' 
    }, { status: 500 })
  }
}