/*
  Warnings:

  - You are about to drop the column `distanceKm` on the `Ride` table. All the data in the column will be lost.
  - You are about to drop the column `endedAt` on the `Ride` table. All the data in the column will be lost.
  - You are about to drop the column `polyline` on the `Ride` table. All the data in the column will be lost.
  - You are about to drop the column `startedAt` on the `Ride` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stravaActivityId]` on the table `Ride` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `distanceMeters` to the `Ride` table without a default value. This is not possible if the table is not empty.
  - Added the required column `elapsedTimeSec` to the `Ride` table without a default value. This is not possible if the table is not empty.
  - Added the required column `elevationGain` to the `Ride` table without a default value. This is not possible if the table is not empty.
  - Added the required column `movingTimeSec` to the `Ride` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Ride` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Ride` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stravaActivityId` to the `Ride` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Ride` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Ride` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ride" DROP COLUMN "distanceKm",
DROP COLUMN "endedAt",
DROP COLUMN "polyline",
DROP COLUMN "startedAt",
ADD COLUMN     "avgSpeed" DOUBLE PRECISION,
ADD COLUMN     "calories" DOUBLE PRECISION,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "distanceMeters" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "elapsedTimeSec" INTEGER NOT NULL,
ADD COLUMN     "elevationGain" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "maxSpeed" DOUBLE PRECISION,
ADD COLUMN     "movingTimeSec" INTEGER NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "stravaActivityId" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Ride_stravaActivityId_key" ON "Ride"("stravaActivityId");
