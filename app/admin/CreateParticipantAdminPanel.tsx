"use client"

import { Button } from "@/components/Button"
import { createParticipantServerAction } from "@/functions/actions"
import { useState, useActionState } from "react"
import { Spacer } from "@/components/Spacer"

interface FormState {
  success: boolean
  message: string
}

const initialState: FormState = {
  success: false,
  message: ""
}

export default function CreateParticipantAdminPanel() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  async function createParticipantFormAction(
    _prevState: FormState,
    formData: FormData
  ): Promise<FormState> {
    const name = formData.get("name") as string
    const email = formData.get("email") as string

    if (!name || !email)
      return { success: false, message: "Please fill in all fields." }

    return await createParticipantServerAction(name, email)
  }

  const [state, formAction] = useActionState(
    createParticipantFormAction,
    initialState
  )

  return (
    <>
      <h2>Create New Participant</h2>
      <form action={formAction}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Spacer size={10} />

        <label htmlFor="email">Email:</label>
        <input
          type="text"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Spacer size={10} />

        <Button type="submit">Create Participant</Button>
      </form>
      {state?.message && state.message}
    </>
  )
}
