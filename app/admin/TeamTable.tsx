import { Button } from "@/components/Button"
import {
  deleteParticipantServerAction,
  deleteRiddleServerAction,
  removeParticipantFromTeamServerAction,
  resetTeamTimeServerAction,
  toggleTeamRiddleProgressAction
} from "@/functions/actions"
import { getAllRiddles, getAllTeamsParticipants } from "@/functions/db"

export default async function TeamTable() {
  const teams = await getAllTeamsParticipants()
  const riddles = await getAllRiddles()
  return (
    <table>
      <thead>
        <tr>
          <th>participants</th>
          <th>total time</th>
          {riddles.map((riddle) => (
            <th key={riddle.number}>
              riddle {riddle.number}
              <form action={deleteRiddleServerAction}>
                <input
                  type="hidden"
                  name="riddleNumber"
                  value={riddle.number}
                />
                <Button type="submit">❌</Button>
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
                  {participant.name}{" "}
                  <form
                    action={removeParticipantFromTeamServerAction}
                    key={participant.email + "removeFromTeam"}
                    style={{ display: "inline" }}
                  >
                    <input
                      type="hidden"
                      name="email"
                      value={participant.email}
                    />
                    <Button type="submit">🆓</Button>
                  </form>{" "}
                  <form
                    action={deleteParticipantServerAction}
                    key={participant.email + "deleteParticipant"}
                    style={{ display: "inline" }}
                  >
                    <input
                      type="hidden"
                      name="email"
                      value={participant.email}
                    />
                    <Button type="submit">❌</Button>
                  </form>
                </div>
              ))}
            </td>
            <td>
              <form action={resetTeamTimeServerAction}>
                <input type="hidden" name="teamId" value={team.id} />
                {team.totalTime} <Button type="submit">🔁</Button>
              </form>
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
                ? riddleProgress.mostRecentSubmission.toLocaleTimeString()
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
                    <Button type="submit">
                      {completionStatus}

                      {lastSubmissionTime}
                    </Button>
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
