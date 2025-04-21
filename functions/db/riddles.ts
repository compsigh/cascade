import prisma from "@/functions/db"

export async function getAllRiddles() {
  return await prisma.riddle.findMany({
    orderBy: { number: "asc" }
  })
}

export async function getRiddle(riddleNumber: number) {
  return await prisma.riddle.findUnique({
    where: { number: riddleNumber }
  })
}

export async function upsertRiddle(
  riddleNumber: number,
  text: string,
  input: string,
  solution: string
) {
  const existingRiddle = await prisma.riddle.findUnique({
    where: { number: riddleNumber }
  })

  await prisma.riddle.upsert({
    where: { number: riddleNumber },
    update: {
      text: text,
      input: input,
      solution: solution
    },
    create: {
      number: riddleNumber,
      text: text,
      input: input,
      solution: solution
    }
  })

  if (!existingRiddle) {
    const teams = await prisma.team.findMany()
    await prisma.$transaction(
      teams.map((team) =>
        prisma.riddleProgress.create({
          data: {
            teamId: team.id,
            riddleNumber: riddleNumber,
            completed: false
          }
        })
      )
    )
  }

  return await prisma.riddle.findUnique({
    where: { number: riddleNumber }
  })
}

export async function deleteRiddle(riddleNumber: number) {
  return await prisma.$transaction([
    prisma.riddleProgress.deleteMany({
      where: { riddleNumber: riddleNumber }
    }),
    prisma.riddle.delete({
      where: { number: riddleNumber }
    })
  ])
}

export async function deleteAllRiddles() {
  return await prisma.$transaction([
    prisma.riddleProgress.deleteMany(),
    prisma.riddle.deleteMany()
  ])
}

export async function isCorrectSolution(
  riddleNumber: number,
  submission: string
) {
  const riddle = await prisma.riddle.findUnique({
    where: { number: riddleNumber }
  })
  if (!riddle) return false // Riddle not found
  return submission === riddle.solution
}
