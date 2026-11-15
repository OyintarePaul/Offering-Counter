import { eq } from "drizzle-orm";
import { db } from "./client";
import { offerings } from "./schema";

export async function addOffering(
	serviceId: number,
	name: string,
	position: number,
) {
	await db.insert(offerings).values({ serviceId, name, position });
}

// Deleting a offering also deletes its entries (cascade).
export async function deleteOffering(id: number) {
	await db.delete(offerings).where(eq(offerings.id, id));
}
