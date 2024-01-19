ALTER TABLE "color_suggestions" RENAME TO "color_verification_requests";--> statement-breakpoint
ALTER TABLE "color_verification_requests" DROP CONSTRAINT "color_suggestions_teamId_teams_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "color_verification_requests" ADD CONSTRAINT "color_verification_requests_teamId_teams_id_fk" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "color_verification_requests" DROP COLUMN IF EXISTS "primary_color_hex";--> statement-breakpoint
ALTER TABLE "color_verification_requests" DROP COLUMN IF EXISTS "secondary_color_hex";