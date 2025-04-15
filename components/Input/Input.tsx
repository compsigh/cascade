import {
  getParticipantByEmail,
  validateInputServerAction,
} from "@/functions/db";

import { auth } from "@/auth";
import { Spacer } from "@/components/Spacer";
import { Button } from "@/components/Button";
import { isAuthed } from "@/functions/user-management";

export async function Input({ riddleNumber }: { riddleNumber: number }) {
  const session = await auth();
  const authed = isAuthed(session);
  if (!session || !authed) return null;

  const participant = await getParticipantByEmail(session.user!.email!);
  const teamId = participant?.teamId;
  return (
    <>
      <form action={validateInputServerAction}>
        <input type="hidden" name="teamId" value={teamId} />
        <input type="hidden" name="riddleNumber" value={riddleNumber} />
        <input type="text" name="solution" placeholder="solution" />
        <Spacer size={8} />
        <Button type="submit">submit</Button>
      </form>
    </>
  );
}
