import { auth } from '@/auth'
import { isAuthed, isOrganizer } from '@/functions/user-management'

export enum Role {
  Participant,
  Organizer
}

export async function protectRoute(protectionLevel: Role) {
  const session = await auth()
  if (!session)
    return new Response(
      JSON.stringify({ message: 'Unauthorized' }), { status: 401 }
    )
  const authed = isAuthed(session)
  if (!authed)
    return new Response(
      JSON.stringify({ message: 'Forbidden' }), { status: 403 }
    )

  if (protectionLevel === Role.Organizer)
    if (!isOrganizer(session))
      return new Response(
        JSON.stringify({ message: 'Forbidden' }), { status: 403 }
      )

  return session
}
