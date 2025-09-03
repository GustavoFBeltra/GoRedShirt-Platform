import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { subDays, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear, format } from 'date-fns'

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
        error: 'Only admins can export platform analytics' 
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

    // Get comprehensive platform data
    const [
      { data: users },
      { data: sessions },
      { data: payments },
      { data: progressEntries }
    ] = await Promise.all([
      supabase
        .from('users')
        .select(`
          id, 
          role, 
          createdAt, 
          name,
          profiles(display_name, first_name, last_name)
        `)
        .gte('createdAt', startDateISO)
        .lte('createdAt', endDateISO),
      
      supabase
        .from('coaching_sessions')
        .select(`
          id,
          coach_id,
          client_id,
          status,
          price_paid,
          scheduled_start,
          created_at
        `)
        .gte('created_at', startDateISO)
        .lte('created_at', endDateISO),
      
      supabase
        .from('payments')
        .select(`
          id,
          coach_id,
          client_id,
          amount,
          platform_fee,
          status,
          created_at
        `)
        .gte('created_at', startDateISO)
        .lte('created_at', endDateISO),
      
      supabase
        .from('client_progress_entries')
        .select(`
          id,
          client_id,
          mood_score,
          energy_level,
          weight,
          created_at
        `)
        .gte('created_at', startDateISO)
        .lte('created_at', endDateISO)
    ])

    // Create comprehensive CSV with multiple sheets worth of data
    const sections = []

    // Users Summary
    const usersSummary = [
      'USERS SUMMARY',
      'Date,User ID,Name,Role,Registration Date,Last Sign In',
      ...(users || []).map(user => [
        format(new Date(user.createdAt), 'yyyy-MM-dd'),
        user.id,
        `"${user.profiles?.display_name || (user.profiles?.first_name && user.profiles?.last_name ? `${user.profiles.first_name} ${user.profiles.last_name}` : user.name) || 'Unknown'}"`,
        user.role,
        format(new Date(user.createdAt), 'yyyy-MM-dd HH:mm'),
        'Unknown'
      ].join(','))
    ]
    sections.push(usersSummary.join('\n'))

    // Sessions Summary
    const sessionsSummary = [
      'SESSIONS SUMMARY',
      'Date,Session ID,Coach,Client,Status,Price Paid (USD),Scheduled Start',
      ...(sessions || []).map(session => [
        session.created_at ? format(new Date(session.created_at), 'yyyy-MM-dd') : 'N/A',
        session.id,
        session.coach_id || 'Unknown',
        session.client_id || 'Unknown',
        session.status,
        session.price_paid ? (session.price_paid / 100).toFixed(2) : '0.00',
        session.scheduled_start ? format(new Date(session.scheduled_start), 'yyyy-MM-dd HH:mm') : 'N/A'
      ].join(','))
    ]
    sections.push(sessionsSummary.join('\n'))

    // Payments Summary
    const paymentsSummary = [
      'PAYMENTS SUMMARY',
      'Date,Payment ID,Coach,Client,Amount (USD),Platform Fee (USD),Net to Coach (USD),Status',
      ...(payments || []).map(payment => [
        payment.created_at ? format(new Date(payment.created_at), 'yyyy-MM-dd') : 'N/A',
        payment.id,
        payment.coach_id || 'Unknown',
        payment.client_id || 'Unknown',
        (payment.amount / 100).toFixed(2),
        payment.platform_fee ? (payment.platform_fee / 100).toFixed(2) : '0.00',
        ((payment.amount - (payment.platform_fee || 0)) / 100).toFixed(2),
        payment.status
      ].join(','))
    ]
    sections.push(paymentsSummary.join('\n'))

    // Progress Entries Summary
    const progressSummary = [
      'PROGRESS ENTRIES SUMMARY',
      'Date,Entry ID,Client,Mood Score,Energy Level,Weight (kg)',
      ...(progressEntries || []).map(entry => [
        entry.created_at ? format(new Date(entry.created_at), 'yyyy-MM-dd') : 'N/A',
        entry.id,
        entry.client_id || 'Unknown',
        entry.mood_score ? entry.mood_score.toString() : 'N/A',
        entry.energy_level ? entry.energy_level.toString() : 'N/A',
        entry.weight ? entry.weight.toString() : 'N/A'
      ].join(','))
    ]
    sections.push(progressSummary.join('\n'))

    // Platform Metrics Summary
    const totalRevenue = payments?.reduce((sum, p) => sum + (p.status === 'succeeded' ? p.amount : 0), 0) || 0
    const totalFees = payments?.reduce((sum, p) => sum + (p.status === 'succeeded' ? (p.platform_fee || 0) : 0), 0) || 0
    const completedSessions = sessions?.filter(s => s.status === 'completed').length || 0
    const totalSessions = sessions?.length || 0

    const metricsSummary = [
      'PLATFORM METRICS SUMMARY',
      'Metric,Value',
      `Period,"${period.charAt(0).toUpperCase() + period.slice(1)}"`,
      `Start Date,"${format(startDate, 'yyyy-MM-dd')}"`,
      `End Date,"${format(endDate, 'yyyy-MM-dd')}"`,
      `Total Users,${users?.length || 0}`,
      `New Coaches,${users?.filter(u => u.role === 'coach').length || 0}`,
      `New Clients,${users?.filter(u => u.role === 'client').length || 0}`,
      `Total Sessions,${totalSessions}`,
      `Completed Sessions,${completedSessions}`,
      `Session Completion Rate,"${totalSessions > 0 ? ((completedSessions / totalSessions) * 100).toFixed(1) : 0}%"`,
      `Total Revenue,"$${(totalRevenue / 100).toFixed(2)}"`,
      `Platform Fees Collected,"$${(totalFees / 100).toFixed(2)}"`,
      `Progress Entries,${progressEntries?.length || 0}`,
      `Active Tracking Clients,${new Set(progressEntries?.map(p => p.client_id)).size}`
    ]
    sections.push(metricsSummary.join('\n'))

    const csvContent = sections.join('\n\n')

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="platform-analytics-${period}-${format(new Date(), 'yyyy-MM-dd')}.csv"`
      }
    })

  } catch (error: any) {
    console.error('Error exporting platform analytics:', error)
    return NextResponse.json({ 
      error: 'Failed to export platform analytics' 
    }, { status: 500 })
  }
}