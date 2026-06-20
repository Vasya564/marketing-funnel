import {
  pgTable,
  uuid,
  text,
  timestamp,
  bigserial,
  index,
} from 'drizzle-orm/pg-core';

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull().unique(),
    firstTouchSource: text('first_touch_source').notNull(),
    firstTouchMedium: text('first_touch_medium'),
    firstTouchCampaign: text('first_touch_campaign'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index('users_first_touch_source_idx').on(table.firstTouchSource)],
);

export const visitors = pgTable('visitors', {
  id: uuid('id').primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const visits = pgTable(
  'visits',
  {
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
  },
  (table) => [
    index('visits_visitor_id_idx').on(table.visitorId),
    index('visits_user_started_idx').on(table.userId, table.startedAt),
    index('visits_source_idx').on(table.source),
  ],
);

export const events = pgTable(
  'events',
  {
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
  },
  (table) => [
    index('events_visit_id_idx').on(table.visitId),
    index('events_type_idx').on(table.type),
    index('events_user_type_idx').on(table.userId, table.type),
    index('events_created_at_idx').on(table.createdAt),
  ],
);

export type User = typeof users.$inferSelect;
export type Visit = typeof visits.$inferSelect;
export type EventRow = typeof events.$inferSelect;
