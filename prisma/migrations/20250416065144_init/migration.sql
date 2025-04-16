-- CreateTable
CREATE TABLE "Participant" (
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("email")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "totalTime" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiddleProgress" (
    "id" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "mostRecentSubmission" TIMESTAMP(3) NOT NULL,
    "teamId" TEXT NOT NULL,
    "riddleNumber" INTEGER NOT NULL,

    CONSTRAINT "RiddleProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Riddle" (
    "number" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "input" TEXT NOT NULL,
    "solution" TEXT NOT NULL,

    CONSTRAINT "Riddle_pkey" PRIMARY KEY ("number")
);

-- CreateTable
CREATE TABLE "Invite" (
    "id" TEXT NOT NULL,
    "fromParticipantEmail" TEXT NOT NULL,
    "toParticipantEmail" TEXT NOT NULL,

    CONSTRAINT "Invite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Participant_name_key" ON "Participant"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_email_key" ON "Participant"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RiddleProgress_teamId_riddleNumber_key" ON "RiddleProgress"("teamId", "riddleNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Riddle_number_key" ON "Riddle"("number");

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiddleProgress" ADD CONSTRAINT "RiddleProgress_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiddleProgress" ADD CONSTRAINT "RiddleProgress_riddleNumber_fkey" FOREIGN KEY ("riddleNumber") REFERENCES "Riddle"("number") ON DELETE RESTRICT ON UPDATE CASCADE;
