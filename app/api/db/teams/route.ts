import { auth } from '@/auth'
import { checkAuth } from '@/functions/user-management'
import {
  deleteAllTeams,
  getAllTeams
 } from '@/functions/db'

export async function GET(request: Request) {
  const session = await auth()
  if (!session)
    return { status: 401, body: 'Unauthorized' }
  const authed = checkAuth(session)
  if (!authed)
    return { status: 403, body: 'Forbidden' }

  const teams = await getAllTeams()

  return new Response(
    JSON.stringify(teams), { status: 200 }
  )
}

export async function DELETE(request: Request) {
  const session = await auth()
  if (!session)
    return { status: 401, body: 'Unauthorized' }
  const authed = checkAuth(session)
  if (!authed)
    return { status: 403, body: 'Forbidden' }

  const deletedTeams = await deleteAllTeams()

  return new Response(
    JSON.stringify(deletedTeams), { status: 200 }
  )
}
