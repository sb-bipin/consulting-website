import { getLocale, getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/public/PageHeader";
import { Link } from "@/i18n/navigation";

export default async function CountriesPage() {
  const locale = await getLocale();
  const t = await getTranslations("countries");
  const tc = await getTranslations("common");

  const countries = await prisma.country.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
    include: {
      _count: { select: { jobs: { where: { status: "ACTIVE" } } } },
    },
  });

  const pick = (en: string, ne: string) => (locale === "ne" ? ne : en);

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} crumb={t("title")} />

      <section className="section">
        <div className="container">
          <div className="row g-4">
            {countries.map((c) => (
              <div className="col-md-6 col-lg-4" key={c.id}>
                <div className="sw-card h-100 d-flex flex-column">
                  <div className="p-4">
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <span className="fs-1">{c.flag}</span>
                      <div>
                        <h4 className="h5 mb-0">{pick(c.nameEn, c.nameNe)}</h4>
                        <span className="badge-accent">
                          {c._count.jobs} {tc("positions")}
                        </span>
                      </div>
                    </div>
                    <p className="text-muted-sw line-clamp-3 small">
                      {pick(c.descriptionEn || "", c.descriptionNe || "")}
                    </p>
                  </div>
                  <div className="p-3 pt-0 mt-auto">
                    <Link
                      href={`/countries/${c.slug}`}
                      className="btn btn-primary-sw w-100"
                    >
                      {t("exploreJobs")}
                      <i className="bi bi-arrow-right ms-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
