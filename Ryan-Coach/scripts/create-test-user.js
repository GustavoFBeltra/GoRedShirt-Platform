// Script to create a test user using Supabase client
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ozrdyxfvlltbgugukpma.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96cmR5eGZ2bGx0Ymd1Z3VrcG1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MzY3NjYsImV4cCI6MjA3MTIxMjc2Nn0.g3NVovwFHRp1gQwiIWiL0go8mg1bDna6RVcAUIs5uUg';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createTestUser() {
  console.log('Creating test user...');
  
  // Sign up a new user
  const { data, error } = await supabase.auth.signUp({
    email: 'test2@example.com',
    password: 'Test123!',
    options: {
      data: {
        name: 'Test User 2',
        role: 'client'
      }
    }
  });

  if (error) {
    console.error('Error creating user:', error);
    return;
  }

  console.log('User created successfully!');
  console.log('Email: test2@example.com');
  console.log('Password: Test123!');
  console.log('User ID:', data.user?.id);
  
  // Since we're using the anon key, the user will need email confirmation
  // But for local testing, we can manually confirm it in the database
  console.log('\nNote: You may need to confirm the email in the database or check your email for confirmation link.');
}

createTestUser();