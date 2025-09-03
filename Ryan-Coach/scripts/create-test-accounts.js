const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function createTestAccounts() {
  const accounts = [
    {
      email: 'testadmin@gmail.com',
      password: 'TestPass123!',
      name: 'Admin User',
      role: 'admin'
    },
    {
      email: 'testcoach@gmail.com', 
      password: 'TestPass123!',
      name: 'Coach Smith',
      role: 'coach'
    },
    {
      email: 'testclient@gmail.com',
      password: 'TestPass123!',
      name: 'John Athlete',
      role: 'client'
    }
  ]

  console.log('Creating test accounts...')

  for (const account of accounts) {
    try {
      console.log(`Creating ${account.role} account: ${account.email}`)
      
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: account.email,
        password: account.password,
        options: {
          data: {
            name: account.name,
            role: account.role,
          },
        },
      })

      if (authError) {
        console.error(`Auth error for ${account.email}:`, authError.message)
        continue
      }

      if (!authData.user) {
        console.error(`No user returned for ${account.email}`)
        continue
      }

      console.log(`✅ Auth user created: ${authData.user.id}`)

      // Create user record
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: account.email,
          name: account.name,
          role: account.role,
        })

      if (userError) {
        console.error(`User table error for ${account.email}:`, userError.message)
        continue
      }

      // Create profile record
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: authData.user.id,
          display_name: account.name,
          first_name: account.name.split(' ')[0],
          last_name: account.name.split(' ')[1] || '',
          visibility: account.role === 'client' ? 'public' : 'private',
        })

      if (profileError) {
        console.error(`Profile error for ${account.email}:`, profileError.message)
        continue
      }

      // Create user roles
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: authData.user.id,
          role: account.role,
          granted_at: new Date().toISOString(),
        })

      if (roleError) {
        console.error(`Role error for ${account.email}:`, roleError.message)
      }

      // Create coach profile if needed
      if (account.role === 'coach') {
        const { error: coachError } = await supabase
          .from('coach_profiles')
          .insert({
            user_id: authData.user.id,
            bio: 'Experienced coach specializing in sports performance',
            specializations: ['Strength Training', 'Sports Performance'],
            years_experience: 5,
            hourly_rate: 75,
            is_active: true,
          })

        if (coachError) {
          console.error(`Coach profile error for ${account.email}:`, coachError.message)
        }
      }

      console.log(`✅ Successfully created ${account.role} account: ${account.email}`)

    } catch (error) {
      console.error(`Unexpected error creating ${account.email}:`, error.message)
    }
  }

  console.log('\n🎉 Test account creation completed!')
  console.log('\n📋 LOGIN CREDENTIALS:')
  accounts.forEach(account => {
    console.log(`${account.role.toUpperCase()}: ${account.email} / ${account.password}`)
  })
}

createTestAccounts().catch(console.error)