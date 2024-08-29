DO $$ BEGIN
 CREATE TYPE "public"."status" AS ENUM('hanging', 'down', 'ghost');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "status" "status" DEFAULT 'hanging' NOT NULL;