"use server"

import { revalidatePath } from "next/cache"
import { removeParticipantFromTeam, resetTeamTime } from "./db"

export async function removeFromTeamServerAction(formData: FormData) {
  const rawFormData = {
    email: formData.get("email") as string
  }

  revalidatePath("/admin")
  return await removeParticipantFromTeam(rawFormData.email)
}

export async function toggleEventStatusServerAction() {
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
            value: !eventStarted
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

export async function updateTimerStatusServerAction() {
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
            value: !timerOn
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

export async function updatePartServerAction(formData: FormData) {
  const action = formData.get("action") as string
  const newPart = action === "increment" ? part + 1 : part - 1
  if (newPart < 1 || newPart > 3)
    return

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
            key: "part",
            value: newPart
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

export async function deleteParticipantServerAction(formData: FormData) {
  const email = formData.get("email") as string
  await removeParticipantFromTeam(email)
  revalidatePath("/admin")
}

export async function resetTeamTimeServerAction(formData: FormData) {
  const teamId = formData.get("teamId") as string
  await resetTeamTime(teamId)
  revalidatePath("/admin")
}
