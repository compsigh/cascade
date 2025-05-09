import {
  getParticipantByEmail,
  removeParticipantFromTeam
} from "@/functions/db/participants"
import { revalidatePath } from "next/cache"
import { getTeamById } from "@/functions/db/teams"

import { Button } from "@/components/Button"
import { Spacer } from "@/components/Spacer"

export async function TeamView({
  participantEmail
}: {
  participantEmail: string
}) {
  async function leaveTeamServerAction(formData: FormData) {
    "use server"

    const rawFormData = {
      email: formData.get("email") as string
    }

    revalidatePath("/event")
    await removeParticipantFromTeam(rawFormData.email)
  }

  const participant = await getParticipantByEmail(participantEmail)
  const team = await getTeamById(participant!.teamId)
  const participants = team!.participants

  return (
    <>
      <Spacer size={16} />
      <h2>your team</h2>
      <ul>
        {participants.map((participant) => (
          <li key={participant.name}>{participant.name.toLowerCase()}</li>
        ))}
      </ul>
      {participants.length > 1 && (
        <form action={leaveTeamServerAction}>
          <input type="hidden" name="email" value={participantEmail} />
          <Button type="submit">leave team</Button>
        </form>
      )}
    </>
  )
}
