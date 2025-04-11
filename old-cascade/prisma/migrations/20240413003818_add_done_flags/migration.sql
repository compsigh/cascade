-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "partOneDone" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "partThreeDone" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "partTwoDone" BOOLEAN NOT NULL DEFAULT false;
