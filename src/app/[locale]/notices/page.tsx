import { getLocale, getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/public/PageHeader";
import { formatDate } from "@/lib/format";

export default async function NoticesPage() {
  const locale = await getLocale();
  const t = await getTranslations("notices");

  const notices = await prisma.notice.findMany({
    where: { isActive: true },
    orderBy: { publishedAt: "desc" },
  });

  const pick = (en: string, ne: string) => (locale === "ne" ? ne : en);

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} crumb={t("title")} />
      <section className="section">
        <div className="container">
          {notices.length === 0 ? (
            <div className="sw-card p-5 text-center">
              <i className="bi bi-megaphone fs-1 text-muted-sw" />
              <h4 className="mt-3">{t("empty")}</h4>
            </div>
          ) : (
            <div className="row g-4 justify-content-center">
              <div className="col-lg-9">
                {notices.map((n) => (
                  <div className="sw-card p-4 p-lg-5 mb-4" key={n.id}>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span className="badge-accent">
                        <i className="bi bi-megaphone-fill me-1" />
                        {t("published")}
                      </span>
                      <small className="text-muted-sw">
                        {formatDate(n.publishedAt, locale)}
                      </small>
                    </div>
                    <h4>{pick(n.titleEn, n.titleNe)}</h4>
                    <p className="pre-line text-muted-sw mb-0">
                      {pick(n.bodyEn, n.bodyNe)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
