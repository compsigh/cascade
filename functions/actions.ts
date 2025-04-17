"use server";
import {
  addParticipantToTeam,
  completeTeamRiddle,
  createParticipant,
  dissolveAllTeams,
  deleteAllParticipants,
  deleteAllRiddles,
  deleteRiddle,
  getTeamRiddleProgress,
  isCorrectSolution,
  isRiddleSubmittedRecently,
  resetAllTeamsRiddleProgresses,
  updateSubmissionTime,
  updateTeamRiddleProgress,
  upsertRiddle,
} from "@/functions/db";

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

export async function createRiddleServerAction(
  riddleNumber: number,
  text: string,
  input: string,
  solution: string,
) {
  try {
    await upsertRiddle(riddleNumber, text, input, solution);
    revalidatePath("/admin");
    return { success: true, message: "Riddle created successfully!" };
  } catch (error) {
    console.error("Error creating riddle:", error);
    return { success: false, message: "Error creating riddle." };
  }
}

export async function createParticipantServerAction(
  name: string,
  email: string,
) {
  try {
    await createParticipant(name, email);
    revalidatePath("/admin");
    return { success: true, message: "Participant created successfully!" };
  } catch (error) {
    console.error("Error creating riddle:", error);
    return { success: false, message: "Error creating participant." };
  }
}

export async function toggleTeamRiddleProgressAction(
  formData: FormData,
): Promise<void> {
  const teamId = formData.get("teamId") as string;
  const riddleNumber = Number(formData.get("riddleNumber"));
  const teamProgress = await getTeamRiddleProgress(teamId, riddleNumber);
  if (teamProgress == null) {
    return;
  }
  updateTeamRiddleProgress(teamId, riddleNumber, !teamProgress.completed);
  revalidatePath("/admin");
}

export async function resetAllTeamRiddleProgressAction() {
  await resetAllTeamsRiddleProgresses();
  revalidatePath("/admin");
}

export async function deleteAllParticipantsServerAction() {
  await deleteAllParticipants();
  revalidatePath("/admin");
}

export async function dissolveAllTeamsServerAction() {
  await dissolveAllTeams();
  revalidatePath("/admin");
}

export async function validateInputServerAction(formData: FormData) {
  const teamId = formData.get("teamId") as string;
  const riddleNumber = parseInt(formData.get("riddleNumber") as string);
  const solution = formData.get("solution") as string;

  const submissionCheck = await isRiddleSubmittedRecently(riddleNumber, teamId);

  if (!submissionCheck.canSubmit) {
    return {
      correct: false,
      timeLeft: submissionCheck.timeLeft,
      message: "Please wait before submitting again.",
    };
  }

  const isCorrect = await isCorrectSolution(riddleNumber, solution);

  if (isCorrect) {
    await completeTeamRiddle(riddleNumber, teamId);
    await updateSubmissionTime(riddleNumber, teamId);
    return { correct: true, timeLeft: null, message: "Correct solution!" };
  } else {
    await updateSubmissionTime(riddleNumber, teamId);
    return { correct: false, timeLeft: null, message: "Incorrect solution!" };
  }
}

export async function updateTeamRiddleProgressServerAction(formData: FormData) {
  const teamId = formData.get("teamId") as string;
  const number = parseInt(formData.get("number") as string);
  const complete = formData.get("complete") === "true";

  await updateTeamRiddleProgress(teamId, number, complete);
}
export async function deleteRiddleServerAction(formData: FormData) {
  const riddleNumber = Number(formData.get("riddleNumber"));
  await deleteRiddle(riddleNumber);
}
export async function deleteAllRiddlesServerAction() {
  await deleteAllRiddles();
}
export async function addParticipantToTeamServerAction(
  email: string,
  teamId: string,
) {
  try {
    await addParticipantToTeam(email, teamId);
    revalidatePath("/admin");
    return { success: true, message: "Successfully added participant to team" };
  } catch (error) {
    console.error("Error adding participant to team:", error);
    return { success: false, message: "Error adding participant to team" };
  }
}
