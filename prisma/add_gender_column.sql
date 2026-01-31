-- Add Gender enum type
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- Add gender column to event_registrations table
ALTER TABLE "event_registrations" 
ADD COLUMN "gender" "Gender" NOT NULL DEFAULT 'MALE';

-- Remove the default after adding the column (optional, if you want to make it strictly required without default)
ALTER TABLE "event_registrations" 
ALTER COLUMN "gender" DROP DEFAULT;
