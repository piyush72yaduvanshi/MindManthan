import { pgTable, uuid, varchar, text, integer, boolean, timestamp, jsonb, index } from 'drizzle-orm/pg-core';
import { companies } from './companies.schema';
import { users } from './users.schema';
import { jobStatusEnum, employmentTypeEnum, experienceLevelEnum } from './enums';

export const jobs = pgTable(
  'jobs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    companyId: uuid('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),
    postedById: uuid('posted_by_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description').notNull(),
    location: varchar('location', { length: 255 }),
    employmentType: employmentTypeEnum('employment_type').notNull().default('FULL_TIME'),
    experienceLevel: experienceLevelEnum('experience_level'),
    salaryMin: integer('salary_min'),
    salaryMax: integer('salary_max'),
    salaryCurrency: varchar('salary_currency', { length: 3 }).default('USD'),
    isRemote: boolean('is_remote').notNull().default(false),
    
    // JSON field for required skills array
    requiredSkills: jsonb('required_skills').$type<string[]>().default([]),
    
    status: jobStatusEnum('status').notNull().default('DRAFT'),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (table) => ({
    companyIdx: index('jobs_company_id_idx').on(table.companyId),
    postedByIdx: index('jobs_posted_by_id_idx').on(table.postedById),
    statusIdx: index('jobs_status_idx').on(table.status),
    employmentTypeIdx: index('jobs_employment_type_idx').on(table.employmentType),
    experienceLevelIdx: index('jobs_experience_level_idx').on(table.experienceLevel),
    isRemoteIdx: index('jobs_is_remote_idx').on(table.isRemote),
    locationIdx: index('jobs_location_idx').on(table.location),
    createdAtIdx: index('jobs_created_at_idx').on(table.createdAt),
    activeJobsIdx: index('jobs_active_idx').on(table.status, table.deletedAt, table.expiresAt),
  })
);

export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;
