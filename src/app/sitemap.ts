import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600;

const BASE = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");

const locales = ["en", "ne"] as const;
const staticPaths = [
  "",
  "/jobs",
  "/countries",
  "/services",
  "/about",
  "/notices",
  "/contact",
  "/apply",
];

function buildUrl(locale: string, path: string): string {
  const prefix = locale === "en" ? "" : `/${locale}`;
  return `${BASE}${prefix}${path}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of staticPaths) {
      entries.push({
        url: buildUrl(locale, path),
        lastModified: now,
        changeFrequency: "weekly",
        priority: path === "" ? 1 : 0.7,
      });
    }
  }

  try {
    const [jobs, countries] = await Promise.all([
      prisma.job.findMany({
        where: { status: "ACTIVE" },
        select: { slug: true, updatedAt: true },
      }),
      prisma.country.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    for (const locale of locales) {
      for (const job of jobs) {
        entries.push({
          url: buildUrl(locale, `/jobs/${job.slug}`),
          lastModified: job.updatedAt,
          changeFrequency: "daily",
          priority: 0.8,
        });
      }
      for (const country of countries) {
        entries.push({
          url: buildUrl(locale, `/countries/${country.slug}`),
          lastModified: country.updatedAt,
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
    }
  } catch {
    // Database unavailable (e.g. during CI build) - ship static entries only.
  }

  return entries;
}
