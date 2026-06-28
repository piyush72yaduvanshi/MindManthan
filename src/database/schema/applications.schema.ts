import { pgTable, uuid, text, timestamp, unique, index } from 'drizzle-orm/pg-core';
import { users } from './users.schema';
import { jobs } from './jobs.schema';
import { resumes } from './resumes.schema';
import { applicationStatusEnum } from './enums';

export const applications = pgTable(
  'applications',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    jobId: uuid('job_id')
      .notNull()
      .references(() => jobs.id, { onDelete: 'cascade' }),
    resumeId: uuid('resume_id')
      .notNull()
      .references(() => resumes.id, { onDelete: 'restrict' }),
    status: applicationStatusEnum('status').notNull().default('APPLIED'),
    coverLetter: text('cover_letter'),
    appliedAt: timestamp('applied_at', { withTimezone: true }).notNull().defaultNow(),
    reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (table) => ({
    // Unique constraint: prevent duplicate applications
    userJobUnique: unique('applications_user_job_unique').on(table.userId, table.jobId),
    userIdIdx: index('applications_user_id_idx').on(table.userId),
    jobIdIdx: index('applications_job_id_idx').on(table.jobId),
    resumeIdIdx: index('applications_resume_id_idx').on(table.resumeId),
    statusIdx: index('applications_status_idx').on(table.status),
    appliedAtIdx: index('applications_applied_at_idx').on(table.appliedAt),
    userStatusIdx: index('applications_user_status_idx').on(table.userId, table.status),
    jobStatusIdx: index('applications_job_status_idx').on(table.jobId, table.status),
  })
);

export type Application = typeof applications.$inferSelect;
export type NewApplication = typeof applications.$inferInsert;
