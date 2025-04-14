"use server";

import {
  deleteParticipant,
  removeParticipantFromTeam,
  resetTeamTime,
} from "./db";
import { revalidatePath } from "next/cache";

export async function removeParticipantFromTeamServerAction(
  formData: FormData,
): Promise<void> {
  const rawFormData = {
    email: formData.get("email") as string,
  };

  revalidatePath("/admin");
  await removeParticipantFromTeam(rawFormData.email);
}

export async function toggleEventStatusServerAction(
  formData: FormData,
): Promise<void> {
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
              key: "eventStarted",
              value: !Boolean(formData.get("eventStarted")),
            },
          ],
        }),
      },
    ).then((res) => res.json());

    revalidatePath("/admin");
    result;
  } catch (error) {
    console.error(error);
    error;
  }
}

export async function updateTimerStatusServerAction(
  formData: FormData,
): Promise<void> {
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
              value: !Boolean(formData.get("timerOn")),
            },
            {
              operation: "update",
              key: "timerToggleTimestamp",
              value: Date.now(),
            },
          ],
        }),
      },
    ).then((res) => res.json());

    revalidatePath("/admin");
    result;
  } catch (error) {
    console.error(error);
    error;
  }
}

export async function deleteParticipantServerAction(
  formData: FormData,
): Promise<void> {
  const email = formData.get("email") as string;
  await deleteParticipant(email);
  revalidatePath("/admin");
}

export async function resetTeamTimeServerAction(
  formData: FormData,
): Promise<void> {
  const teamId = formData.get("teamId") as string;
  await resetTeamTime(teamId);
  revalidatePath("/admin");
}
