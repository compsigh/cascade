-- CreateTable
CREATE TABLE "Invite" (
    "id" TEXT NOT NULL,
    "fromParticipantEmail" TEXT NOT NULL,
    "toParticipantEmail" TEXT NOT NULL,

    CONSTRAINT "Invite_pkey" PRIMARY KEY ("id")
);
