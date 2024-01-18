import { InferSelectModel } from 'drizzle-orm';
import {
  boolean,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';
import { User } from 'telegraf/typings/telegram-types';

/**
 * Type could be exported with helpers:
 * https://orm.drizzle.team/docs/goodies
 */

export const totp = pgTable(
  'totp',
  {
    id: serial('id').primaryKey(),
    code: varchar('code', { length: 32 }),
    createdAt: timestamp('created_at', { withTimezone: true }),
    wasUsed: boolean('was_used'),
    telegramId: numeric('telegram_id'),
    telegramUser: jsonb('telegram_user').$type<User>(),
  },
  (totp) => {
    return {
      telegramIdIndex: uniqueIndex('telegram_id_idx').on(totp.telegramId),
      codeIndex: uniqueIndex('code_used_idx').on(totp.code, totp.wasUsed),
    };
  }
);

const accountRoleIds = ['admin', 'assistant', 'teacher'] as const;
export const eventTopicEnum = pgEnum('account_role', accountRoleIds);

export type AccountRoleId = (typeof accountRoleIds)[number];
export interface AccountRole {
  id: AccountRoleId;
  name: string;
}
export const AccountRoles: AccountRole[] = [
  { id: 'admin', name: 'Администратор' },
  { id: 'assistant', name: 'Ассистент' },
  { id: 'teacher', name: 'Преподаватель' },
];

export const account = pgTable(
  'account',
  {
    id: serial('id').primaryKey(),
    telegramId: numeric('telegram_id'),
    firstName: varchar('first_name', { length: 128 }),
    lastName: varchar('last_name', { length: 128 }),
    roles: varchar('roles').array().$type<AccountRoleId[]>(),
    createdAt: timestamp('created_at', { withTimezone: true }),
  },
  (account) => {
    return {
      telegramIdIndex: uniqueIndex('telegramId').on(account.telegramId),
    };
  }
);

export type Account = InferSelectModel<typeof account>;
