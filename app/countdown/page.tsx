import { auth } from '@/auth'
import { checkAuth } from '@/functions/user-management'
import { redirect } from 'next/navigation'
import { Spacer } from '@/components/Spacer'
import { CountdownWrapper } from '@/components/CountdownWrapper'

{/*
  Countdown for the "registered but waiting for event to start" page:
    - we want to clamp it to April 12th 6:30pm PST
    - purely cosmetic, should not trigger any rendering
      - we're going to use Edge Config for flags (`enabled`, etc.)
    - style nicely
*/}

export default async function CountdownPage() {
  const session = await auth()
  if (!session)
    redirect('/api/auth/signin')
  const authed = checkAuth(session)
  if (!authed)
    redirect('/')

  return (
    <>
      <h1><code className="blackCode">cascade</code></h1>
      <Spacer size={32} />
      <p>
        welcome {session.user?.name?.split(' ')[0].toLowerCase() || 'user'},
      </p>
      <p>
        you&apos;ve registered for compsigh <code>cascade</code>. the event will begin in <code className="blackCode">
          <CountdownWrapper
            date={1712971800000}
            autoStart={true}
          />
      </code></p>
    </>
  )
}
