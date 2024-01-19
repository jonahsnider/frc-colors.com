CREATE TABLE IF NOT EXISTS "color_verification_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"teamId" integer NOT NULL,
	"status" "verification_request_status" NOT NULL,
	"created_at" timestamp (3) DEFAULT now() NOT NULL,
	"updated_at" timestamp (3)
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "color_verification_requests_team_id_key" ON "color_verification_requests" ("teamId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "color_verification_requests_created_at_index" ON "color_verification_requests" ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "color_verification_requests_status_index" ON "color_verification_requests" ("status");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "color_verification_requests" ADD CONSTRAINT "color_verification_requests_teamId_teams_id_fk" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
