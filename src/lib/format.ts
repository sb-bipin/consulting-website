export function formatSalary(
  min: number | null | undefined,
  max: number | null | undefined,
  currency = "NPR",
  negotiableLabel = "Negotiable"
): string {
  const fmt = (n: number) => new Intl.NumberFormat("en-US").format(n);
  if ((min === null || min === undefined) && (max === null || max === undefined)) {
    return negotiableLabel;
  }
  if (min && max && min !== max) {
    return `${currency} ${fmt(min)} – ${fmt(max)}`;
  }
  const value = min ?? max ?? 0;
  return `${currency} ${fmt(value)}`;
}

export function formatDate(
  date: Date | string | null | undefined,
  locale = "en"
): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale === "ne" ? "ne-NP" : "en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

export function timeAgo(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const diff = Date.now() - d.getTime();
  const days = Math.floor(diff / 86400000);
  if (days <= 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? "1 month ago" : `${months} months ago`;
}

export function daysLeft(date: Date | string | null | undefined): number | null {
  if (!date) return null;
  const d = typeof date === "string" ? new Date(date) : date;
  return Math.ceil((d.getTime() - Date.now()) / 86400000);
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}
