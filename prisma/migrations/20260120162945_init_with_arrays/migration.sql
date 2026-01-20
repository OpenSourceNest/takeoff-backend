-- CreateEnum
CREATE TYPE "Profession" AS ENUM ('STUDENT', 'PROFESSIONAL_DEVELOPER', 'HOBBYIST', 'FRONTEND_DEVELOPER', 'BACKEND_DEVELOPER', 'FULLSTACK_DEVELOPER', 'UI_UX_DESIGNER', 'DEVOPS_ENGINEER', 'QA_ENGINEER', 'SECURITY_ENGINEER', 'DATA_SCIENTIST', 'AI_ML_ENGINEER', 'PRODUCT_MANAGER', 'PROJECT_MANAGER', 'TECHNICAL_WRITER', 'CONTENT_CREATOR', 'COMMUNITY_MANAGER', 'EDUCATOR', 'FOUNDER', 'IT_SUPPORT', 'BUSINESS_ANALYST', 'SMART_CONTRACT_DEVELOPER', 'BLOCKCHAIN_DEVELOPER', 'WEB3_DEVELOPER', 'SOLIDITY_DEVELOPER', 'DAPP_DEVELOPER', 'TOKENOMICS_SPECIALIST', 'NFT_DEVELOPER', 'DEFI_DEVELOPER', 'WEB3_SECURITY_AUDITOR', 'BLOCKCHAIN_ARCHITECT', 'OTHER');

-- CreateEnum
CREATE TYPE "ReferralSource" AS ENUM ('SOCIAL_MEDIA', 'FRIEND_COLLEAGUE', 'ONLINE_SEARCH', 'OTHER');

-- CreateEnum
CREATE TYPE "PipelineInterest" AS ENUM ('YES', 'NO', 'NOT_SURE');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "event_registrations" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "isCommunityMember" BOOLEAN NOT NULL,
    "location" TEXT NOT NULL,
    "locationOther" TEXT,
    "openSourceKnowledge" SMALLINT NOT NULL,
    "profession" "Profession"[] DEFAULT ARRAY['OTHER']::"Profession"[],
    "professionOther" TEXT,
    "referralSource" "ReferralSource" NOT NULL DEFAULT 'OTHER',
    "newsletterSub" BOOLEAN NOT NULL DEFAULT false,
    "pipelineInterest" "PipelineInterest" NOT NULL DEFAULT 'NOT_SURE',
    "interests" TEXT,
    "communityDetails" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "event_registrations_email_key" ON "event_registrations"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
