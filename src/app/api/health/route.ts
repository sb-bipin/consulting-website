import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const hasUrl = Boolean(process.env.DATABASE_URL);
  try {
    const count = await prisma.siteSetting.count();
    return Response.json({ ok: true, hasUrl, siteSettingCount: count });
  } catch (e) {
    const error = e as Error & { code?: string };
    return Response.json(
      {
        ok: false,
        hasUrl,
        name: error.name,
        code: error.code,
        message: error.message,
      },
      { status: 500 }
    );
  }
}
