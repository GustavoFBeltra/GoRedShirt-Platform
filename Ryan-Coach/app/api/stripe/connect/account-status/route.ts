import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()

    // Get user information
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get coach profile with Stripe account ID
    const { data: coachProfile, error: profileError } = await supabase
      .from('coach_profiles')
      .select('stripe_account_id')
      .eq('user_id', user.user.id)
      .single()

    if (profileError || !coachProfile) {
      return NextResponse.json({ error: 'Coach profile not found' }, { status: 404 })
    }

    if (!coachProfile.stripe_account_id) {
      return NextResponse.json({ 
        hasAccount: false,
        onboardingComplete: false,
        chargesEnabled: false,
        message: 'No Stripe account found'
      })
    }

    // Get account details from Stripe
    const account = await stripe.accounts.retrieve(coachProfile.stripe_account_id)

    // Skip database update for now since these fields don't exist in the schema

    return NextResponse.json({
      hasAccount: true,
      accountId: account.id,
      onboardingComplete: account.details_submitted,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
      requirements: account.requirements,
      message: 'Account status retrieved successfully'
    })

  } catch (error) {
    console.error('Error retrieving account status:', error)
    return NextResponse.json({ 
      error: 'Failed to retrieve account status' 
    }, { status: 500 })
  }
}