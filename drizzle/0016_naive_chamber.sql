ALTER TABLE "avatars" RENAME COLUMN "team_id" TO "team_number";--> statement-breakpoint
ALTER TABLE "color_form_submissions" RENAME COLUMN "uuid" TO "id";--> statement-breakpoint
ALTER TABLE "color_form_submissions" RENAME COLUMN "teamId" TO "team_number";--> statement-breakpoint
ALTER TABLE "color_form_submissions" RENAME COLUMN "primary_color_hex" TO "primary_hex";--> statement-breakpoint
ALTER TABLE "color_form_submissions" RENAME COLUMN "secondary_color_hex" TO "secondary_hex";--> statement-breakpoint
ALTER TABLE "team_colors" RENAME COLUMN "team_id" TO "team_number";--> statement-breakpoint
ALTER TABLE "team_colors" RENAME COLUMN "primary_color_hex" TO "primary_hex";--> statement-breakpoint
ALTER TABLE "team_colors" RENAME COLUMN "secondary_color_hex" TO "secondary_hex";--> statement-breakpoint
ALTER TABLE "teams" RENAME COLUMN "id" TO "team_number";--> statement-breakpoint
ALTER TABLE "color_verification_requests" RENAME COLUMN "uuid" TO "id";--> statement-breakpoint
ALTER TABLE "color_verification_requests" RENAME COLUMN "teamId" TO "team_number";--> statement-breakpoint
ALTER TABLE "avatars" DROP CONSTRAINT "avatars_team_id_teams_id_fk";
--> statement-breakpoint
ALTER TABLE "color_form_submissions" DROP CONSTRAINT "color_form_submissions_teamId_teams_id_fk";
--> statement-breakpoint
ALTER TABLE "team_colors" DROP CONSTRAINT "team_colors_team_id_teams_id_fk";
--> statement-breakpoint
ALTER TABLE "color_verification_requests" DROP CONSTRAINT "color_verification_requests_teamId_teams_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "color_form_submissions_team_id_key";--> statement-breakpoint
DROP INDEX IF EXISTS "team_colors_team_id_key";--> statement-breakpoint
DROP INDEX IF EXISTS "teams_id_key";--> statement-breakpoint
DROP INDEX IF EXISTS "color_verification_requests_team_id_key";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "color_form_submissions_team_number_index" ON "color_form_submissions" ("team_number");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "team_colors_team_number_index" ON "team_colors" ("team_number");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "teams_team_number_index" ON "teams" ("team_number");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "color_verification_requests_team_number_index" ON "color_verification_requests" ("team_number");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "avatars" ADD CONSTRAINT "avatars_team_number_teams_team_number_fk" FOREIGN KEY ("team_number") REFERENCES "teams"("team_number") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "color_form_submissions" ADD CONSTRAINT "color_form_submissions_team_number_teams_team_number_fk" FOREIGN KEY ("team_number") REFERENCES "teams"("team_number") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "team_colors" ADD CONSTRAINT "team_colors_team_number_teams_team_number_fk" FOREIGN KEY ("team_number") REFERENCES "teams"("team_number") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "color_verification_requests" ADD CONSTRAINT "color_verification_requests_team_number_teams_team_number_fk" FOREIGN KEY ("team_number") REFERENCES "teams"("team_number") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
