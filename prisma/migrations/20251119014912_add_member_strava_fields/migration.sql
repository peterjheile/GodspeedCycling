/*
  Warnings:

  - A unique constraint covering the columns `[stravaInviteToken]` on the table `Member` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "stravaAccessToken" TEXT,
ADD COLUMN     "stravaAthleteId" INTEGER,
ADD COLUMN     "stravaConnectedAt" TIMESTAMP(3),
ADD COLUMN     "stravaInviteExpiresAt" TIMESTAMP(3),
ADD COLUMN     "stravaInviteToken" TEXT,
ADD COLUMN     "stravaRefreshToken" TEXT,
ADD COLUMN     "stravaTokenExpiresAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Member_stravaInviteToken_key" ON "Member"("stravaInviteToken");
