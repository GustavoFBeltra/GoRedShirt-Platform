import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe/server'
import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()
  const headersList = headers()
  const sig = headersList.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err: any) {
    console.log(`Webhook signature verification failed.`, err.message)
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  const supabase = await createClient()

  try {
    switch (event.type) {
      case 'account.updated':
        await handleAccountUpdated(event.data.object as Stripe.Account, supabase)
        break
      
      case 'account.application.authorized':
        await handleAccountAuthorized(event.data.object as Stripe.Application, supabase)
        break

      case 'account.application.deauthorized':
        await handleAccountDeauthorized(event.data.object as Stripe.Application, supabase)
        break

      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent, supabase)
        break

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent, supabase)
        break

      default:
        console.log(`Unhandled event type ${event.type}`)
    }
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

async function handleAccountUpdated(account: Stripe.Account, supabase: any) {
  console.log('Account updated:', account.id)
  
  // Update coach profile with account status
  const { error } = await supabase
    .from('coach_profiles')
    .update({
      stripe_onboarding_complete: account.details_submitted,
      stripe_charges_enabled: account.charges_enabled,
      updated_at: new Date().toISOString()
    })
    .eq('stripe_account_id', account.id)

  if (error) {
    console.error('Error updating coach profile:', error)
  }
}

async function handleAccountAuthorized(application: Stripe.Application, supabase: any) {
  console.log('Account authorized:', application.id)
  // Handle account authorization if needed
}

async function handleAccountDeauthorized(application: Stripe.Application, supabase: any) {
  console.log('Account deauthorized:', application.id)
  // Handle account deauthorization if needed
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent, supabase: any) {
  console.log('Payment succeeded:', paymentIntent.id)
  
  // Update payment record in database
  const { error } = await supabase
    .from('payments')
    .update({
      status: 'succeeded',
      stripe_payment_intent_id: paymentIntent.id,
      updated_at: new Date().toISOString()
    })
    .eq('stripe_payment_intent_id', paymentIntent.id)

  if (error) {
    console.error('Error updating payment:', error)
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent, supabase: any) {
  console.log('Payment failed:', paymentIntent.id)
  
  // Update payment record in database
  const { error } = await supabase
    .from('payments')
    .update({
      status: 'failed',
      stripe_payment_intent_id: paymentIntent.id,
      updated_at: new Date().toISOString()
    })
    .eq('stripe_payment_intent_id', paymentIntent.id)

  if (error) {
    console.error('Error updating payment:', error)
  }
}