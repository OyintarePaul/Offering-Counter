import { useMemo } from "react";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { asc, desc } from "drizzle-orm";
import { db } from "./client";
import { services, offerings, entries } from "./schema";

// Drizzle's live queries only refresh when their own table changes, so nested
// relational queries miss changes to child rows. We subscribe to each table
// separately and combine the results here.
export function useServiceTree() {
	const svc = useLiveQuery(
		db
			.select()
			.from(services)
			.orderBy(desc(services.serviceDate), desc(services.createdAt)),
	);
	const cats = useLiveQuery(
		db.select().from(offerings).orderBy(asc(offerings.position)),
	);
	const ents = useLiveQuery(db.select().from(entries));

	const ready =
		svc.updatedAt !== undefined &&
		cats.updatedAt !== undefined &&
		ents.updatedAt !== undefined;

	const composed = useMemo(
		() =>
			svc.data.map((s) => ({
				...s,
				offerings: cats.data
					.filter((c) => c.serviceId === s.id)
					.map((c) => ({
						...c,
						entries: ents.data.filter((e) => e.offeringId === c.id),
					})),
			})),
		[svc.data, cats.data, ents.data],
	);

	return { services: composed, ready };
}
