DROP INDEX IF EXISTS "telegramId";--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "account_telegram_id" ON "account" ("telegram_id");