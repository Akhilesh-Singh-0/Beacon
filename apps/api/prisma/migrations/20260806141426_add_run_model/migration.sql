-- CreateEnum
CREATE TYPE "RunStatus" AS ENUM ('RUNNING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "Run" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "status" "RunStatus" NOT NULL DEFAULT 'RUNNING',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "Run_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Run" ADD CONSTRAINT "Run_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
