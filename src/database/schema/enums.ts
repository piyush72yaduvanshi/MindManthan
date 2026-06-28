import { pgEnum } from 'drizzle-orm/pg-core';

// Auth Provider Enum
export const authProviderEnum = pgEnum('auth_provider', [
  'EMAIL',
  'GOOGLE',
  'GITHUB',
  'APPLE',
  'LINKEDIN',
  'MICROSOFT',
]);

// User Role Enum
export const userRoleEnum = pgEnum('user_role', [
  'USER',
  'RECRUITER',
  'ADMIN',
  'SUPER_ADMIN',
]);

// Job Status Enum
export const jobStatusEnum = pgEnum('job_status', [
  'DRAFT',
  'ACTIVE',
  'PAUSED',
  'CLOSED',
  'EXPIRED',
]);

// Application Status Enum
export const applicationStatusEnum = pgEnum('application_status', [
  'APPLIED',
  'UNDER_REVIEW',
  'SHORTLISTED',
  'INTERVIEW',
  'OFFER',
  'REJECTED',
  'HIRED',
  'WITHDRAWN',
]);

// Employment Type Enum
export const employmentTypeEnum = pgEnum('employment_type', [
  'FULL_TIME',
  'PART_TIME',
  'CONTRACT',
  'INTERNSHIP',
  'FREELANCE',
  'TEMPORARY',
]);

// Experience Level Enum
export const experienceLevelEnum = pgEnum('experience_level', [
  'ENTRY',
  'JUNIOR',
  'MID',
  'SENIOR',
  'LEAD',
  'EXECUTIVE',
]);

// Type exports for TypeScript
export type AuthProvider = typeof authProviderEnum.enumValues[number];
export type UserRole = typeof userRoleEnum.enumValues[number];
export type JobStatus = typeof jobStatusEnum.enumValues[number];
export type ApplicationStatus = typeof applicationStatusEnum.enumValues[number];
export type EmploymentType = typeof employmentTypeEnum.enumValues[number];
export type ExperienceLevel = typeof experienceLevelEnum.enumValues[number];
