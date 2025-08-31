import { relations } from 'drizzle-orm';
import {
  decimal,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
  varchar,
} from 'drizzle-orm/pg-core';

function createdAtField() {
  return timestamp('created_at')
    .notNull()
    .defaultNow();
}

function expiresAtField() {
  return timestamp('expires_at');
}




// Storage location tracking
export const shelves = pgTable('shelves', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull(), // e.g., "Shelf 1", "Shelf A"
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const bins = pgTable('bins', {
  id: serial('id').primaryKey(),
  shelfId: integer('shelf_id').references(() => shelves.id),
  name: varchar('name', { length: 50 }).notNull(), // e.g., "Bin A", "Bin 1"
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Core inventory management
export const items = pgTable('items', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  cost: decimal('cost', { precision: 10, scale: 2 }).notNull(),
  listingPrice: decimal('listing_price', { precision: 10, scale: 2 }).notNull(),
  category: varchar('category', { length: 100 }),
  condition: varchar('condition', { length: 50 }), // New, Used, Refurbished, etc.
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Individual inventory instances with location tracking
export const inventoryInstances = pgTable('inventory_instances', {
  id: serial('id').primaryKey(),
  itemId: integer('item_id').references(() => items.id),
  shelfId: integer('shelf_id').references(() => shelves.id),
  binId: integer('bin_id').references(() => bins.id),
  status: varchar('status', { length: 20 }).default('available'), // available, sold, reserved
  soldPrice: decimal('sold_price', { precision: 10, scale: 2 }), // actual sale price
  soldDate: timestamp('sold_date'),
  platform: varchar('platform', { length: 50 }), // ebay, mercari, etsy, etc.
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations for inventory tables
export const shelvesRelations = relations(shelves, ({ many }) => ({
  bins: many(bins),
  inventoryInstances: many(inventoryInstances),
}));

export const binsRelations = relations(bins, ({ one, many }) => ({
  shelf: one(shelves, {
    fields: [bins.shelfId],
    references: [shelves.id],
  }),
  inventoryInstances: many(inventoryInstances),
}));

export const itemsRelations = relations(items, ({ many }) => ({
  inventoryInstances: many(inventoryInstances),
}));

export const inventoryInstancesRelations = relations(inventoryInstances, ({ one }) => ({
  item: one(items, {
    fields: [inventoryInstances.itemId],
    references: [items.id],
  }),
  shelf: one(shelves, {
    fields: [inventoryInstances.shelfId],
    references: [shelves.id],
  }),
  bin: one(bins, {
    fields: [inventoryInstances.binId],
    references: [bins.id],
  }),
}));
