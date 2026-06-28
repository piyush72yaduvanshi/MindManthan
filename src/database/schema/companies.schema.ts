import { pgTable, uuid, varchar, text, timestamp, index } from 'drizzle-orm/pg-core';

export const companies = pgTable(
  'companies',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    logo: varchar('logo', { length: 500 }),
    website: varchar('website', { length: 500 }),
    industry: varchar('industry', { length: 100 }),
    size: varchar('size', { length: 50 }), // e.g., "1-10", "11-50", "51-200"
    description: text('description'),
    location: varchar('location', { length: 255 }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (table) => ({
    nameIdx: index('companies_name_idx').on(table.name),
    industryIdx: index('companies_industry_idx').on(table.industry),
    locationIdx: index('companies_location_idx').on(table.location),
  })
);

export type Company = typeof companies.$inferSelect;
export type NewCompany = typeof companies.$inferInsert;
