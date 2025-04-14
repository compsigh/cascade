import { Button } from "@/components/Button";
import { Spacer } from "@/components/Spacer";
import {
  getParticipantByEmail,
  getInvitesFromEmail,
  getTeamById,
  sendInvite,
} from "@/functions/db";
import { revalidatePath } from "next/cache";

export async function InviteForm({
  participantEmail,
}: {
  participantEmail: string;
}) {
  async function sendInviteServerAction(formData: FormData) {
    "use server";

    const rawFormData = {
      from: formData.get("from") as string,
      to: formData.get("to") as string,
    };

    revalidatePath("/event");
    return await sendInvite(rawFormData.from, rawFormData.to);
  }

  const participant = await getParticipantByEmail(participantEmail);
  const invitesSent = await getInvitesFromEmail(participantEmail);
  const team = await getTeamById(participant!.teamId);
  const teamSize = team!.participants.length;

  return (
    <>
      <Spacer size={16} />
      <h2>invite a friend to join your team</h2>
      <p>
        please be sure to enter their email exactly as it appears on their usf
        google account
      </p>
      <Spacer size={8} />
      {invitesSent.length >= 3 && (
        <p>
          you can have a maximum of 3 active invites; you&apos;ll have to cancel
          one to send a new one
        </p>
      )}
      {teamSize >= 4 && (
        <p>you&apos;ve reached the maximum of 4 participants on your team</p>
      )}
      {invitesSent.length < 3 && teamSize < 4 && (
        <form action={sendInviteServerAction}>
          <input type="hidden" name="from" value={participantEmail || ""} />
          <input type="email" name="to" placeholder="usf email" />
          <Spacer size={8} />
          <Button type="submit">send invite</Button>
        </form>
      )}
    </>
  );
}
