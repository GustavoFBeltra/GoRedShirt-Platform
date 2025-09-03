'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { Database, UserRole, AuthUser as DatabaseAuthUser } from '@/lib/database.types'

interface AuthUser extends User {
  role?: UserRole
  roles?: UserRole[]
  profile?: {
    id: string
    display_name?: string
    is_minor?: boolean
    visibility?: 'public' | 'recruiters_only' | 'private'
  }
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, userData?: { name?: string; role?: UserRole }) => Promise<{ error: any }>
  signOut: () => Promise<void>
  updateProfile: (updates: any) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  updateProfile: async () => ({ error: null }),
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          console.log('Initial session check: User found, fetching role...')
          
          // Fetch user data with profile information and roles
          let userData = null
          let userRoles = null
          let profileData = null
          let error = null
          
          try {
            // First try with auth user ID
            const [userResult, rolesResult, profileResult] = await Promise.all([
              supabase
                .from('users')
                .select('id, role, name, email')
                .eq('id', session.user.id)
                .single(),
              supabase
                .from('user_roles')
                .select('role')
                .eq('user_id', session.user.id),
              supabase
                .from('profiles')
                .select('id, display_name, is_minor, visibility')
                .eq('user_id', session.user.id)
                .single()
            ])
            
            if (userResult.error && session.user.email) {
              // If ID doesn't match, try with email as fallback
              const emailUserResult = await supabase
                .from('users')
                .select('id, role, name, email')
                .eq('email', session.user.email)
                .single()
              
              userData = emailUserResult.data
              error = emailUserResult.error
            } else {
              userData = userResult.data
              error = userResult.error
            }
            
            // Use roles and profile data if we have them
            userRoles = rolesResult.data || []
            profileData = profileResult.data
            
          } catch (fetchError) {
            console.log('Error fetching user data:', fetchError)
            error = fetchError
          }

          if (!error && userData) {
            console.log('Initial session: Got role:', userData.role)
            const roles = userRoles.map(r => r.role)
            const authUser: AuthUser = {
              ...session.user,
              role: userData.role,
              roles: roles.length > 0 ? roles : [userData.role],
              profile: profileData || undefined
            }
            setUser(authUser)
          } else {
            console.log('Initial session: Error fetching role:', error)
            console.log('Initial session: Using default role for user:', session.user.email)
            setUser({ ...session.user, role: 'client', roles: ['client'] } as AuthUser)
          }
        }
      } catch (error) {
        console.log('Auth error:', error)
      } finally {
        setLoading(false)
      }
    }

    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      setLoading(false)
    }, 5000)

    getSession().finally(() => clearTimeout(timeoutId))

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', { event, userId: session?.user?.id })
      
      try {
        if (session?.user) {
          console.log('Auth state: User session found, fetching user role...')
          
          try {
            // Add timeout to prevent infinite hanging
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Timeout')), 5000)
            )
            
            // Remove these variables as we'll get them from the Promise result
            
            const fetchPromise = async () => {
              try {
                // Fetch user data with profile information and roles
                const [userResult, rolesResult, profileResult] = await Promise.all([
                  supabase
                    .from('users')
                    .select('id, role, name, email')
                    .eq('id', session.user.id)
                    .single(),
                  supabase
                    .from('user_roles')
                    .select('role')
                    .eq('user_id', session.user.id),
                  supabase
                    .from('profiles')
                    .select('id, display_name, is_minor, visibility')
                    .eq('user_id', session.user.id)
                    .single()
                ])
                
                let userData = userResult.data
                let error = userResult.error
                
                if (userResult.error && session.user.email) {
                  console.log('Auth state: ID lookup failed, trying email fallback...')
                  const emailUserResult = await supabase
                    .from('users')
                    .select('id, role, name, email')
                    .eq('email', session.user.email)
                    .single()
                  
                  userData = emailUserResult.data
                  error = emailUserResult.error
                }
                
                return { 
                  userData, 
                  error,
                  userRoles: rolesResult.data || [],
                  profileData: profileResult.data
                }
              } catch (fetchError) {
                return { userData: null, error: fetchError, userRoles: [], profileData: null }
              }
            }

            const result = await Promise.race([fetchPromise(), timeoutPromise])
            const { userData, error, userRoles, profileData } = result

            console.log('Auth state: User data fetch result:', { userData, error, userRoles, profileData })

            if (!error && userData) {
              const roles = userRoles.map(r => r.role)
              const authUser: AuthUser = {
                ...session.user,
                role: userData.role,
                roles: roles.length > 0 ? roles : [userData.role],
                profile: profileData || undefined
              }
              console.log('Auth state: Setting user with role:', authUser.role, 'and roles:', authUser.roles)
              setUser(authUser)
              console.log('Auth state: User set successfully')
            } else {
              console.log('Auth state: Error fetching role, using default:', error)
              const fallbackUser: AuthUser = { 
                ...session.user, 
                role: 'client',
                roles: ['client']
              }
              console.log('Auth state: Setting fallback user with role: client')
              setUser(fallbackUser)
              console.log('Auth state: Fallback user set successfully')
            }
          } catch (timeoutError) {
            console.log('Auth state: Role fetch timed out, using default role')
            const timeoutUser: AuthUser = { 
              ...session.user, 
              role: 'client',
              roles: ['client']
            }
            setUser(timeoutUser)
            console.log('Auth state: Timeout user set successfully')
          }
        } else {
          console.log('Auth state: No session, setting user to null')
          setUser(null)
        }
      } catch (error) {
        console.error('Auth state change error:', error)
        if (session?.user) {
          console.log('Auth state: Error occurred, using default role "client"')
          setUser({ 
            ...session.user, 
            role: 'client',
            roles: ['client']
          } as AuthUser)
        } else {
          console.log('Auth state: Error occurred, setting user to null')
          setUser(null)
        }
      } finally {
        console.log('Auth state: Setting loading to false')
        setLoading(false)
        console.log('Auth state: Loading set to false successfully')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    console.log('Auth context: signIn called with email:', email)
    
    try {
      console.log('Auth context: Calling supabase.auth.signInWithPassword...')
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      console.log('Auth context: signInWithPassword response:', { 
        user: data?.user?.id, 
        session: !!data?.session, 
        error 
      })
      
      if (error) {
        console.error('Auth context: Sign in failed:', error.message)
        return { error }
      }
      
      if (!data?.user) {
        console.error('Auth context: No user returned from sign in')
        return { error: { message: 'Authentication failed - no user returned' } }
      }
      
      console.log('Auth context: Sign in successful for user:', data.user.id)
      
      // Wait a moment for auth state to update
      await new Promise(resolve => setTimeout(resolve, 100))
      
      return { error: null }
    } catch (err) {
      console.error('Auth context: Unexpected error in signIn:', err)
      const errorMessage = err instanceof Error ? err.message : 'Network error during sign in'
      return { error: { message: errorMessage } }
    }
  }

  const signUp = async (
    email: string,
    password: string,
    userData?: { 
      name?: string
      role?: UserRole
      roles?: UserRole[]
      dateOfBirth?: string
      location?: string
      school?: string
      parentEmail?: string
    }
  ) => {
    const primaryRole = userData?.role || 'athlete'
    const allRoles = userData?.roles || [primaryRole]

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: userData?.name || '',
          role: primaryRole,
        },
      },
    })

    if (!error && data.user) {
      try {
        // Create user record
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email,
            name: userData?.name || null,
            role: primaryRole,
            date_of_birth: userData?.dateOfBirth || null,
          })

        if (insertError) {
          console.error('Error inserting user data:', insertError)
          return { error: insertError }
        }

        // Create profile record
        const isMinor = userData?.dateOfBirth ? 
          new Date().getFullYear() - new Date(userData.dateOfBirth).getFullYear() < 18 : false

        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: crypto.randomUUID(),
            user_id: data.user.id,
            display_name: userData?.name || null,
            location: userData?.location || null,
            school: userData?.school || null,
            visibility: primaryRole === 'athlete' ? 'public' : 'private',
            dob: userData?.dateOfBirth || null,
          })

        if (profileError) {
          console.error('Error creating user profile:', profileError)
          return { error: profileError }
        }

        // Create user_roles entries for multi-role support
        const roleInserts = allRoles.map(role => ({
          user_id: data.user.id,
          role,
          granted_at: new Date().toISOString(),
        }))

        const { error: rolesError } = await supabase
          .from('user_roles')
          .insert(roleInserts)

        if (rolesError) {
          console.error('Error creating user roles:', rolesError)
        }

        // Create coach profile if user has coach role
        if (allRoles.includes('coach')) {
          const { error: coachProfileError } = await supabase
            .from('coach_profiles')
            .insert({
              id: crypto.randomUUID(),
              user_id: data.user.id,
              is_active: true,
            })

          if (coachProfileError) {
            console.error('Error creating coach profile:', coachProfileError)
          }
        }

        // Handle parental consent for minors
        if (isMinor && userData?.parentEmail && primaryRole === 'athlete') {
          // Note: In a real implementation, you'd send a consent email to the parent
          // For now, we'll create a pending consent record
          const { error: consentError } = await supabase
            .from('consent_records')
            .insert({
              id: crypto.randomUUID(),
              consent_type: 'profile_creation',
              granted: false,
              // minor_id would be set after profile creation completes
            })

          if (consentError) {
            console.error('Error creating consent record:', consentError)
          }
        }

      } catch (signUpError) {
        console.error('Error during sign up process:', signUpError)
        return { error: signUpError }
      }
    }

    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const updateProfile = async (updates: any) => {
    const { error } = await supabase.auth.updateUser(updates)
    return { error }
  }

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}