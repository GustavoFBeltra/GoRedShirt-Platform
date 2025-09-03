import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { Database } from '@/lib/database.types'

type UserRole = Database['public']['Enums']['user_role']

const PUBLIC_PATHS = ['/', '/login', '/register', '/auth']
const ROLE_PATHS = {
  admin: ['/admin'],
  coach: ['/coach'],
  client: ['/client'],
} as const

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // Allow public paths
  if (PUBLIC_PATHS.some(publicPath => 
    publicPath === '/' ? path === '/' : path.startsWith(publicPath)
  )) {
    return supabaseResponse
  }

  // Redirect unauthenticated users
  if (!user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Get user data with role
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  const userRole = userData?.role as UserRole

  // Check if user has completed profile setup
  if (userRole && path.startsWith('/dashboard')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    // If no basic profile exists, redirect to onboarding
    if (!profile) {
      const url = request.nextUrl.clone()
      url.pathname = '/onboarding'
      return NextResponse.redirect(url)
    }

    // Check role-specific profile completion
    if (userRole === 'coach') {
      const { data: coachProfile } = await supabase
        .from('coach_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (!coachProfile || !coachProfile.specializations || coachProfile.specializations.length === 0) {
        const url = request.nextUrl.clone()
        url.pathname = '/onboarding/coach'
        return NextResponse.redirect(url)
      }
    }
  }

  // Role-based path protection
  if (userRole) {
    // Check admin-only paths
    if (path.startsWith('/admin') && userRole !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }

    // Check coach-only paths
    if (path.startsWith('/coach') && userRole !== 'coach') {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }

    // Check client-only paths
    if (path.startsWith('/client') && userRole !== 'client') {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}