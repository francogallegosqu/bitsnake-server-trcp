/*
  Warnings:

  - Added the required column `clientSessionId` to the `Fee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roomId` to the `Fee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Fee" ADD COLUMN     "clientSessionId" TEXT NOT NULL,
ADD COLUMN     "roomId" TEXT NOT NULL;
