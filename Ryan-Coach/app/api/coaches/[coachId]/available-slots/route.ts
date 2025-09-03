import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { addMinutes, format, parseISO, startOfDay, endOfDay } from 'date-fns'

export async function GET(
  req: NextRequest,
  { params }: { params: { coachId: string } }
) {
  try {
    const { coachId } = params
    const { searchParams } = new URL(req.url)
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')
    const duration = parseInt(searchParams.get('duration') || '60')

    if (!startDate || !endDate) {
      return NextResponse.json({ 
        error: 'Start date and end date are required' 
      }, { status: 400 })
    }

    const supabase = await createClient()

    // Get coach availability for the date range
    const startDateObj = parseISO(startDate)
    const endDateObj = parseISO(endDate)

    // Get the days of week for the date range
    const daysOfWeek: number[] = []
    for (let date = startDateObj; date <= endDateObj; date = addMinutes(date, 24 * 60)) {
      const dayOfWeek = date.getDay()
      if (!daysOfWeek.includes(dayOfWeek)) {
        daysOfWeek.push(dayOfWeek)
      }
    }

    // Get coach availability patterns
    const { data: availability, error: availabilityError } = await supabase
      .from('coach_availability')
      .select('*')
      .eq('coach_id', coachId)
      .eq('is_active', true)
      .in('day_of_week', daysOfWeek)
      .or(`end_date.is.null,end_date.gte.${endDate}`)
      .lte('effective_date', endDate)

    if (availabilityError) {
      return NextResponse.json({ error: availabilityError.message }, { status: 500 })
    }

    if (!availability || availability.length === 0) {
      return NextResponse.json({ slots: [] })
    }

    // Get existing booked sessions for the date range
    const { data: bookedSessions, error: sessionsError } = await supabase
      .from('coaching_sessions')
      .select('scheduled_start, scheduled_end')
      .eq('coach_id', coachId)
      .gte('scheduled_start', `${startDate}T00:00:00.000Z`)
      .lte('scheduled_end', `${endDate}T23:59:59.999Z`)
      .in('status', ['scheduled', 'confirmed'])

    if (sessionsError) {
      return NextResponse.json({ error: sessionsError.message }, { status: 500 })
    }

    // Generate available slots
    const slots: any[] = []
    const bookedTimes = new Set(
      (bookedSessions || []).map(session => 
        `${session.scheduled_start}-${session.scheduled_end}`
      )
    )

    // Generate slots for each day in the range
    for (let currentDate = startDateObj; currentDate <= endDateObj; currentDate = addMinutes(currentDate, 24 * 60)) {
      const dayOfWeek = currentDate.getDay()
      const dayAvailability = availability.filter(avail => avail.day_of_week === dayOfWeek)

      for (const avail of dayAvailability) {
        // Create datetime objects for this specific date
        const startTime = parseISO(`${format(currentDate, 'yyyy-MM-dd')}T${avail.start_time}`)
        const endTime = parseISO(`${format(currentDate, 'yyyy-MM-dd')}T${avail.end_time}`)

        // Generate slots every 30 minutes (or duration if shorter)
        const slotInterval = Math.min(30, duration) // 30 minute intervals
        let currentSlotStart = startTime

        while (addMinutes(currentSlotStart, duration) <= endTime) {
          const slotEnd = addMinutes(currentSlotStart, duration)
          const slotKey = `${currentSlotStart.toISOString()}-${slotEnd.toISOString()}`

          // Check if this slot is not already booked
          if (!bookedTimes.has(slotKey) && currentSlotStart >= new Date()) {
            slots.push({
              id: `${coachId}-${currentSlotStart.toISOString()}`,
              start_time: currentSlotStart.toISOString(),
              end_time: slotEnd.toISOString(),
              is_available: true,
            })
          }

          currentSlotStart = addMinutes(currentSlotStart, slotInterval)
        }
      }
    }

    // Sort slots by start time
    slots.sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())

    return NextResponse.json({ slots })

  } catch (error: any) {
    console.error('Error fetching available slots:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch available slots' 
    }, { status: 500 })
  }
}