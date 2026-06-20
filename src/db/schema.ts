import {
  pgTable,
  uuid,
  text,
  timestamp,
  bigserial,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  firstTouchSource: text('first_touch_source').notNull(),
  firstTouchMedium: text('first_touch_medium'),
  firstTouchCampaign: text('first_touch_campaign'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const visitors = pgTable('visitors', {
  id: uuid('id').primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const visits = pgTable('visits', {
  id: uuid('id').primaryKey().defaultRandom(),
  visitorId: uuid('visitor_id')
    .notNull()
    .references(() => visitors.id),
  userId: uuid('user_id').references(() => users.id),
  source: text('source').notNull(),
  utmMedium: text('utm_medium'),
  utmCampaign: text('utm_campaign'),
  startedAt: timestamp('started_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const events = pgTable('events', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  visitId: uuid('visit_id')
    .notNull()
    .references(() => visits.id),
  visitorId: uuid('visitor_id')
    .notNull()
    .references(() => visitors.id),
  userId: uuid('user_id').references(() => users.id),
  type: text('type').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type User = typeof users.$inferSelect;
export type Visit = typeof visits.$inferSelect;
export type EventRow = typeof events.$inferSelect;
