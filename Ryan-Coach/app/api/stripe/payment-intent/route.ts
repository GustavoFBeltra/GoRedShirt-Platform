import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { amount, coachId, description, metadata = {} } = await req.json()

    if (!amount || !coachId) {
      return NextResponse.json({ 
        error: 'Amount and coach ID are required' 
      }, { status: 400 })
    }

    const supabase = await createClient()

    // Get user information
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get coach profile with Stripe account ID
    const { data: coachProfile, error: coachError } = await supabase
      .from('coach_profiles')
      .select('user_id')
      .eq('user_id', coachId)
      .single()

    if (coachError || !coachProfile) {
      return NextResponse.json({ 
        error: 'Coach profile not found' 
      }, { status: 404 })
    }


    // Calculate platform fee (10% of total amount)
    const platformFeePercent = 0.10
    const platformFeeAmount = Math.round(amount * platformFeePercent)

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in cents
      currency: 'usd',
      description: description || 'Coaching session payment',
      metadata: {
        client_id: user.user.id,
        coach_id: coachId,
        platform_fee_amount: platformFeeAmount.toString(),
        ...metadata,
      },
    })

    // Record payment in database
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        client_id: user.user.id,
        coach_id: coachId,
        amount: amount,
        platform_fee: platformFeeAmount,
        currency: 'usd',
        status: 'pending',
        stripe_payment_intent_id: paymentIntent.id,
        description: description || 'Coaching session payment',
        metadata: metadata,
      })

    if (paymentError) {
      console.error('Error recording payment:', paymentError)
      // Continue anyway - payment intent is created
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: amount,
      platformFee: platformFeeAmount,
      message: 'Payment intent created successfully'
    })

  } catch (error: any) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to create payment intent' 
    }, { status: 500 })
  }
}