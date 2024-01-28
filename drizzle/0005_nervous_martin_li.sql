CREATE TABLE IF NOT EXISTS "zoom_credentials" (
	"id" serial PRIMARY KEY NOT NULL,
	"zoom_user_id" varchar(128),
	"zoom_user" jsonb,
	"zoom_credentials" jsonb
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "zoom_credentials_zoom_user_id" ON "zoom_credentials" ("zoom_user_id");