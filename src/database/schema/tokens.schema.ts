import { pgTable, uuid, varchar, timestamp, index } from 'drizzle-orm/pg-core';
import { users } from './users.schema';

/**
 * Token types enum
 */
export const tokenTypes = {
  EMAIL_VERIFICATION: 'EMAIL_VERIFICATION',
  PASSWORD_RESET: 'PASSWORD_RESET',
  TWO_FACTOR: 'TWO_FACTOR',
} as const;

export type TokenType = typeof tokenTypes[keyof typeof tokenTypes];

/**
 * Tokens table for email verification, password reset, etc.
 */
export const tokens = pgTable(
  'tokens',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    token: varchar('token', { length: 255 }).notNull().unique(),
    type: varchar('type', { length: 50 }).notNull(), // EMAIL_VERIFICATION, PASSWORD_RESET, etc.
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    usedAt: timestamp('used_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index('tokens_user_id_idx').on(table.userId),
    tokenIdx: index('tokens_token_idx').on(table.token),
    typeIdx: index('tokens_type_idx').on(table.type),
    expiresAtIdx: index('tokens_expires_at_idx').on(table.expiresAt),
  })
);

export type Token = typeof tokens.$inferSelect;
export type NewToken = typeof tokens.$inferInsert;
