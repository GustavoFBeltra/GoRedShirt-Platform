import { NextResponse } from 'next/server'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    // Check if Supabase auth is working
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      return NextResponse.json({
        status: 'error',
        message: 'Auth service error',
        error: sessionError.message
      }, { status: 500 })
    }

    // Test database connection with auth context
    const { error: dbError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)
    
    if (dbError) {
      return NextResponse.json({
        status: 'error',
        message: 'Database connection error',
        error: dbError.message
      }, { status: 500 })
    }

    return NextResponse.json({
      status: 'ok',
      authenticated: !!session,
      timestamp: new Date().toISOString(),
      user: session?.user ? {
        id: session.user.id,
        email: session.user.email
      } : null
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Unexpected auth service error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}