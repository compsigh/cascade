"use server"

import {
  disbandAllTeams,
  getTeamRiddleProgress,
  resetAllTeamsRiddleProgresses,
  resetTeamTime,
  updateTeamRiddleProgress
} from "@/functions/db/teams"
import { revalidatePath } from "next/cache"
import { updateParticipantTeam } from "@/functions/db/participants"

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

export async function disbandAllTeamsServerAction() {
  await disbandAllTeams()
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
    await updateParticipantTeam(email, teamId)
    revalidatePath("/admin")
    return { success: true, message: "Successfully added participant to team" }
  } catch (error) {
    console.error("Error adding participant to team:", error)
    return { success: false, message: "Error adding participant to team" }
  }
}
