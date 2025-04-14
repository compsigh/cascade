import { Button } from "@/components/Button";
import { Spacer } from "@/components/Spacer";
import { acceptInvite, declineInvite, getInvitesToEmail } from "@/functions/db";
import { revalidatePath } from "next/cache";

export async function IncomingInviteList({
  participantEmail,
}: {
  participantEmail: string;
}) {
  async function acceptInviteServerAction(formData: FormData) {
    "use server";

    const rawFormData = {
      id: formData.get("id") as string,
      action: "accept",
    };

    revalidatePath("/event");
    return await acceptInvite(rawFormData.id);
  }

  async function declineInviteServerAction(formData: FormData) {
    "use server";

    const rawFormData = {
      id: formData.get("id") as string,
      action: "decline",
    };

    revalidatePath("/event");
    return await declineInvite(rawFormData.id);
  }

  const invites = await getInvitesToEmail(participantEmail);
  if (invites.length === 0) return <></>;

  return (
    <>
      <Spacer size={16} />
      <h2>invites to you</h2>
      <ul>
        {invites.map((invite) => (
          <li key={invite.id}>
            <p>from: {invite.fromParticipantEmail}</p>
            <form action={acceptInviteServerAction}>
              <input type="hidden" name="id" value={invite.id} />
              <Button type="submit">accept</Button>
            </form>
            <form action={declineInviteServerAction}>
              <input type="hidden" name="id" value={invite.id} />
              <Button type="submit">decline</Button>
            </form>
          </li>
        ))}
      </ul>
    </>
  );
}
