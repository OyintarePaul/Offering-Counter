import { eq } from "drizzle-orm";
import { db } from "./client";
import { categories } from "./schema";

export async function addCategory(
	serviceId: number,
	name: string,
	position: number,
) {
	await db.insert(categories).values({ serviceId, name, position });
}

// Deleting a category also deletes its entries (cascade).
export async function deleteCategory(id: number) {
	await db.delete(categories).where(eq(categories.id, id));
}
