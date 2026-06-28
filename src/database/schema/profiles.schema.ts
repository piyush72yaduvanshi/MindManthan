import { pgTable, uuid, varchar, text, timestamp, jsonb, index } from 'drizzle-orm/pg-core';
import { users } from './users.schema';

export const profiles = pgTable(
  'profiles',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: 'cascade' }),
    fullName: varchar('full_name', { length: 255 }).notNull(),
    headline: varchar('headline', { length: 500 }),
    bio: text('bio'),
    phone: varchar('phone', { length: 20 }),
    location: varchar('location', { length: 255 }),
    avatarUrl: varchar('avatar_url', { length: 500 }),
    linkedinUrl: varchar('linkedin_url', { length: 500 }),
    githubUrl: varchar('github_url', { length: 500 }),
    portfolioUrl: varchar('portfolio_url', { length: 500 }),
    
    // JSON fields for flexible data
    skills: jsonb('skills').$type<
      Array<{
        name: string;
        level: string;
        yearsOfExperience?: number;
      }>
    >().default([]),
    
    education: jsonb('education').$type<
      Array<{
        degree: string;
        institution: string;
        fieldOfStudy?: string;
        startDate?: string;
        endDate?: string;
        current?: boolean;
        description?: string;
      }>
    >().default([]),
    
    experience: jsonb('experience').$type<
      Array<{
        title: string;
        company: string;
        location?: string;
        startDate?: string;
        endDate?: string;
        current?: boolean;
        description?: string;
      }>
    >().default([]),
    
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (table) => ({
    userIdIdx: index('profiles_user_id_idx').on(table.userId),
    fullNameIdx: index('profiles_full_name_idx').on(table.fullName),
    locationIdx: index('profiles_location_idx').on(table.location),
  })
);

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
