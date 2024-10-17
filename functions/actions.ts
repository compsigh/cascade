"use server"

import {
  deleteParticipant,
  removeParticipantFromTeam,
  resetTeamTime
} from "./db"
import { revalidatePath } from "next/cache"

export async function removeParticipantFromTeamServerAction(formData: FormData) {
  const rawFormData = {
    email: formData.get("email") as string
  }

  revalidatePath("/admin")
  return await removeParticipantFromTeam(rawFormData.email)
}

export async function toggleEventStatusServerAction(formData: FormData) {
  try {
    const result = await fetch(
      `https://api.vercel.com/v1/edge-config/${process.env.EDGE_CONFIG_ID}/items?teamId=${process.env.VERCEL_TEAM_ID}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`
        },
        body: JSON.stringify({
          items: [{
            operation: "update",
            key: "eventStarted",
            value: !Boolean(formData.get("eventStarted"))
          }]
        })
      }).then(res => res.json())

    revalidatePath("/admin")
    return result
  }
  catch (error) {
    console.error(error)
    return error
  }
}

export async function updateTimerStatusServerAction(formData: FormData) {
  try {
    const result = await fetch(
      `https://api.vercel.com/v1/edge-config/${process.env.EDGE_CONFIG_ID}/items?teamId=${process.env.VERCEL_TEAM_ID}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`
        },
        body: JSON.stringify({
          items: [
            {
            operation: "update",
            key: "timerOn",
            value: !Boolean(formData.get("timerOn"))
          },
          {
            operation: "update",
            key: "timerToggleTimestamp",
            value: Date.now()
          }
        ]
        })
      }).then(res => res.json())

    revalidatePath("/admin")
    return result
  }
  catch (error) {
    console.error(error)
    return error
  }
}

export async function deleteParticipantServerAction(formData: FormData) {
  const email = formData.get("email") as string
  await deleteParticipant(email)
  revalidatePath("/admin")
}

export async function resetTeamTimeServerAction(formData: FormData) {
  const teamId = formData.get("teamId") as string
  await resetTeamTime(teamId)
  revalidatePath("/admin")
}
