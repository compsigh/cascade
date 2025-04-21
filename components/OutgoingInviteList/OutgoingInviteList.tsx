import { revalidatePath } from "next/cache"
import { cancelInvite, getInvitesFromEmail } from "@/functions/db/invites"

import { Button } from "@/components/Button"
import { Spacer } from "@/components/Spacer"

export async function OutgoingInviteList({
  participantEmail
}: {
  participantEmail: string
}) {
  async function cancelInviteServerAction(formData: FormData) {
    "use server"

    const rawFormData = {
      id: formData.get("id") as string
    }

    revalidatePath("/event")
    await cancelInvite(rawFormData.id)
  }

  const invites = await getInvitesFromEmail(participantEmail)

  return (
    <>
      <Spacer size={16} />
      <h2>invites you&apos;ve sent</h2>
      {invites.length === 0 ? (
        <p>no invites sent</p>
      ) : (
        <ul>
          {invites.map((invite) => (
            <li key={invite.id}>
              <p>to: {invite.toParticipantEmail}</p>
              <form action={cancelInviteServerAction}>
                <input type="hidden" name="id" value={invite.id} />
                <Button type="submit">cancel</Button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
