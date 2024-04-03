import { protectRoute, Role } from '@/functions/protect-route'
import {
  acceptInvite,
  declineInvite
 } from '@/functions/db'

export async function POST(request: Request) {
  await protectRoute(Role.Participant)
  const body = await request.json()
  const { id, action } = body
  if (action === 'accept')
    return new Response(
      JSON.stringify(await acceptInvite(id)), { status: 200 }
    )
  if (action === 'decline')
    return new Response(
      JSON.stringify(await declineInvite(id)), { status: 200 }
    )
  return new Response(
    JSON.stringify({ error: 'Invalid action.' }), { status: 400 }
  )
}
