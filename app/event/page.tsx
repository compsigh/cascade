import { auth } from '@/auth'
import { checkAuth } from '@/functions/user-management'
import { redirect } from 'next/navigation'

export default async function Event() {
  const session = await auth()
  const authed = checkAuth(session)
  if (!authed)
    redirect('/')

  return (
    <h1>authed</h1>
  )
}
