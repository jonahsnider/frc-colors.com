-- AlterTable
ALTER TABLE "color_suggestions" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "team_colors" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "teams" ALTER COLUMN "updated_at" DROP NOT NULL;
