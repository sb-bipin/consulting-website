import { cache } from "react";
import { prisma } from "./prisma";

export const getSettings = cache(async (): Promise<Record<string, string>> => {
  const rows = await prisma.siteSetting.findMany();
  const map: Record<string, string> = {};
  for (const row of rows) map[row.key] = row.value;
  return map;
});

export function getSetting(
  settings: Record<string, string>,
  key: string,
  fallback = ""
): string {
  const value = settings[key];
  return value && value.length > 0 ? value : fallback;
}
