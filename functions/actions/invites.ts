"use server"

import { revalidatePath } from "next/cache"
import { sendInvite, cancelInvite } from "@/functions/db/invites"

export async function sendInviteServerAction(from: string, to: string) {
  const invite = await sendInvite(from, to)
  revalidatePath("/event")
  return invite
}

export async function cancelInviteServerAction(id: string) {
  const invite = await cancelInvite(id)
  revalidatePath("/event")
  return invite
}
