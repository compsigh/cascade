import type { Session } from 'next-auth'

export function checkAuth(session: Session | null) {
  if (!session)
    return false

  const user = session.user
  if (!user?.email?.endsWith('usfca.edu'))
    return false

  return true
}
