import { auth } from '@/auth'
import { checkAuth } from '@/functions/user-management'
import {
  deleteAllTeams,
  getAllTeams
 } from '@/functions/db'

async function protectRoute() {
  const session = await auth()
  if (!session)
    return new Response(
      JSON.stringify({ message: 'Unauthorized' }), { status: 401 }
    )
  const authed = checkAuth(session)
  if (!authed)
    return new Response(
      JSON.stringify({ message: 'Forbidden' }), { status: 403 }
    )
}

export async function GET(request: Request) {
  await protectRoute()
  const teams = await getAllTeams()
  return new Response(
    JSON.stringify(teams), { status: 200 }
  )
}

export async function DELETE(request: Request) {
  await protectRoute()
  return new Response(
    JSON.stringify(deletedTeams), { status: 200 }
  )
}
