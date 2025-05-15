-- CreateTable
CREATE TABLE "SubPlan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "mastery" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "selectedDays" TEXT[],
    "selectedStrategies" TEXT[],
    "customStrategies" JSONB,
    "hoursPerDay" INTEGER NOT NULL DEFAULT 2,
    "userId" TEXT NOT NULL,

    CONSTRAINT "SubPlan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SubPlan_userId_idx" ON "SubPlan"("userId");

-- AddForeignKey
ALTER TABLE "SubPlan" ADD CONSTRAINT "SubPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
