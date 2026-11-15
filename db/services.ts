import { and, desc, eq } from "drizzle-orm";
import { db } from "./client";
import { offerings, services } from "./schema";

// Returns the id of the existing service with this date and label,
// or creates it. A new service copies offering names from the most recent
// service, with no counts.
export async function findOrCreateService(
	serviceDate: string,
	label: string,
): Promise<number> {
	const existing = await db.query.services.findFirst({
		where: and(
			eq(services.serviceDate, serviceDate),
			eq(services.label, label),
		),
	});
	if (existing) return existing.id;

	const [created] = await db
		.insert(services)
		.values({ serviceDate, label, createdAt: new Date() })
		.returning({ id: services.id });

	const previous = await db.query.services.findFirst({
		where: (s, { ne }) => ne(s.id, created.id),
		orderBy: [desc(services.serviceDate), desc(services.createdAt)],
		with: { offerings: true },
	});

	if (previous && previous.offerings.length > 0) {
		await db.insert(offerings).values(
			previous.offerings.map((c) => ({
				serviceId: created.id,
				name: c.name,
				position: c.position,
			})),
		);
	}

	return created.id;
}
