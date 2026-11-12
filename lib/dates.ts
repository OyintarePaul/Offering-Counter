const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

// Returns today if it's Sunday, otherwise the next Sunday, as "YYYY-MM-DD".
export function upcomingSunday(from: Date = new Date()): string {
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const daysUntil = (7 - d.getDay()) % 7;
  d.setDate(d.getDate() + daysUntil);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// "2026-11-15" -> "Sunday, 15 November 2026"
export function formatServiceDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const weekday = WEEKDAYS[new Date(y, m - 1, d).getDay()];
  return `${weekday}, ${d} ${MONTHS[m - 1]} ${y}`;
}
