import { and, eq } from "drizzle-orm";
import { db } from "./client";
import { entries } from "./schema";

// Saves a count. Inserts the row if it doesn't exist yet, otherwise updates it.
export async function saveCount(
	categoryId: number,
	denomination: number,
	count: number,
) {
	await db
		.insert(entries)
		.values({ categoryId, denomination, count })
		.onConflictDoUpdate({
			target: [entries.categoryId, entries.denomination],
			set: { count },
		});
}

// Adds a denomination row at zero. Does nothing if it already exists.
export async function addDenomination(
	categoryId: number,
	denomination: number,
) {
	await db
		.insert(entries)
		.values({ categoryId, denomination, count: 0 })
		.onConflictDoNothing();
}

export async function removeDenomination(
	categoryId: number,
	denomination: number,
) {
	await db
		.delete(entries)
		.where(
			and(
				eq(entries.categoryId, categoryId),
				eq(entries.denomination, denomination),
			),
		);
}
