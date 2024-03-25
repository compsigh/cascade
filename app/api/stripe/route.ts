import Stripe from 'stripe'
import { redirect } from 'next/navigation'
import { protectRoute } from '@/functions/protect-route'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')

export async function POST(request: Request) {
  const userSession = await protectRoute()
  if (userSession instanceof Response)
    return userSession

  let session: Stripe.Response<Stripe.Checkout.Session>
  try {
    session = await stripe.checkout.sessions.create({
      customer_email: userSession.user!.email!,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID || '',
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: 'https://cascade.compsigh.club/event',
      cancel_url: 'https://cascade.compsigh.club/event'
    })
  }
  catch (error) {
    return new Response(
      JSON.stringify({ message: 'Error creating session' }),
      { status: error.statusCode || 500 }
    )
  }

  if (session.url)
    redirect(session.url)
  else
    return new Response(
      JSON.stringify({ message: 'Error redirecting to session' }),
      { status: 500 }
    )
}
