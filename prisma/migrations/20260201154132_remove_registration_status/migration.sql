/*
  Warnings:

  - You are about to drop the column `status` on the `event_registrations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "event_registrations" DROP COLUMN "status";

-- DropEnum
DROP TYPE "RegistrationStatus";
