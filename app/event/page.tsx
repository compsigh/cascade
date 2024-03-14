import Link from 'next/link'
import { auth } from '@/auth'
import { get } from '@vercel/edge-config'
import { redirect } from 'next/navigation'
import { Spacer } from '@/components/Spacer'
import { checkAuth } from '@/functions/user-management'
import { CountdownWrapper } from '@/components/CountdownWrapper'

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
        welcome {session.user?.name?.split(' ')[0].toLowerCase() || 'user'},
      </p>
      <Content />
    </>
  )
}

async function Content() {
  const registered = true // TODO: implement with db + Stripe
  const started = await get('eventStarted')

  if (!registered)
    return <Unregistered />
  else if (registered && !started)
    return <RegisteredAndWaiting />
}

function RegisteredAndWaiting() {
  return (
    <>
      <p>you&apos;ve registered for compsigh <code>cascade</code></p>
      <p>the event will begin in <code className="blackCode">
          <CountdownWrapper
            date={1712971800000}
            autoStart={true}
          />
      </code></p>
    </>
  )
}

function Unregistered() {
  return (
    <>
      <p>
        to register for &amp; participate in compsigh <code>cascade</code>, please deposit $10 below
      </p>
      <Spacer size={32} />
      <ul>
        <li>
          <Link href="/register">register</Link>
        </li>
      </ul>
    </>
  )
}
