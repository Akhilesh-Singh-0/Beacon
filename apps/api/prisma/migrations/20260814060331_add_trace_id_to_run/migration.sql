/*
  Warnings:

  - A unique constraint covering the columns `[workspaceId,traceId]` on the table `Run` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `traceId` to the `Run` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Run" ADD COLUMN     "traceId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Run_workspaceId_traceId_key" ON "Run"("workspaceId", "traceId");
