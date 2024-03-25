import type { Session } from 'next-auth'

export function isAuthed(session: Session | null) {
  if (!session)
    return false
  if (!session.user)
    return false
  if (!session.user.email)
    return false
  if (!session.user.email.endsWith('usfca.edu'))
    return false

  return true
}
