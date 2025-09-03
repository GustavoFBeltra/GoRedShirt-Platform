import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { subDays, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear } from 'date-fns'

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

    // Verify user is an admin
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ 
        error: 'Only admins can access platform analytics' 
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
      case 'year':
        startDate = startOfYear(new Date())
        endDate = endOfYear(new Date())
        break
      default: // month
        startDate = startOfMonth(new Date())
        endDate = endOfMonth(new Date())
    }

    const startDateISO = startDate.toISOString()
    const endDateISO = endDate.toISOString()

    // Get platform overview statistics
    const { data: overviewStats } = await supabase.rpc('get_platform_overview_stats', {
      start_date: startDateISO,
      end_date: endDateISO
    })

    // Get revenue statistics
    const { data: revenueStats } = await supabase.rpc('get_platform_revenue_stats', {
      start_date: startDateISO,
      end_date: endDateISO
    })

    // Get engagement statistics
    const { data: engagementStats } = await supabase.rpc('get_platform_engagement_stats', {
      start_date: startDateISO,
      end_date: endDateISO
    })

    // Get health statistics
    const { data: healthStats } = await supabase.rpc('get_platform_health_stats', {
      start_date: startDateISO,
      end_date: endDateISO
    })

    // Get top earning coaches
    const { data: topCoaches } = await supabase.rpc('get_platform_top_coaches', {
      start_date: startDateISO,
      end_date: endDateISO,
      limit_count: 5
    })

    const analytics = {
      overview: overviewStats?.[0] || {
        total_users: 0,
        total_coaches: 0,
        total_clients: 0,
        total_admins: 0,
        active_users_30d: 0,
        new_users_this_month: 0
      },
      revenue: {
        ...revenueStats?.[0] || {
          total_revenue: 0,
          platform_fees_collected: 0,
          average_transaction: 0,
          revenue_growth: 0
        },
        top_earning_coaches: topCoaches || []
      },
      engagement: engagementStats?.[0] || {
        total_sessions: 0,
        completed_sessions: 0,
        session_completion_rate: 0,
        avg_sessions_per_client: 0,
        active_coach_percentage: 0
      },
      health: healthStats?.[0] || {
        total_progress_entries: 0,
        active_tracking_clients: 0,
        avg_client_satisfaction: 0,
        platform_health_score: 0
      }
    }

    return NextResponse.json({ analytics })

  } catch (error: any) {
    console.error('Error fetching platform analytics:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch platform analytics' 
    }, { status: 500 })
  }
}