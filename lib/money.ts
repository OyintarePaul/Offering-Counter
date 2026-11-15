export function rowTotal(denomination: number, count: number): number {
	return denomination * count;
}

export function categoryTotal(
	entries: { denomination: number; count: number }[],
): number {
	return entries.reduce((sum, e) => sum + rowTotal(e.denomination, e.count), 0);
}

export function grandTotal(
	offerings: { entries: { denomination: number; count: number }[] }[],
): number {
	return offerings.reduce((sum, c) => sum + categoryTotal(c.entries), 0);
}

// Adds commas by regex instead of toLocaleString, which Hermes doesn't handle reliably.
export function formatNaira(amount: number): string {
	const whole = Math.trunc(amount);
	const sign = whole < 0 ? "-" : "";
	const digits = String(Math.abs(whole)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	return `${sign}₦${digits}`;
}
