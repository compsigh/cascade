import { Prisma, PrismaClient } from "../generated/client";

import { get } from "@vercel/edge-config";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;

export async function getAllParticipants() {
  const participants = await prisma.participant.findMany();
  return participants;
}

export async function createParticipant(name: string, email: string) {
  const riddles = await prisma.riddle.findMany();

  const participant = await prisma.participant.create({
    data: {
      name,
      email,
      team: {
        create: {
          riddlesProgresses: {
            create: riddles.map((riddle) => ({
              riddleNumber: riddle.number,
              completed: false,
            })),
          },
        },
      },
    },
  });

  return participant;
}

export async function getParticipantByEmail(email: string) {
  const participant = await prisma.participant.findUnique({
    where: {
      email,
    },
  });

  return participant;
}

export async function deleteParticipant(email: string) {
  const participant = await getParticipantByEmail(email);

  if (!participant) return null;

  const team = await prisma.team.findUnique({
    where: { id: participant.teamId },
    include: { participants: true },
  });

  if (!team) return null;

  if (team.participants.length === 1) {
    await prisma.$transaction([
      prisma.riddleProgress.deleteMany({
        where: { teamId: team.id },
      }),
      prisma.participant.delete({
        where: { email },
      }),
      prisma.team.delete({
        where: { id: team.id },
      }),
    ]);
  } else {
    await prisma.participant.delete({
      where: { email },
    });
  }
}

export async function deleteAllParticipants() {
  const users = await prisma.participant.deleteMany();
  await prisma.riddleProgress.deleteMany();
  await prisma.team.deleteMany();
  return users;
}

export async function getTeamById(id: string) {
  const team = await prisma.team.findUnique({
    where: {
      id,
    },
    include: {
      participants: true,
    },
  });

  return team;
}

export async function deleteTeam(id: string) {
  return await prisma.team.delete({
    where: {
      id,
    },
  });
}

export async function deleteTeamAndProgresses(id: string) {
  // Delete all riddle progresses associated with the team
  await prisma.riddleProgress.deleteMany({
    where: {
      teamId: id,
    },
  });

  // Delete the team
  await prisma.team.delete({
    where: {
      id: id,
    },
  });
}

export async function dissolveAllTeams() {
  const teams = await prisma.team.findMany({
    include: { participants: true },
  });

  for (const team of teams) {
    if (team.participants.length > 1) {
      const transaction: Prisma.PrismaPromise<any>[] = [];

      const riddles = await prisma.riddle.findMany();

      for (const participant of team.participants) {
        transaction.push(
          prisma.participant.update({
            where: { email: participant.email },
            data: {
              team: {
                create: {
                  riddlesProgresses: {
                    create: riddles.map((riddle) => ({
                      riddleNumber: riddle.number,
                      completed: false,
                    })),
                  },
                },
              },
            },
          }),
        );
      }

      transaction.push(
        prisma.riddleProgress.deleteMany({
          where: { teamId: team.id },
        }),
      );

      transaction.push(
        prisma.team.delete({
          where: { id: team.id },
        }),
      );

      await prisma.$transaction(transaction);
    }
  }
}

export async function getAllTeams() {
  const teams = await prisma.team.findMany({
    include: {
      participants: true,
    },
  });
  return teams;
}

export async function deleteAllParticipantsAndTeams() {
  const participants = await prisma.participant.deleteMany();
  const teams = await prisma.team.deleteMany();
  return { participants, teams };
}

export async function updateParticipantTeam(email: string, teamId: string) {
  const participant = await getParticipantByEmail(email);

  if (!participant) return null;

  const formerTeam = await prisma.team.findUnique({
    where: {
      id: participant.teamId,
    },
    include: {
      participants: true,
    },
  });

  if (!formerTeam) return null;

  if (formerTeam.id === teamId) return null;

  // Set new team's participants to include participant
  await prisma.team.update({
    where: {
      id: teamId,
    },
    data: {
      participants: {
        connect: {
          email,
        },
      },
    },
  });

  // Remove the participant from their former team
  const otherParticipants = formerTeam.participants.filter(
    (participant) => participant.email !== email,
  );

  await prisma.team.update({
    where: {
      id: formerTeam.id,
    },
    data: {
      participants: {
        set: otherParticipants,
      },
    },
  });

  // Clean up former team if it has no participants other than the one removed
  if (formerTeam.participants.length === 1)
    await deleteTeamAndProgresses(formerTeam.id);
}

