"use server"

import {
  addParticipantToTeam,
  dissolveAllTeams,
  getTeamRiddleProgress,
  resetAllTeamsRiddleProgresses,
  resetTeamTime,
  updateTeamRiddleProgress
} from "@/functions/db/teams"
import { revalidatePath } from "next/cache"

export async function resetTeamTimeServerAction(formData: FormData) {
  const teamId = formData.get("teamId") as string
  await resetTeamTime(teamId)
  revalidatePath("/admin")
}

export async function toggleTeamRiddleProgressAction(formData: FormData) {
  const teamId = formData.get("teamId") as string
  const riddleNumber = Number(formData.get("riddleNumber"))
  const teamProgress = await getTeamRiddleProgress(teamId, riddleNumber)
  if (!teamProgress) return
  await updateTeamRiddleProgress(teamId, riddleNumber, !teamProgress.completed)
  revalidatePath("/admin")
}

export async function resetAllTeamRiddleProgressAction() {
  await resetAllTeamsRiddleProgresses()
  revalidatePath("/admin")
}

export async function dissolveAllTeamsServerAction() {
  await dissolveAllTeams()
  revalidatePath("/admin")
}

export async function updateTeamRiddleProgressServerAction(formData: FormData) {
  const teamId = formData.get("teamId") as string
  const number = parseInt(formData.get("number") as string)
  const complete = formData.get("complete") === "true"

  await updateTeamRiddleProgress(teamId, number, complete)
}

export async function addParticipantToTeamServerAction(
  email: string,
  teamId: string
) {
  try {
    await addParticipantToTeam(email, teamId)
    revalidatePath("/admin")
    return { success: true, message: "Successfully added participant to team" }
  } catch (error) {
    console.error("Error adding participant to team:", error)
    return { success: false, message: "Error adding participant to team" }
  }
}
