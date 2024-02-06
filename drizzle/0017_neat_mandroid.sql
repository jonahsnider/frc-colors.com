ALTER TABLE "color_form_submissions" RENAME TO "color_submissions";--> statement-breakpoint
ALTER TABLE "color_verification_requests" RENAME TO "verification_requests";--> statement-breakpoint
ALTER TABLE "color_submissions" DROP CONSTRAINT "color_form_submissions_team_number_teams_team_number_fk";
--> statement-breakpoint
ALTER TABLE "verification_requests" DROP CONSTRAINT "color_verification_requests_team_number_teams_team_number_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "color_form_submissions_team_number_index";--> statement-breakpoint
DROP INDEX IF EXISTS "color_form_submissions_created_at_index";--> statement-breakpoint
DROP INDEX IF EXISTS "color_form_submissions_status_index";--> statement-breakpoint
DROP INDEX IF EXISTS "color_form_submissions_updated_at_index";--> statement-breakpoint
DROP INDEX IF EXISTS "color_verification_requests_team_number_index";--> statement-breakpoint
DROP INDEX IF EXISTS "color_verification_requests_created_at_index";--> statement-breakpoint
DROP INDEX IF EXISTS "color_verification_requests_status_index";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "color_submissions_team_number_index" ON "color_submissions" ("team_number");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "color_submissions_created_at_index" ON "color_submissions" ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "color_submissions_status_index" ON "color_submissions" ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "color_submissions_updated_at_index" ON "color_submissions" ("updated_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "verification_requests_team_number_index" ON "verification_requests" ("team_number");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "verification_requests_created_at_index" ON "verification_requests" ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "verification_requests_status_index" ON "verification_requests" ("status");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "color_submissions" ADD CONSTRAINT "color_submissions_team_number_teams_team_number_fk" FOREIGN KEY ("team_number") REFERENCES "teams"("team_number") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "verification_requests" ADD CONSTRAINT "verification_requests_team_number_teams_team_number_fk" FOREIGN KEY ("team_number") REFERENCES "teams"("team_number") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
