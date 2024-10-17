import { validateInputServerAction } from '@/functions/db'

import { Spacer } from '@/components/Spacer'
import { Button } from '@/components/Button'

export function Input({ teamId, part }: { teamId: string, part: number }) {
  return (
    <>
      <form action={validateInputServerAction}>
        <input type="hidden" name="teamId" value={teamId} />
        <input type="hidden" name="part" value={part.toString()} />
        <input type="text" name="answer" placeholder="answer" />
        <Spacer size={8} />
        <Button type="submit">submit</Button>
      </form>
    </>
  )
}
