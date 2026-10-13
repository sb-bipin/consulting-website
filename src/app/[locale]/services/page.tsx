import { getLocale, getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/public/PageHeader";
import { Link } from "@/i18n/navigation";

export default async function ServicesPage() {
  const locale = await getLocale();
  const t = await getTranslations("services");
  const tp = await getTranslations("process");
  const tc = await getTranslations("common");

  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });

  const pick = (en: string, ne: string) => (locale === "ne" ? ne : en);
  const steps = [1, 2, 3, 4, 5, 6];

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} crumb={t("title")} />

      <section className="section">
        <div className="container">
          <div className="row g-4">
            {services.map((s) => (
              <div className="col-md-6 col-lg-4" key={s.id}>
                <div className="service-card">
                  <div className="svc-icon">
                    <i className={`bi ${s.icon || "bi-check2-circle"}`} />
                  </div>
                  <h5>{pick(s.titleEn, s.titleNe)}</h5>
                  <p className="text-muted-sw mb-0">
                    {pick(s.descriptionEn, s.descriptionNe)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-soft">
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-eyebrow">{t("processTitle")}</span>
            <h2 className="section-title">{t("processTitle")}</h2>
          </div>
          <div className="row g-4">
            {steps.map((n) => (
              <div className="col-md-6 col-lg-4" key={n}>
                <div className="process-step">
                  <span className="step-num">{n}</span>
                  <h5>{tp(`step${n}Title`)}</h5>
                  <p className="text-muted-sw mb-0">{tp(`step${n}Desc`)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-5">
            <Link href="/jobs" className="btn btn-primary-sw btn-lg">
              {tc("viewAll")}
              <i className="bi bi-arrow-right ms-1" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
