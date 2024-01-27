DO $$ BEGIN
 CREATE TYPE "suggestion_status" AS ENUM('REJECTED', 'ACCEPTED', 'PENDING');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "avatars" (
	"team_id" integer PRIMARY KEY NOT NULL,
	"png" "bytea",
	"created_at" timestamp(3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "color_suggestions" (
	"id" text PRIMARY KEY NOT NULL,
	"teamId" integer NOT NULL,
	"primary_color_hex" text NOT NULL,
	"secondary_color_hex" text NOT NULL,
	"status" "suggestion_status" NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "team_colors" (
	"team_id" integer NOT NULL,
	"primary_color_hex" text NOT NULL,
	"secondary_color_hex" text NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "teams" (
	"id" integer PRIMARY KEY NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3)
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "team_colors_team_id_key" ON "team_colors" ("team_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "teams_id_key" ON "teams" ("id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "avatars" ADD CONSTRAINT "avatars_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "color_suggestions" ADD CONSTRAINT "color_suggestions_teamId_teams_id_fk" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "team_colors" ADD CONSTRAINT "team_colors_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
