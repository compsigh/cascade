"use server"

import { revalidatePath } from "next/cache"
import { sendInvite, cancelInvite } from "@/functions/db/invites"

export async function sendInviteServerAction(formData: FormData) {
  const rawFormData = {
    from: formData.get("from") as string,
    to: formData.get("to") as string
  }

  await sendInvite(rawFormData.from, rawFormData.to)
  revalidatePath("/event")
}

export async function cancelInviteServerAction(id: string) {
  const invite = await cancelInvite(id)
  revalidatePath("/event")
  return invite
}