export async function removeParticipantFromTeam(email: string) {
  const participant = await getParticipantByEmail(email);

  if (!participant) return null;

  const currentTeam = await prisma.team.findUnique({
    where: { id: participant.teamId },
    include: { participants: true },
  });

  if (!currentTeam) return null;
  const riddles = await prisma.riddle.findMany();

  if (currentTeam.participants.length === 1) {
    return null;
  }

  await prisma.$transaction(async (prisma) => {
    const newTeam = await prisma.team.create({
      data: {
        riddlesProgresses: {
          create: riddles.map((riddle) => ({
            riddleNumber: riddle.number,
            completed: false,
          })),
        },
      },
    });

    await prisma.participant.update({
      where: { email },
      data: {
        team: { connect: { id: newTeam.id } },
      },
    });
  });
}

export async function sendInvite(from: string, to: string) {
  const invite = await prisma.invite.create({
    data: {
      fromParticipantEmail: from,
      toParticipantEmail: to,
    },
  });

  return invite;
}

export async function getInvitesToEmail(email: string) {
  const invites = await prisma.invite.findMany({
    where: {
      toParticipantEmail: email,
    },
  });

  return invites;
}

export async function getInvitesFromEmail(email: string) {
  const invites = await prisma.invite.findMany({
    where: {
      fromParticipantEmail: email,
    },
  });

  return invites;
}

export async function acceptInvite(id: string) {
  const invite = await prisma.invite.findUnique({
    where: {
      id,
    },
  });

  if (!invite) return null;

  const fromParticipant = await getParticipantByEmail(
    invite.fromParticipantEmail,
  );
  if (!fromParticipant) return null;
  const fromParticipantTeamId = fromParticipant.teamId;

  const toParticipant = await getParticipantByEmail(invite.toParticipantEmail);
  if (!toParticipant) return null;

  await prisma.invite.delete({
    where: {
      id,
    },
  });

  return await updateParticipantTeam(
    toParticipant.email,
    fromParticipantTeamId,
  );
}

export async function declineInvite(id: string) {
  const invite = await prisma.invite.delete({
    where: {
      id,
    },
  });

  return invite;
}

export async function cancelInvite(id: string) {
  return await declineInvite(id);
}

export async function resetTeamTime(id: string) {
  return await prisma.team.update({
    where: {
      id,
    },
    data: {
      totalTime: 0,
    },
  });
}

export async function logTeamTime(id: string, time: number) {
  const team = await prisma.team.findUnique({
    where: {
      id,
    },
  });

  if (!team) return null;

  if (team.totalTime !== 0) return null;

  return await prisma.team.update({
    where: {
      id,
    },
    data: {
      totalTime: time,
    },
  });
}

// Get all riddles
export async function getAllRiddles() {
  return prisma.riddle.findMany();
}

// Get all progresses for a riddle given a riddle number
export async function getRiddleProgresses(riddleNumber: number) {
  return prisma.riddleProgress.findMany({
    where: {
      riddleNumber: riddleNumber,
    },
  });
}

// Get the progress of a riddle for a team given riddle number and team number
export async function getTeamRiddleProgress(
  teamId: string,
  riddleNumber: number,
) {
  return prisma.riddleProgress.findUnique({
    where: {
      teamId_riddleNumber: {
        riddleNumber: riddleNumber,
        teamId: teamId,
      },
    },
  });
}

