import { auth } from '@/auth'
import { checkAuth } from '@/functions/user-management'
import { redirect } from 'next/navigation'
import { Spacer } from '@/components/Spacer'

export default async function Event() {
  const session = await auth()
  if (!session)
    redirect('/api/auth/signin')
  const authed = checkAuth(session)
  if (!authed)
    redirect('/')

  return (
    <>
      <h1 id='title'><code className="blackCode">cascade</code></h1>
      <Spacer size={32} />
      <p>
        welcome {session.user?.name?.split(' ')[0].toLowerCase() || 'user'}, <br />
        to register for &amp; participate in compsigh <code>cascade</code>, please deposit $10 below
      </p>
      <Spacer size={32} />
      <p>
        you&apos;ve registered for compsigh <code>cascade</code>. the event will begin in <code className="blackCode">12:01:46:10</code>
      </p>
    </>
  )
}
