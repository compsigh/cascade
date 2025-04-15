import { getAllRiddles, getAllTeamsParticipants } from "@/functions/db";

export default async function TeamTable() {
  const teams = await getAllTeamsParticipants();
  const riddles = await getAllRiddles();
  return (
    <table>
      <thead>
        <tr>
          <th>participants</th>
          <th>total time</th>
          {riddles.map((riddle) => (
            <th>riddle {riddle.number}</th>
          ))}
          <th>actions</th>
        </tr>
      </thead>
      <tbody>
        {teams.map((team) => (
          <tr key={team.id}>
            <td>{team.participants.map((participant) => participant.name)}</td>
            <td>{team.totalTime}</td>
            {riddles.map((riddle) => (
              <td>
                {team.riddlesProgresses.find(
                  (progress) => progress.riddleNumber === riddle.number,
                )?.completed
                  ? "✅"
                  : "❌"}
              </td>
            ))}
            <td>meow</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
