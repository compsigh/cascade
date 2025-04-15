import { Button } from "@/components/Button";
import { Spacer } from "@/components/Spacer";
import {
  getParticipantByEmail,
  getInvitesFromEmail,
  getTeamById,
  sendInvite,
  getAllParticipants,
} from "@/functions/db";
import { revalidatePath } from "next/cache";
import { get } from "@vercel/edge-config";
import { SearchParticipants } from "@/components/SearchParticipants";

export async function InviteForm({
  participantEmail,
}: {
  participantEmail: string;
}) {
  async function sendInviteServerAction(formData: FormData): Promise<void> {
    "use server";

    const rawFormData = {
      from: formData.get("from") as string,
      to: formData.get("to") as string,
    };

    revalidatePath("/event");
    await sendInvite(rawFormData.from, rawFormData.to);
  }

  const participant = await getParticipantByEmail(participantEmail);
  const invitesSent = await getInvitesFromEmail(participantEmail);
  const team = await getTeamById(participant!.teamId);
  const teamSize = team!.participants.length;

  const maxTeamSize = await get<number>("maxTeamSize");
  const maxInvites = await get<number>("maxInvites");

  const allParticipants = await getAllParticipants();

  return (
    <>
      <Spacer size={16} />
      <h2>invite a friend to join your team</h2>
      <p>
        please be sure to enter their email exactly as it appears on their usf
        google account
      </p>
      <Spacer size={8} />
      {maxTeamSize !== null && teamSize >= maxTeamSize! && (
        <p>
          you&apos;ve reached the maximum of {maxTeamSize!} participants on your
          team
        </p>
      )}
      {maxInvites !== null && invitesSent.length >= maxInvites! && (
        <p>
          you can have a maximum of {maxInvites!} active invites; you&apos;ll
          have to cancel one to send a new one
        </p>
      )}
      {maxTeamSize !== null &&
        maxInvites !== null &&
        invitesSent.length < maxInvites! &&
        teamSize < maxTeamSize! && (
          <form action={sendInviteServerAction}>
            <input type="hidden" name="from" value={participantEmail || ""} />
            <SearchParticipants
              participants={allParticipants.filter(
                (p) => p.email !== participantEmail,
              )}
            />
            <Spacer size={8} />
            <Button type="submit">send invite</Button>
          </form>
        )}
    </>
  );
}
