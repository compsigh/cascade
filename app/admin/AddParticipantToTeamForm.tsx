"use client"

import { useState, useActionState } from "react"
import { addParticipantToTeamServerAction } from "@/functions/actions"

import type { Participant } from "@/generated/client"
import type { CompleteTeamData } from "@/functions/db"

import { Button } from "@/components/Button"
import { Spacer } from "@/components/Spacer"
import { SearchTeams } from "@/components/SearchTeams"
import { SearchParticipants } from "@/components/SearchParticipants"

interface FormState {
  success: boolean
  message: string
}

const initialState: FormState = {
  success: false,
  message: ""
}

interface AddParticipantToTeamAdminPanelProps {
  participants: Participant[]
  teams: CompleteTeamData[]
}

export function AddParticipantToTeamForm({
  participants,
  teams
}: AddParticipantToTeamAdminPanelProps) {
  const [email, setEmail] = useState("")
  const [teamId, setTeamId] = useState("")

  async function addParticipantToTeamFormAction() {
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
        <label htmlFor="email">Participant:</label>
        <SearchParticipants
          participants={participants}
          onSelect={(email) => setEmail(email)}
        />
        <Spacer size={12} />

        <label htmlFor="teamId">Team:</label>
        <SearchTeams teams={teams} onSelect={(teamId) => setTeamId(teamId)} />
        <Spacer size={12} />

        <Button type="submit">Add Participant to Team</Button>
      </form>
      {state?.message && state.message}
    </>
  )
}
