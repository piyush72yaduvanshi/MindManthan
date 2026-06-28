import { relations } from 'drizzle-orm';
import { users, profiles, companies, resumes, jobs, applications, tokens } from '../schema';

// User relations
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles, {
    fields: [users.id],
    references: [profiles.userId],
  }),
  resumes: many(resumes),
  postedJobs: many(jobs),
  applications: many(applications),
  tokens: many(tokens),
}));

// Profile relations
export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
}));

// Company relations
export const companiesRelations = relations(companies, ({ many }) => ({
  jobs: many(jobs),
}));

// Resume relations
export const resumesRelations = relations(resumes, ({ one, many }) => ({
  user: one(users, {
    fields: [resumes.userId],
    references: [users.id],
  }),
  applications: many(applications),
}));

// Job relations
export const jobsRelations = relations(jobs, ({ one, many }) => ({
  company: one(companies, {
    fields: [jobs.companyId],
    references: [companies.id],
  }),
  postedBy: one(users, {
    fields: [jobs.postedById],
    references: [users.id],
  }),
  applications: many(applications),
}));

// Application relations
export const applicationsRelations = relations(applications, ({ one }) => ({
  user: one(users, {
    fields: [applications.userId],
    references: [users.id],
  }),
  job: one(jobs, {
    fields: [applications.jobId],
    references: [jobs.id],
  }),
  resume: one(resumes, {
    fields: [applications.resumeId],
    references: [resumes.id],
  }),
}));

// Token relations
export const tokensRelations = relations(tokens, ({ one }) => ({
  user: one(users, {
    fields: [tokens.userId],
    references: [users.id],
  }),
}));
