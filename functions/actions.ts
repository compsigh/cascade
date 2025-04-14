"use server";

import { revalidatePath } from "next/cache";
import { deleteParticipant, removeParticipantFromTeam, resetTeamTime } from "./db";

export async function removeParticipantFromTeamServerAction(formData: FormData): Promise<void> {
  const rawFormData = {
    email: formData.get("email") as string,
  };

  await removeParticipantFromTeam(rawFormData.email);
  revalidatePath("/admin");
  return;
}

export async function toggleEventStatusServerAction(formData: FormData): Promise<any> {
  try {
    const result = await fetch(
      `https://api.vercel.com/v1/edge-config/${process.env.EDGE_CONFIG_ID}/items?teamId=${process.env.VERCEL_TEAM_ID}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
        },
        body: JSON.stringify({
          items: [{
            operation: "update",
            key: "eventStarted",
            value: !formData.get("eventStarted"),
          }],
        }),
      },
    ).then(res => res.json());
    revalidatePath("/admin");
    return result;
  } catch (error) {
    console.error(error);
    return { error: String(error) };
  }
}

export async function updateTimerStatusServerAction(formData: FormData): Promise<any> {
  try {
    const result = await fetch(
      `https://api.vercel.com/v1/edge-config/${process.env.EDGE_CONFIG_ID}/items?teamId=${process.env.VERCEL_TEAM_ID}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
        },
        body: JSON.stringify({
          items: [
            {
              operation: "update",
              key: "timerOn",
              value: !formData.get("timerOn"),
            },
            {
              operation: "update",
              key: "timerToggleTimestamp",
              value: Date.now(),
            },
          ],
        }),
      },
    ).then(res => res.json());
    revalidatePath("/admin");
    return result;
  } catch (error) {
    console.error(error);
    return { error: String(error) };
  }
}

export async function deleteParticipantServerAction(formData: FormData): Promise<void> {
  const email = formData.get("email") as string;
  await deleteParticipant(email);
  revalidatePath("/admin");
  return;
}

export async function resetTeamTimeServerAction(formData: FormData): Promise<void> {
  const teamId = formData.get("teamId") as string;
  await resetTeamTime(teamId);
  revalidatePath("/admin");
  return;
}
