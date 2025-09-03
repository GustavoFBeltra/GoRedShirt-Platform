import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { coachId: string } }
) {
  try {
    const { coachId } = params
    const supabase = await createClient()

    // Get coach's active packages
    const { data: packages, error } = await supabase
      .from('coach_packages')
      .select('*')
      .eq('coach_id', coachId)
      .eq('is_active', true)
      .order('price', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ packages: packages || [] })

  } catch (error: any) {
    console.error('Error fetching coach packages:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch packages' 
    }, { status: 500 })
  }
}