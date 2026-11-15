import { and, eq } from "drizzle-orm";
import { db } from "./client";
import { entries } from "./schema";

// Saves a count. Inserts the row if it doesn't exist yet, otherwise updates it.
export async function saveCount(
	offeringId: number,
	denomination: number,
	count: number,
) {
	await db
		.insert(entries)
		.values({ offeringId, denomination, count })
		.onConflictDoUpdate({
			target: [entries.offeringId, entries.denomination],
			set: { count },
		});
}

// Adds a denomination row at zero. Does nothing if it already exists.
export async function addDenomination(
	offeringId: number,
	denomination: number,
) {
	await db
		.insert(entries)
		.values({ offeringId, denomination, count: 0 })
		.onConflictDoNothing();
}

export async function removeDenomination(
	offeringId: number,
	denomination: number,
) {
	await db
		.delete(entries)
		.where(
			and(
				eq(entries.offeringId, offeringId),
				eq(entries.denomination, denomination),
			),
		);
}
