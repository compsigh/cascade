import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Spacer } from '@/components/Spacer'
import { isAuthed } from '@/functions/user-management'

export async function Welcome() {
  const session = await auth()
  const authed = isAuthed(session)
  if (!session || !authed)
    redirect('/')
  return (
    <>
     <h1 id="title"><code className="blackCode">cascade</code></h1>
      <Spacer size={32} />
      <p>
        welcome {session.user!.name!.split(' ')[0].toLowerCase()},
      </p>
    </>
  )
}
