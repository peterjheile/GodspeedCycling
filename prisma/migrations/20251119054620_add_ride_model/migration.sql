-- DropIndex
DROP INDEX "Member_stravaInviteToken_key";

-- AlterTable
ALTER TABLE "Member" ALTER COLUMN "stravaAthleteId" SET DATA TYPE TEXT;
