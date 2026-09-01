DO $$ BEGIN
 CREATE TYPE "verification_request_status" AS ENUM('FINISHED', 'PENDING', 'REJECTED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DROP TABLE "color_verification_requests";