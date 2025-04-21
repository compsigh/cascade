"use server"

import { revalidatePath } from "next/cache"

export async function toggleEventStatusServerAction(formData: FormData) {
  const eventStarted = Boolean(formData.get("eventStarted"))
  try {
    const result = await fetch(
      `https://api.vercel.com/v1/edge-config/${process.env.EDGE_CONFIG_ID}/items?teamId=${process.env.VERCEL_TEAM_ID}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.VERCEL_API_TOKEN}`
        },
        body: JSON.stringify({
          items: [
            {
              operation: "update",
              key: "eventStarted",
              value: !eventStarted
            }
          ]
        })
      }
    ).then((res) => res.json())

    revalidatePath("/admin")
    return result
  } catch (error) {
    console.error(error)
    return error
  }
}

export async function updateTimerStatusServerAction(formData: FormData) {
  const timerOn = Boolean(formData.get("timerOn"))
  try {
    const result = await fetch(
      `https://api.vercel.com/v1/edge-config/${process.env.EDGE_CONFIG_ID}/items?teamId=${process.env.VERCEL_TEAM_ID}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.VERCEL_API_TOKEN}`
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
      }
    ).then((res) => res.json())

    revalidatePath("/admin")
    return result
  } catch (error) {
    console.error(error)
    return error
  }
}
