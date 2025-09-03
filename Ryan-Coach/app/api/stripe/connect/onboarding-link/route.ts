import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const supabase = await createClient()

    // Get user information
    const { data: user } = await supabase.auth.getUser()
    if (!user.user || user.user.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get coach profile with Stripe account ID
    const { data: coachProfile, error: profileError } = await supabase
      .from('coach_profiles')
      .select('stripe_account_id')
      .eq('user_id', userId)
      .single()

    if (profileError || !coachProfile?.stripe_account_id) {
      return NextResponse.json({ error: 'Stripe account not found' }, { status: 404 })
    }

    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: coachProfile.stripe_account_id,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/coach/stripe-onboarding?refresh=true`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/coach/stripe-onboarding?success=true`,
      type: 'account_onboarding',
    })

    return NextResponse.json({ 
      onboardingUrl: accountLink.url,
      message: 'Onboarding link created successfully' 
    })

  } catch (error) {
    console.error('Error creating onboarding link:', error)
    return NextResponse.json({ 
      error: 'Failed to create onboarding link' 
    }, { status: 500 })
  }
}