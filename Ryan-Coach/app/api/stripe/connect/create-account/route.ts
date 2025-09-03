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

    // Get coach profile
    const { data: coachProfile, error: profileError } = await supabase
      .from('coach_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (profileError || !coachProfile) {
      return NextResponse.json({ error: 'Coach profile not found' }, { status: 404 })
    }

    // Check if coach already has a Stripe account
    if (coachProfile.stripe_account_id) {
      return NextResponse.json({ error: 'Stripe account already exists' }, { status: 400 })
    }

    // Create Stripe Express account
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'US', // Default to US, can be made dynamic later
      email: user.user.email,
      capabilities: {
        card_payments: {
          requested: true,
        },
        transfers: {
          requested: true,
        },
      },
      business_profile: {
        mcc: '7991', // Fitness and recreational sports centers
        product_description: 'Personal fitness coaching services',
      },
      metadata: {
        coach_id: userId,
        platform: 'ryan-coach',
      },
    })

    // Update coach profile with Stripe account ID
    const { error: updateError } = await supabase
      .from('coach_profiles')
      .update({
        stripe_account_id: account.id,
        stripe_onboarding_complete: false,
        stripe_charges_enabled: false,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)

    if (updateError) {
      console.error('Error updating coach profile:', updateError)
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }

    return NextResponse.json({ 
      accountId: account.id,
      message: 'Stripe Connect account created successfully' 
    })

  } catch (error) {
    console.error('Error creating Stripe Connect account:', error)
    return NextResponse.json({ 
      error: 'Failed to create Stripe Connect account' 
    }, { status: 500 })
  }
}