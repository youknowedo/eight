CREATE TABLE IF NOT EXISTS "friend_requests" (
	"id" text PRIMARY KEY NOT NULL,
	"from" text NOT NULL,
	"to" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "friend_requests" ADD CONSTRAINT "friend_requests_from_user_id_fk" FOREIGN KEY ("from") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "friend_requests" ADD CONSTRAINT "friend_requests_to_user_id_fk" FOREIGN KEY ("to") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
