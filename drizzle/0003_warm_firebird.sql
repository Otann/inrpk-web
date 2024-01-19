ALTER TABLE "study_group" ALTER COLUMN "telegram_chat_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "telegram_group" ALTER COLUMN "telegram_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "totp" ALTER COLUMN "telegram_id" SET DATA TYPE integer;