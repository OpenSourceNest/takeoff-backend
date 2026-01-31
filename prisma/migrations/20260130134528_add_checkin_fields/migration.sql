-- AlterTable
ALTER TABLE "event_registrations" ADD COLUMN     "checkInTime" TIMESTAMP(3),
ADD COLUMN     "checkedIn" BOOLEAN NOT NULL DEFAULT false;
