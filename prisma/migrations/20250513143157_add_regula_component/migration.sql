-- CreateEnum
CREATE TYPE "type" AS ENUM ('EXAMPLE', 'CHALLENGE', 'CODING');

-- CreateEnum
CREATE TYPE "SelectedEnum" AS ENUM ('HISTORYGRAPH', 'STATS', 'LEADERBOARD', 'EXERCISEHISTORY', 'TODO', 'REGULA');

-- CreateTable
CREATE TABLE "Example" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Example_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "refresh_token_expires_in" INTEGER,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3),
    "protusId" TEXT,
    "updatedAt" TIMESTAMP(3),
    "onBoarded" BOOLEAN NOT NULL DEFAULT false,
    "USNEmail" TEXT,
    "leaderboard" BOOLEAN,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPreference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "selectedComponents" "SelectedEnum"[] DEFAULT ARRAY[]::"SelectedEnum"[],
    "leaderboard" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExerciseHistory" (
    "historyId" TEXT NOT NULL,
    "visitedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "attempts" INTEGER,
    "userId" TEXT NOT NULL,
    "activityResourceId" TEXT NOT NULL,

    CONSTRAINT "ExerciseHistory_pkey" PRIMARY KEY ("historyId")
);

-- CreateTable
CREATE TABLE "ToDo" (
    "todoId" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "completed" BOOLEAN NOT NULL,
    "name" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ToDo_pkey" PRIMARY KEY ("todoId")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Course" (
    "courseName" TEXT NOT NULL,
    "id" TEXT NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityResource" (
    "type" "type" NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "id" TEXT NOT NULL,

    CONSTRAINT "ActivityResource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Module" (
    "moduleName" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_protusId_key" ON "User"("protusId");

-- CreateIndex
CREATE UNIQUE INDEX "ExerciseHistory_userId_activityResourceId_key" ON "ExerciseHistory"("userId", "activityResourceId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPreference" ADD CONSTRAINT "UserPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseHistory" ADD CONSTRAINT "ExerciseHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseHistory" ADD CONSTRAINT "ExerciseHistory_activityResourceId_fkey" FOREIGN KEY ("activityResourceId") REFERENCES "ActivityResource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToDo" ADD CONSTRAINT "ToDo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityResource" ADD CONSTRAINT "ActivityResource_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Module" ADD CONSTRAINT "Module_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
