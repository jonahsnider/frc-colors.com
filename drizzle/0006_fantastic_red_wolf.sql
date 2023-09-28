DROP INDEX IF EXISTS "color_verification_requests_team_id_key";--> statement-breakpoint
DROP INDEX IF EXISTS "color_verification_requests_created_at_index";--> statement-breakpoint
DROP INDEX IF EXISTS "color_verification_requests_status_index";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "color_verification_requests_team_id_key" ON "color_verification_requests" ("teamId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "color_verification_requests_created_at_index" ON "color_verification_requests" ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "color_verification_requests_status_index" ON "color_verification_requests" ("status");