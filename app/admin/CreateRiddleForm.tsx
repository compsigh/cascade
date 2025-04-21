"use client"

import { useState, useActionState } from "react"
import { createRiddleServerAction } from "@/functions/actions/riddles"

import { Button } from "@/components/Button"
import { Spacer } from "@/components/Spacer"

interface FormState {
  success: boolean
  message: string
}

const initialState: FormState = {
  success: false,
  message: ""
}

export function CreateRiddleForm() {
  const [riddleNumber, setRiddleNumber] = useState("")
  const [text, setText] = useState("")
  const [inputVal, setInputVal] = useState("")
  const [solution, setSolution] = useState("")

  async function createRiddleFormAction(
    _prevState: FormState,
    formData: FormData
  ) {
    const riddleNumber = parseInt(formData.get("riddleNumber") as string)
    const text = formData.get("text") as string
    const input = formData.get("inputVal") as string
    const solution = formData.get("solution") as string

    if (isNaN(riddleNumber) || !text || !input || !solution)
      return { success: false, message: "Please fill in all fields." }

    return await createRiddleServerAction(riddleNumber, text, input, solution)
  }

  const [state, formAction] = useActionState(
    createRiddleFormAction,
    initialState
  )

  return (
    <>
      <h2>Create New Riddle</h2>
      <form action={formAction}>
        <label htmlFor="riddleNumber">Riddle Number:</label>{" "}
        <input
          type="number"
          pattern="^[1-9][0-9]*$"
          id="riddleNumber"
          name="riddleNumber"
          value={riddleNumber}
          onChange={(e) => setRiddleNumber(e.target.value)}
          required
        />
        <Spacer size={12} />
        <label htmlFor="text">Text:</label>{" "}
        <textarea
          id="text"
          name="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <Spacer size={12} />
        <label htmlFor="inputVal">Input:</label>{" "}
        <textarea
          id="inputVal"
          name="inputVal"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          required
        />
        <Spacer size={12} />
        <label htmlFor="solution">Solution:</label>{" "}
        <input
          type="text"
          id="solution"
          name="solution"
          value={solution}
          onChange={(e) => setSolution(e.target.value)}
          required
        />
        <Spacer size={12} />
        <Button type="submit">Create Riddle</Button>
      </form>
      {state?.message && state.message}
    </>
  )
}
