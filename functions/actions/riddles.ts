"use server"

import {
  isRiddleSubmittedRecently,
  completeTeamRiddle,
  updateSubmissionTime
} from "@/functions/db/teams"
import {
  deleteAllRiddles,
  deleteRiddle,
  isCorrectSolution,
  upsertRiddle
} from "@/functions/db/riddles"
import { revalidatePath } from "next/cache"

export async function createRiddleServerAction(
  riddleNumber: number,
  text: string,
  input: string,
  solution: string
) {
  try {
    const riddle = await upsertRiddle(riddleNumber, text, input, solution)
    revalidatePath("/admin")
    return { success: true, message: "Riddle created successfully!", riddle }
  } catch (error) {
    console.error("Error creating riddle:", error)
    return { success: false, message: "Error creating riddle." }
  }
}

export async function validateInputServerAction(formData: FormData) {
  const teamId = formData.get("teamId") as string
  const riddleNumber = parseInt(formData.get("riddleNumber") as string)
  const solution = formData.get("solution") as string

  const submissionCheck = await isRiddleSubmittedRecently(riddleNumber, teamId)

  if (!submissionCheck.canSubmit) {
    return {
      correct: false,
      timeLeft: submissionCheck.timeLeft,
      message: "Please wait before submitting again."
    }
  }

  const isCorrect = await isCorrectSolution(riddleNumber, solution)

  if (isCorrect) {
    await completeTeamRiddle(riddleNumber, teamId)
    await updateSubmissionTime(riddleNumber, teamId)
    return { correct: true, timeLeft: null, message: "Correct solution!" }
  } else {
    await updateSubmissionTime(riddleNumber, teamId)
    return { correct: false, timeLeft: null, message: "Incorrect solution!" }
  }
}

export async function deleteRiddleServerAction(formData: FormData) {
  const riddleNumber = Number(formData.get("riddleNumber"))
  await deleteRiddle(riddleNumber)
}

export async function deleteAllRiddlesServerAction() {
  await deleteAllRiddles()
}
