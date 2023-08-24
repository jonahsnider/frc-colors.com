/*
  Warnings:

  - You are about to drop the `TeamColor` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `status` on the `color_suggestions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "suggestion_status" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "TeamColor" DROP CONSTRAINT "TeamColor_teamId_fkey";

-- AlterTable
ALTER TABLE "color_suggestions" DROP COLUMN "status",
ADD COLUMN     "status" "suggestion_status" NOT NULL;

-- DropTable
DROP TABLE "TeamColor";

-- DropEnum
DROP TYPE "SuggestionStatus";

-- CreateTable
CREATE TABLE "team_colors" (
    "team_id" INTEGER NOT NULL,
    "primary_color_hex" TEXT NOT NULL,
    "secondary_color_hex" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "team_colors_team_id_key" ON "team_colors"("team_id");

-- AddForeignKey
ALTER TABLE "team_colors" ADD CONSTRAINT "team_colors_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
