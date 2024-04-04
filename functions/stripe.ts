import Stripe from 'stripe'

export async function hasParticipantRegistered(participantEmail: string) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')
  const participantCheckoutSessions = await stripe.checkout.sessions.list({
    customer_details: {
      email: participantEmail
    },
    status: 'complete',
    expand: ['data.line_items']
  })

  const participantCheckoutSessionsFiltered = participantCheckoutSessions.data.filter(
    session => session.line_items?.data[0]?.price?.id === process.env.STRIPE_PRICE_ID
  )

  return participantCheckoutSessionsFiltered.length > 0
}
