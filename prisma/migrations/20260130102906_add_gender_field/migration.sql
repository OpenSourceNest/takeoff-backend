/*
  Warnings:

  - Added the required column `gender` to the `event_registrations` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- AlterTable
ALTER TABLE "event_registrations" ADD COLUMN     "gender" "Gender" NOT NULL,
ADD COLUMN     "referralSourceOther" TEXT;
