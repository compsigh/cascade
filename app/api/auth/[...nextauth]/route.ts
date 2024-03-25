export { GET, POST } from '@/auth'

import { auth } from '@/auth'
import { isAuthed } from '@/functions/user-management'
export async function protectRoute() {
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

  return session
}
