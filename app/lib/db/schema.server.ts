import { InferSelectModel, relations } from "drizzle-orm";
import {
  bigint,
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { User } from "telegraf/typings/telegram-types";
import { ZoomCredentials, ZoomUser } from "~/lib/api/zoom.server";

/**
 * Type could be exported with helpers:
 * https://orm.drizzle.team/docs/goodies
 */

export const totp = pgTable(
  "totp",
  {
    id: serial("id").primaryKey(),
    code: varchar("code", { length: 32 }),
    createdAt: timestamp("created_at", { withTimezone: true }),
    wasUsed: boolean("was_used"),
    telegramId: integer("telegram_id"),
    telegramUser: jsonb("telegram_user").$type<User>(),
  },
  (totp) => {
    return {
      telegramIdIndex: uniqueIndex("telegram_id_idx").on(totp.telegramId),
      codeIndex: uniqueIndex("code_used_idx").on(totp.code, totp.wasUsed),
    };
  }
);

const accountRoleIds = ["admin", "assistant", "teacher"] as const;
export const eventTopicEnum = pgEnum("account_role", accountRoleIds);

export type AccountRoleId = (typeof accountRoleIds)[number];
export interface AccountRole {
  id: AccountRoleId;
  name: string;
}
export const AccountRoles: AccountRole[] = [
  { id: "admin", name: "Администратор" },
  { id: "assistant", name: "Ассистент" },
  { id: "teacher", name: "Преподаватель" },
];

export const account = pgTable(
  "account",
  {
    id: serial("id").primaryKey(),
    telegramId: bigint("telegram_id", { mode: "number" }),
    firstName: varchar("first_name", { length: 128 }),
    lastName: varchar("last_name", { length: 128 }),
    roles: varchar("roles").array().$type<AccountRoleId[]>(),
    createdAt: timestamp("created_at", { withTimezone: true }),
  },
  (account) => {
    return {
      telegramIdIndex: uniqueIndex("account_telegram_id").on(
        account.telegramId
      ),
    };
  }
);

export type Account = InferSelectModel<typeof account>;

export const studyGroup = pgTable("study_group", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
  telegramChatId: bigint("telegram_chat_id", { mode: "number" }),
});

export type StudyGroup = InferSelectModel<typeof studyGroup>;
export type StudyGroupWithTg = StudyGroup & {
  telegramGroup: TelegramGroup;
};

export const telegramGroup = pgTable(
  "telegram_group",
  {
    id: serial("id").primaryKey(),
    telegramId: bigint("telegram_id", { mode: "number" }),
    title: varchar("title", { length: 256 }),
    photoId: varchar("photoId", { length: 128 }),
    createdAt: timestamp("created_at", { withTimezone: true }),
  },
  (table) => {
    return {
      telegramIdIndex: uniqueIndex("study_group_telegram_id").on(
        table.telegramId
      ),
    };
  }
);

export type TelegramGroup = InferSelectModel<typeof telegramGroup>;

export const studyGroupRelations = relations(studyGroup, ({ one }) => ({
  telegramGroup: one(telegramGroup, {
    fields: [studyGroup.telegramChatId],
    references: [telegramGroup.telegramId],
  }),
}));

export const zoomCredentials = pgTable(
  "zoom_credentials",
  {
    id: serial("id").primaryKey(),
    zoomUserId: varchar("zoom_user_id", { length: 128 }),
    zoomUser: jsonb("zoom_user").$type<ZoomUser>(),
    credentials: jsonb("zoom_credentials").$type<ZoomCredentials>(),
  },
  (table) => {
    return {
      zoomUserIdIndex: uniqueIndex("zoom_credentials_zoom_user_id").on(
        table.zoomUserId
      ),
    };
  }
);

export type ZoomCredentialsType = InferSelectModel<typeof zoomCredentials>;
