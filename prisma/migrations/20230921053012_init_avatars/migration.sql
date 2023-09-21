-- CreateTable
CREATE TABLE "avatars" (
    "team_id" INTEGER NOT NULL,
    "png" BYTEA,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "avatars_pkey" PRIMARY KEY ("team_id")
);

-- CreateIndex
CREATE INDEX "avatars_png_idx" ON "avatars"("png");

-- AddForeignKey
ALTER TABLE "avatars" ADD CONSTRAINT "avatars_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
