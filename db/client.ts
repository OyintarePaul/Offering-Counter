import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import * as schema from "./schema";

// enableChangeListener is required for useLiveQuery to update automatically.
const expo = openDatabaseSync("offerings.db", { enableChangeListener: true });
expo.execSync("PRAGMA foreign_keys = ON;");

export const db = drizzle(expo, { schema });
