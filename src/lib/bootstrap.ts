import { prisma } from "./prisma";
import { seedDatabase } from "./seed";

let inFlight: Promise<void> | null = null;

export function ensureSeeded(): Promise<void> {
  if (!inFlight) {
    inFlight = run().catch((error) => {
      inFlight = null;
      throw error;
    });
  }
  return inFlight;
}

async function run(): Promise<void> {
  try {
    const adminCount = await prisma.admin.count();
    if (adminCount > 0) return;

    console.log("[bootstrap] No admin user found — seeding database...");
    await seedDatabase();
    console.log("[bootstrap] Database seeded.");
  } catch (error) {
    console.error("[bootstrap] Skipped seeding due to error:", error);
  }
}
