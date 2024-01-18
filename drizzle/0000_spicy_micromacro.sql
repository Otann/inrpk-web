DO $$ BEGIN
 CREATE TYPE "account_role" AS ENUM('admin', 'assistant', 'teacher');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "account" (
	"id" serial PRIMARY KEY NOT NULL,
	"telegram_id" numeric,
	"first_name" varchar(128),
	"last_name" varchar(128),
	"roles" varchar[],
	"created_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "totp" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(32),
	"created_at" timestamp with time zone,
	"was_used" boolean,
	"telegram_id" numeric,
	"telegram_user" jsonb
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "telegramId" ON "account" ("telegram_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "telegram_id_idx" ON "totp" ("telegram_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "code_used_idx" ON "totp" ("code","was_used");