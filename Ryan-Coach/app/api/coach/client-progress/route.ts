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
        error: 'Only coaches can access client progress' 
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

    // Get client progress summaries
    const { data: clientProgress, error } = await supabase
      .from('client_coach_relationships')
      .select(`
        client_id
      `)
      .eq('coach_id', user.user.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // For each client, get their progress data
    const progressSummaries = await Promise.all(
      (clientProgress || []).map(async (relationship) => {
        const clientId = relationship.client_id
        const clientName = 'Client ' + clientId.slice(0, 8)

        // Get progress entries for this client
        const { data: entries } = await supabase
          .from('client_progress_entries')
          .select('*')
          .eq('client_id', clientId)
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString())
          .order('created_at', { ascending: false })

        // Get session count
        const { data: sessions } = await supabase
          .from('coaching_sessions')
          .select('id')
          .eq('client_id', clientId)
          .eq('coach_id', user.user.id)
          .eq('status', 'completed')

        if (!entries || entries.length === 0) {
          return null // Skip clients with no progress entries
        }

        // Calculate progress metrics
        const totalEntries = entries.length
        const avgMood = entries.reduce((sum, entry) => sum + (entry.mood_score || 0), 0) / totalEntries
        const avgEnergy = entries.reduce((sum, entry) => sum + (entry.energy_level || 0), 0) / totalEntries

        // Calculate weight change (if weight data exists)
        const weightsWithDates = entries
          .filter(entry => entry.weight)
          .sort((a, b) => {
            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
            return dateA - dateB
          })

        let weightChange = 0
        if (weightsWithDates.length >= 2) {
          const firstWeight = weightsWithDates[0].weight || 0
          const lastWeight = weightsWithDates[weightsWithDates.length - 1].weight || 0
          weightChange = lastWeight - firstWeight
        }

        return {
          client_id: clientId,
          client_name: clientName,
          total_entries: totalEntries,
          avg_mood: Math.round(avgMood * 10) / 10,
          avg_energy: Math.round(avgEnergy * 10) / 10,
          weight_change: Math.round(weightChange * 10) / 10,
          last_entry_date: entries[0].created_at,
          sessions_completed: sessions?.length || 0
        }
      })
    )

    // Filter out null entries (clients with no progress data)
    const validProgress = progressSummaries.filter(summary => summary !== null)

    return NextResponse.json({ 
      progress: validProgress.sort((a, b) => {
        const dateA = a.last_entry_date ? new Date(a.last_entry_date).getTime() : 0
        const dateB = b.last_entry_date ? new Date(b.last_entry_date).getTime() : 0
        return dateB - dateA
      })
    })

  } catch (error: any) {
    console.error('Error fetching client progress:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch client progress data' 
    }, { status: 500 })
  }
}