// Function that populates all teams with riddle progresses
export async function populateAllTeamsWithRiddleProgresses() {
  const teams = await prisma.team.findMany();

  for (const team of teams) {
    const riddles = await prisma.riddle.findMany();

    for (const riddle of riddles) {
      // Check if a progress entry already exists for this team and riddle
      const existingProgress = await prisma.riddleProgress.findUnique({
        where: {
          teamId_riddleNumber: {
            riddleNumber: riddle.number,
            teamId: team.id,
          },
        },
      });

      // If progress entry doesn't exist, create a new one
      if (!existingProgress) {
        await prisma.riddleProgress.create({
          data: {
            riddleNumber: riddle.number,
            teamId: team.id,
            completed: false, // Initialize as not completed
          },
        });
      }
    }
  }
}

export async function resetAllTeamsRiddleProgresses() {
  try {
    const [teams, riddles] = await Promise.all([
      prisma.team.findMany(),
      prisma.riddle.findMany(),
    ]);

    const upsertOperations = teams.flatMap((team) =>
      riddles.map((riddle) =>
        prisma.riddleProgress.upsert({
          where: {
            teamId_riddleNumber: {
              teamId: team.id,
              riddleNumber: riddle.number,
            },
          },
          update: { completed: false },
          create: {
            riddleNumber: riddle.number,
            teamId: team.id,
            completed: false,
          },
        }),
      ),
    );

    await prisma.$transaction(upsertOperations);
  } catch (error) {
    console.error("Error resetting riddle progresses:", error);
    throw new Error("Failed to reset progress");
  }
}

export async function createRiddleProgress(
  riddleNumber: number,
  teamId: string,
) {
  return prisma.riddleProgress.create({
    data: {
      riddleNumber: riddleNumber,
      teamId: teamId,
    },
  });
}

// Create a riddle given the strings
export async function createRiddle(
  riddleNumber: number,
  text: string,
  input: string,
  solution: string,
) {
  const teams = await prisma.team.findMany();

  await prisma.$transaction([
    prisma.riddle.create({
      data: {
        number: riddleNumber,
        text: text,
        input: input,
        solution: solution,
      },
    }),
    ...teams.map((team) =>
      prisma.riddleProgress.create({
        data: {
          teamId: team.id,
          riddleNumber: riddleNumber,
          completed: false,
        },
      }),
    ),
  ]);
}

// Check if a riddle for a team was last submitted in the past n seconds
export async function isRiddleSubmittedRecently(
  riddleNumber: number,
  teamId: string,
): Promise<{ canSubmit: boolean; timeLeft: number }> {
  const progress = await prisma.riddleProgress.findUnique({
    where: {
      teamId_riddleNumber: {
        riddleNumber: riddleNumber,
        teamId: teamId,
      },
    },
  });

  const cooldownSeconds = ((await get("cooldownTimer")) as number) || 60; // Default to 60 seconds if not configured

  if (!progress || !progress.mostRecentSubmission) {
    return { canSubmit: true, timeLeft: 0 };
  }

  const lastSubmittedTime = progress.mostRecentSubmission.getTime();
  const currentTime = Date.now();
  const diff = currentTime - lastSubmittedTime;
  const timeLeft = Math.max(0, cooldownSeconds - diff / 1000); // Time left in seconds

  return { canSubmit: diff >= cooldownSeconds * 1000, timeLeft: timeLeft };
}

// Check if a team has completed every riddle
export async function hasTeamCompletedEveryRiddle(teamId: string) {
  const riddles = await prisma.riddle.findMany();
  const riddleCount = riddles.length;

  const completedRiddlesCount = await prisma.riddleProgress.count({
    where: {
      teamId: teamId,
      completed: true,
    },
  });

  return completedRiddlesCount === riddleCount;
}

// Get the progress a team has over every riddle (how many riddles have they finished)
export async function getNumberOfCorrectRiddles(
  teamId: string,
): Promise<number> {
  return prisma.riddleProgress.count({
    where: {
      teamId: teamId,
      completed: true,
    },
  });
}

// Function that returns if a string is the same as a riddle's solution
export async function isCorrectSolution(
  riddleNumber: number,
  submission: string,
): Promise<boolean> {
  const riddle = await prisma.riddle.findUnique({
    where: {
      number: riddleNumber,
    },
  });

  if (!riddle) {
    return false; // Riddle not found
  }

  return submission === riddle.solution;
}

