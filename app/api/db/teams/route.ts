import { auth } from '@/auth'
import { checkAuth } from '@/functions/user-management'
import {
  deleteAllTeams,
  getAllTeams
 } from '@/functions/db'

export async function GET(request: Request) {
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

  const teams = await getAllTeams()

  return new Response(
    JSON.stringify(teams), { status: 200 }
  )
}

export async function DELETE(request: Request) {
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

  const deletedTeams = await deleteAllTeams()

  return new Response(
    JSON.stringify(deletedTeams), { status: 200 }
  )
}
