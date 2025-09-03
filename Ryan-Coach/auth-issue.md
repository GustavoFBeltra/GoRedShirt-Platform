# Authentication Issue - Test User Creation

## Issue Description
Test users can be created in the database but cannot authenticate through the login system. Only manually created accounts through the registration flow work properly.

## Problem Details
- Test users are created in both `auth.users` and `public.users` tables
- Email confirmation is set properly
- Encrypted passwords match the expected format
- However, login attempts return "Invalid login credentials"

## Affected Accounts
- `coach@test.com` / `testpass123`
- `client@test.com` / `testpass123`
- `admin@test.com` / `testpass123`

## Technical Investigation Needed
1. Check Supabase Auth configuration for password hashing
2. Verify if additional auth.identities records are needed
3. Review if instance_id or other auth metadata is missing
4. Consider using Supabase Admin API instead of direct SQL inserts

## Workaround
Users can register through the normal registration flow, but email confirmation may not work in development.

## Priority
Medium - Affects development testing but core functionality works

## Related Files
- Authentication system in `/app/login`
- User creation in `/app/register`
- Database schema in Supabase