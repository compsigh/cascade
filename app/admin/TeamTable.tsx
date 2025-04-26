import {
  deleteParticipantServerAction,
  removeParticipantFromTeamServerAction
} from "@/functions/actions/participants"
import { getAllTeams } from "@/functions/db/teams"
import { getAllRiddles } from "@/functions/db/riddles"
import { deleteRiddleServerAction } from "@/functions/actions/riddles"
import { toggleTeamRiddleProgressAction } from "@/functions/actions/teams"

import { Button } from "@/components/Button"

export async function TeamTable() {
  const teams = await getAllTeams()
  const riddles = await getAllRiddles()
  return (
    <table>
      <thead>
        <tr>
          <th>participants</th>
          {riddles.map((riddle) => (
            <th key={riddle.number}>
              riddle {riddle.number}
              <form action={deleteRiddleServerAction}>
                <input
                  type="hidden"
                  name="riddleNumber"
                  value={riddle.number}
                />
                <Button type="submit">Delete</Button>
              </form>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {teams.map((team) => (
          <tr key={team.id}>
            <td>
              {team.participants.map((participant) => (
                <div key={participant.name}>
                  <p>{participant.name}</p>
                  <form action={removeParticipantFromTeamServerAction}>
                    <input
                      type="hidden"
                      name="email"
                      value={participant.email}
                    />
                    <Button type="submit">Remove from team</Button>
                  </form>
                  <form action={deleteParticipantServerAction}>
                    <input
                      type="hidden"
                      name="email"
                      value={participant.email}
                    />
                    <Button type="submit">Remove from event</Button>
                  </form>
                </div>
              ))}
            </td>
            {riddles.map((riddle) => {
              const riddleProgress = team.riddlesProgresses.find(
                (progress) => progress.riddleNumber === riddle.number
              )

              if (!riddleProgress) {
                return (
                  <td key={`team-${team.id}-riddle-${riddle.number}`}>
                    no progress
                  </td>
                )
              }

              const completionStatus = riddleProgress?.completed ? "✅" : "❌"
              const lastSubmissionTime = riddleProgress?.mostRecentSubmission
                ? new Date(riddleProgress.mostRecentSubmission).toLocaleTimeString()
                : "No submissions"

              return (
                <td key={`team-${team.id}-riddle-${riddle.number}`}>
                  <form action={toggleTeamRiddleProgressAction}>
                    <input type="hidden" name="teamId" value={team.id} />
                    <input
                      type="hidden"
                      name="riddleNumber"
                      value={riddle.number}
                    />
                    <p>
                      {completionStatus} {lastSubmissionTime}
                    </p>
                    <Button type="submit">Toggle completion</Button>
                  </form>
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
