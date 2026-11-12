import {
	sqliteTable,
	integer,
	text,
	primaryKey,
	unique,
} from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const services = sqliteTable(
	"services",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		serviceDate: text("service_date").notNull(), // "2026-11-15"
		label: text("label").notNull(), // "Main Service"
		createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
	},
	(t) => [unique().on(t.serviceDate, t.label)],
);

export const categories = sqliteTable(
	"categories",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		serviceId: integer("service_id")
			.notNull()
			.references(() => services.id, { onDelete: "cascade" }),
		name: text("name").notNull(),
		position: integer("position").notNull(),
	},
	(t) => [unique().on(t.serviceId, t.name)],
);

export const entries = sqliteTable(
	"entries",
	{
		categoryId: integer("category_id")
			.notNull()
			.references(() => categories.id, { onDelete: "cascade" }),
		denomination: integer("denomination").notNull(),
		count: integer("count").notNull().default(0),
	},
	(t) => [primaryKey({ columns: [t.categoryId, t.denomination] })],
);

export const servicesRelations = relations(services, ({ many }) => ({
	categories: many(categories),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
	service: one(services, {
		fields: [categories.serviceId],
		references: [services.id],
	}),
	entries: many(entries),
}));

export const entriesRelations = relations(entries, ({ one }) => ({
	category: one(categories, {
		fields: [entries.categoryId],
		references: [categories.id],
	}),
}));
