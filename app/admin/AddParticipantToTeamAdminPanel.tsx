"use client"

import { Button } from "@/components/Button"
import { addParticipantToTeamServerAction } from "@/functions/actions"
import { useState, useActionState } from "react"
import { Spacer } from "@/components/Spacer"
import { SearchParticipants } from "@/components/SearchParticipants"
import { SearchTeams } from "@/components/SearchTeams"

interface FormState {
  success: boolean
  message: string
}

const initialState: FormState = {
  success: false,
  message: ""
}

type Participant = {
  name: string
  email: string
  teamId: string
}

type Team = {
  id: string
  totalTime: number
  participants: Participant[]
}

interface AddParticipantToTeamAdminPanelProps {
  participants: Participant[]
  teams: Team[]
}

export default function AddParticipantToTeamAdminPanel({
  participants,
  teams
}: AddParticipantToTeamAdminPanelProps) {
  const [email, setEmail] = useState("")
  const [teamId, setTeamId] = useState("")

  async function addParticipantToTeamFormAction(): Promise<FormState> {
    if (!email || !teamId)
      return { success: false, message: "Please fill in all fields." }

    return await addParticipantToTeamServerAction(email, teamId)
  }

  const [state, formAction] = useActionState(
    addParticipantToTeamFormAction,
    initialState
  )

  return (
    <>
      <h2>Add Participant To Team</h2>
      <form action={formAction}>
        <label htmlFor="email">participant:</label>
        <SearchParticipants
          participants={participants}
          onSelect={(email) => setEmail(email)}
        />
        <Spacer size={10} />

        <label htmlFor="teamId">team:</label>
        <SearchTeams teams={teams} onSelect={(teamId) => setTeamId(teamId)} />
        <Spacer size={10} />

        <Button type="submit">Add Participant to Team</Button>
      </form>
      {state?.message && state.message}
    </>
  )
}
