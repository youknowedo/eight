CREATE TABLE IF NOT EXISTS "friends" (
	"user_1" text NOT NULL,
	"user_2" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "friends" ADD CONSTRAINT "friends_user_1_user_id_fk" FOREIGN KEY ("user_1") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "friends" ADD CONSTRAINT "friends_user_2_user_id_fk" FOREIGN KEY ("user_2") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
