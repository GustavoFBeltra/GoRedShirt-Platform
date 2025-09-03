import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { subDays, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, format } from 'date-fns'

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
        error: 'Only coaches can export analytics' 
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

    // Get detailed session data
    const { data: sessions, error: sessionsError } = await supabase
      .from('coaching_sessions')
      .select(`
        id,
        client_id,
        scheduled_start,
        scheduled_end,
        status,
        price_paid,
        created_at,
        package_id
      `)
      .eq('coach_id', user.user.id)
      .gte('created_at', startDateISO)
      .lte('created_at', endDateISO)
      .order('created_at', { ascending: false })

    if (sessionsError) {
      return NextResponse.json({ error: sessionsError.message }, { status: 500 })
    }

    // Get payment data
    const { data: payments, error: paymentsError } = await supabase
      .from('payments')
      .select(`
        id,
        client_id,
        amount,
        platform_fee,
        currency,
        status,
        created_at
      `)
      .eq('coach_id', user.user.id)
      .gte('created_at', startDateISO)
      .lte('created_at', endDateISO)
      .order('created_at', { ascending: false })

    if (paymentsError) {
      return NextResponse.json({ error: paymentsError.message }, { status: 500 })
    }

    // Create CSV content
    const csvHeader = [
      'Type',
      'Date',
      'Client Name',
      'Session/Payment ID',
      'Amount (USD)',
      'Platform Fee (USD)',
      'Net Amount (USD)',
      'Status',
      'Package/Description'
    ].join(',')

    const csvRows: string[] = []

    // Add session data
    sessions?.forEach(session => {
      csvRows.push([
        'Session',
        session.created_at ? format(new Date(session.created_at), 'yyyy-MM-dd HH:mm') : 'N/A',
        session.client_id || 'Unknown',
        session.id,
        session.price_paid ? (session.price_paid / 100).toFixed(2) : '0.00',
        session.price_paid ? (session.price_paid * 0.10 / 100).toFixed(2) : '0.00',
        session.price_paid ? (session.price_paid * 0.90 / 100).toFixed(2) : '0.00',
        session.status,
        session.package_id || 'Individual Session'
      ].join(','))
    })

    // Add payment data
    payments?.forEach(payment => {
      csvRows.push([
        'Payment',
        payment.created_at ? format(new Date(payment.created_at), 'yyyy-MM-dd HH:mm') : 'N/A',
        payment.client_id || 'Unknown',
        payment.id,
        (payment.amount / 100).toFixed(2),
        payment.platform_fee ? (payment.platform_fee / 100).toFixed(2) : '0.00',
        ((payment.amount - (payment.platform_fee || 0)) / 100).toFixed(2),
        payment.status,
        '"Payment received"'
      ].join(','))
    })

    const csvContent = [csvHeader, ...csvRows].join('\n')

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="coach-analytics-${period}-${format(new Date(), 'yyyy-MM-dd')}.csv"`
      }
    })

  } catch (error: any) {
    console.error('Error exporting coach analytics:', error)
    return NextResponse.json({ 
      error: 'Failed to export analytics data' 
    }, { status: 500 })
  }
}