"use server"

import {
  createParticipant,
  removeParticipantFromTeam,
  deleteParticipant,
  deleteAllParticipants
} from "@/functions/db/participants"
import { revalidatePath } from "next/cache"

export async function createParticipantServerAction(
  name: string,
  email: string
) {
  try {
    const participant = await createParticipant(name, email)
    revalidatePath("/admin")
    return {
      success: true,
      message: "Participant created successfully!",
      participant
    }
  } catch (error) {
    console.error("Error creating riddle:", error)
    return { success: false, message: "Error creating participant." }
  }
}

export async function removeParticipantFromTeamServerAction(
  formData: FormData
) {
  const email = formData.get("email") as string
  await removeParticipantFromTeam(email)
  revalidatePath("/admin")
}

export async function deleteParticipantServerAction(formData: FormData) {
  const email = formData.get("email") as string
  await deleteParticipant(email)
  revalidatePath("/admin")
}

export async function deleteAllParticipantsServerAction() {
  await deleteAllParticipants()
  revalidatePath("/admin")
}
