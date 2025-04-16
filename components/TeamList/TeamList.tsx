import { getParticipantByEmail, getTeamById } from "@/functions/db";
import { User } from "next-auth";

// TOOD: Add loading state so it doesn't block page load

export async function TeamList({ user }: { user: User }) {
  if (!user || !user.email || !user.name)
    return null;

  const participant = await getParticipantByEmail(user.email);
  const teamId = participant!.teamId;
  const team = await getTeamById(teamId);

  const teamMemberNames: string[] = team!.participants.map((p) => p.name);

  console.log("teammate names: ", teamMemberNames);

  return (
    <ul>
      {teamMemberNames.map((name, index) => (
        <li key={index} className="normalText hoverableText">
          {name}
        </li>
      ))}
    </ul>
  );
}
