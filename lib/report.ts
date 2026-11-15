import { formatServiceDate } from "./dates";
import { rowTotal } from "./money";

export type EntryRow = { denomination: number; count: number };

export type CategoryWithEntries = {
	name: string;
	position: number;
	entries: EntryRow[];
};

export type ServiceWithCategories = {
	serviceDate: string;
	label: string;
	offerings: CategoryWithEntries[];
};

export type ReportModel = {
	dateLabel: string;
	serviceLabel: string;
	offerings: {
		name: string;
		total: number;
		rows: { denomination: number; count: number; amount: number }[];
	}[];
	grandTotal: number;
};

// Drops zero-count rows and empty offerings, sorts largest denomination first,
// and computes every total. The report screen renders this as-is.
export function buildReport(service: ServiceWithCategories): ReportModel {
	const offerings = [...service.offerings]
		.sort((a, b) => a.position - b.position)
		.map((cat) => {
			const rows = cat.entries
				.filter((e) => e.count > 0)
				.sort((a, b) => b.denomination - a.denomination)
				.map((e) => ({
					denomination: e.denomination,
					count: e.count,
					amount: rowTotal(e.denomination, e.count),
				}));
			return {
				name: cat.name,
				total: rows.reduce((sum, r) => sum + r.amount, 0),
				rows,
			};
		})
		.filter((c) => c.rows.length > 0);

	return {
		dateLabel: formatServiceDate(service.serviceDate),
		serviceLabel: service.label,
		offerings,
		grandTotal: offerings.reduce((sum, c) => sum + c.total, 0),
	};
}
