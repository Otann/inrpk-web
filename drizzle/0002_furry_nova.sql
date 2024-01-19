CREATE TABLE IF NOT EXISTS "study_group" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"telegram_chat_id" numeric
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "telegram_group" (
	"id" serial PRIMARY KEY NOT NULL,
	"telegram_id" numeric,
	"title" varchar(256),
	"photoId" varchar(128),
	"created_at" timestamp with time zone
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "study_group_telegram_id" ON "telegram_group" ("telegram_id");