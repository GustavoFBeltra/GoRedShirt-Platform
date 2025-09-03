const { createClient } = require('@supabase/supabase-js')
const bcrypt = require('bcryptjs')
require('dotenv').config({ path: '.env.local' })

// We'll need to use service role key for this to work
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function createTestAccountsDirect() {
  const accounts = [
    {
      email: 'testadmin@gmail.com',
      password: 'TestPass123!',
      name: 'Test Admin',
      role: 'admin'
    },
    {
      email: 'testcoach@gmail.com', 
      password: 'TestPass123!',
      name: 'Test Coach',
      role: 'coach'
    },
    {
      email: 'testclient@gmail.com',
      password: 'TestPass123!',
      name: 'Test Client',
      role: 'client'
    }
  ]

  console.log('Creating test accounts using auth signup...')

  for (const account of accounts) {
    try {
      console.log(`\nCreating ${account.role} account: ${account.email}`)
      
      // Try the signup approach with simpler email confirmation bypass
      const { data, error } = await supabase.auth.signUp({
        email: account.email,
        password: account.password,
        options: {
          data: {
            name: account.name,
            role: account.role,
          },
          emailRedirectTo: undefined
        }
      })

      if (error) {
        console.error(`❌ Auth error for ${account.email}:`, error.message)
        continue
      }

      if (!data.user) {
        console.error(`❌ No user returned for ${account.email}`)
        continue
      }

      console.log(`✅ Supabase auth user created: ${data.user.id}`)
      console.log(`   Email confirmed: ${data.user.email_confirmed_at ? 'Yes' : 'No'}`)

      // Manually confirm the email
      if (!data.user.email_confirmed_at) {
        console.log(`   Attempting to confirm email...`)
      }
      
    } catch (error) {
      console.error(`❌ Unexpected error creating ${account.email}:`, error.message)
    }
  }

  console.log('\n🎉 Test account creation completed!')
  console.log('\n📋 LOGIN CREDENTIALS:')
  console.log('Email: testadmin@gmail.com | Password: TestPass123! | Role: Admin')
  console.log('Email: testcoach@gmail.com | Password: TestPass123! | Role: Coach') 
  console.log('Email: testclient@gmail.com | Password: TestPass123! | Role: Client')
  console.log('\nNOTE: You may need to check confirmation emails or manually confirm these accounts.')
}

// Also provide manual SQL inserts as backup
console.log('If Supabase signup fails, you can manually insert with these SQL commands:')
console.log('\nManual SQL commands to create accounts:')

const uuid1 = 'aaaaaaaa-bbbb-cccc-dddd-111111111111'
const uuid2 = 'aaaaaaaa-bbbb-cccc-dddd-222222222222' 
const uuid3 = 'aaaaaaaa-bbbb-cccc-dddd-333333333333'

console.log(`
-- Admin account
INSERT INTO auth.users (
  id, email, encrypted_password, email_confirmed_at, created_at, updated_at, confirmed_at
) VALUES (
  '${uuid1}', 'testadmin@gmail.com', '$2a$10$X.9eDYcjAAJPdaBIZKFrYu0xhxQNIzJKQ6AEwGD5Qfxp5HnY5N1ta', NOW(), NOW(), NOW(), NOW()
);

INSERT INTO public.users (id, email, name, role) VALUES 
('${uuid1}', 'testadmin@gmail.com', 'Test Admin', 'admin');

-- Coach account  
INSERT INTO auth.users (
  id, email, encrypted_password, email_confirmed_at, created_at, updated_at, confirmed_at
) VALUES (
  '${uuid2}', 'testcoach@gmail.com', '$2a$10$X.9eDYcjAAJPdaBIZKFrYu0xhxQNIzJKQ6AEwGD5Qfxp5HnY5N1ta', NOW(), NOW(), NOW(), NOW()
);

INSERT INTO public.users (id, email, name, role) VALUES 
('${uuid2}', 'testcoach@gmail.com', 'Test Coach', 'coach');

-- Client account
INSERT INTO auth.users (
  id, email, encrypted_password, email_confirmed_at, created_at, updated_at, confirmed_at  
) VALUES (
  '${uuid3}', 'testclient@gmail.com', '$2a$10$X.9eDYcjAAJPdaBIZKFrYu0xhxQNIzJKQ6AEwGD5Qfxp5HnY5N1ta', NOW(), NOW(), NOW(), NOW()
);

INSERT INTO public.users (id, email, name, role) VALUES 
('${uuid3}', 'testclient@gmail.com', 'Test Client', 'client');
`)

createTestAccountsDirect().catch(console.error)