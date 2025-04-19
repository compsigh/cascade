"use client"

import { useState } from "react"
import { Button } from "@/components/Button"
import { validateInputServerAction } from "@/functions/actions"

interface FormState {
  correct: boolean | null
  message: string
}

const initialState: FormState = {
  correct: null,
  message: ""
}

export function Input({
  riddleNumber,
  teamId
}: {
  riddleNumber: number
  teamId: string
}) {
  const [solution, setSolution] = useState("")
  const [state, setState] = useState<FormState>(initialState)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!solution.trim()) {
      setState({ correct: false, message: "Please enter a solution." })
      return
    }

    const formData = new FormData()
    formData.append("solution", solution)
    formData.append("riddleNumber", riddleNumber.toString())
    formData.append("teamId", teamId)

    const result = await validateInputServerAction(formData)
    setState({
      correct: result.correct,
      message:
        result.message ||
        (result.correct ? "Correct solution!" : "Incorrect solution!")
    })
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          id="solution"
          name="solution"
          value={solution}
          onChange={(e) => setSolution(e.target.value)}
        />
        <Button type="submit">Submit</Button>
      </form>
      {state.message && <p>{state.message}</p>}
    </>
  )
}
