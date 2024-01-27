CREATE TABLE IF NOT EXISTS "color_form_submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"teamId" integer NOT NULL,
	"primary_color_hex" text NOT NULL,
	"secondary_color_hex" text NOT NULL,
	"status" "verification_request_status" NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) with time zone
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "color_form_submissions_team_id_key" ON "color_form_submissions" ("teamId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "color_form_submissions_created_at_index" ON "color_form_submissions" ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "color_form_submissions_status_index" ON "color_form_submissions" ("status");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "color_form_submissions" ADD CONSTRAINT "color_form_submissions_teamId_teams_id_fk" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
