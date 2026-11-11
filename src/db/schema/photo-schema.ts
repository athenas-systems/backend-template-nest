import { integer, pgTable, text } from 'drizzle-orm/pg-core';
import { users } from './user-schema.js';

export const photos = pgTable('photos', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  url: text().notNull(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
});

export type Photo = typeof photos.$inferSelect;
export type NewPhoto = typeof photos.$inferInsert;