// Function that updates the most recent submission time on a riddle for a team to be now
export async function updateSubmissionTime(
  riddleNumber: number,
  teamId: string,
) {
  return prisma.riddleProgress.update({
    where: {
      teamId_riddleNumber: {
        riddleNumber: riddleNumber,
        teamId: teamId,
      },
    },
    data: {
      mostRecentSubmission: new Date(),
    },
  });
}

// Function that updates a team's riddle completion to be complete
export async function completeTeamRiddle(riddleNumber: number, teamId: string) {
  return prisma.riddleProgress.update({
    where: {
      teamId_riddleNumber: {
        riddleNumber: riddleNumber,
        teamId: teamId,
      },
    },
    data: {
      completed: true,
    },
  });
}

export async function updateTeamRiddleProgress(
  teamId: string,
  riddleNumber: number,
  complete: boolean,
) {
  return prisma.riddleProgress.update({
    where: {
      teamId_riddleNumber: {
        riddleNumber: riddleNumber,
        teamId: teamId,
      },
    },
    data: {
      completed: complete,
    },
  });
}

// Modify getAllTeams to include riddle progresses
export async function getAllTeamsParticipants() {
  const teams = await prisma.team.findMany({
    include: {
      participants: true,
      riddlesProgresses: true,
    },
    orderBy: {
      totalTime: "asc",
    },
  });
  return teams;
}

// New function to fetch all riddle completions
export async function getAllRiddleProgresses() {
  return prisma.riddleProgress.findMany({
    include: {
      team: true,
      riddle: true,
    },
  });
}

export async function deleteRiddle(riddleNumber: number) {
  await prisma.$transaction([
    prisma.riddleProgress.deleteMany({
      where: {
        riddleNumber: riddleNumber,
      },
    }),
    prisma.riddle.delete({
      where: {
        number: riddleNumber,
      },
    }),
  ]);
}

export async function deleteAllRiddles() {
  await prisma.$transaction([
    prisma.riddleProgress.deleteMany(),
    prisma.riddle.deleteMany(),
  ]);
}

export async function dissolveTeam(teamId: string) {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: { participants: true },
  });

  if (!team) return null;

  if (team.participants.length === 1) {
    return null;
  }

  const transaction: Prisma.PrismaPromise<any>[] = [];

  const riddles = await prisma.riddle.findMany();

  for (const participant of team.participants) {
    transaction.push(
      prisma.participant.update({
        where: { email: participant.email },
        data: {
          team: {
            create: {
              riddlesProgresses: {
                create: riddles.map((riddle) => ({
                  riddleNumber: riddle.number,
                  completed: false,
                })),
              },
            },
          },
        },
      }),
    );
  }

  transaction.push(
    prisma.riddleProgress.deleteMany({
      where: { teamId },
    }),
  );

  transaction.push(
    prisma.team.delete({
      where: { id: teamId },
    }),
  );

  // Run all operations in a transaction
  await prisma.$transaction(transaction);
}

export async function addParticipantToTeam(
  participantEmail: string,
  newTeamId: string,
) {
  const participant = await prisma.participant.findUnique({
    where: { email: participantEmail },
    include: { team: true },
  });

  if (!participant) {
    throw new Error(`Participant with email ${participantEmail} not found`);
  }

  const oldTeamId = participant.teamId;

  if (!oldTeamId) {
    await prisma.participant.update({
      where: { email: participantEmail },
      data: { teamId: newTeamId },
    });
    return;
  }

  const oldTeam = await prisma.team.findUnique({
    where: { id: oldTeamId },
    include: { participants: true },
  });

  if (!oldTeam) {
    throw new Error(`Old team with id ${oldTeamId} not found`);
  }

  if (oldTeam.participants.length === 1) {
    await prisma.participant.update({
      where: { email: participantEmail },
      data: { teamId: newTeamId },
    });

    await prisma.riddleProgress.deleteMany({
      where: { teamId: oldTeamId },
    });

    await prisma.team.delete({
      where: { id: oldTeamId },
    });
  } else {
    await prisma.participant.update({
      where: { email: participantEmail },
      data: { teamId: newTeamId },
    });
  }
}
