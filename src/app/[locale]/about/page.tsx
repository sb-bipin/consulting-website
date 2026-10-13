import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { getSettings } from "@/lib/site";
import PageHeader from "@/components/public/PageHeader";
import { Link } from "@/i18n/navigation";

export default async function AboutPage() {
  const t = await getTranslations("about");
  const th = await getTranslations("home");
  const settings = await getSettings();

  const stats = [
    { value: Number(settings.stat_placements || 25000), label: th("statsPlacements") },
    { value: Number(settings.stat_countries || 12), label: th("statsCountries") },
    { value: Number(settings.stat_clients || 300), label: th("statsClients") },
    { value: Number(settings.stat_years || 15), label: th("statsYears") },
  ];

  const why = [
    { icon: "bi-patch-check-fill", title: t("why1Title"), desc: t("why1Desc") },
    { icon: "bi-hand-thumbs-up-fill", title: t("why2Title"), desc: t("why2Desc") },
    { icon: "bi-building-check", title: t("why3Title"), desc: t("why3Desc") },
    { icon: "bi-headset", title: t("why4Title"), desc: t("why4Desc") },
    { icon: "bi-people-fill", title: t("why5Title"), desc: t("why5Desc") },
    { icon: "bi-shield-check", title: t("why6Title"), desc: t("why6Desc") },
  ];

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} crumb={t("title")} />

      <section className="section">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <span className="section-eyebrow">{t("whoTitle")}</span>
              <h2 className="section-title">{t("whoTitle")}</h2>
              <p className="text-muted-sw">{t("whoText")}</p>
              <p className="text-muted-sw">
                <i className="bi bi-patch-check-fill text-accent me-2" />
                {settings.license_no}
              </p>
            </div>
            <div className="col-lg-6">
              <div className="about-photo">
                <Image
                  src={settings.about_image_url || "/swostik-img.jpg"}
                  alt={t("title")}
                  width={383}
                  height={854}
                  priority
                  sizes="(max-width: 992px) 70vw, 360px"
                  className="img-fluid"
                />
              </div>
            </div>
          </div>
          <div className="row g-3 mt-5">
            {stats.map((s) => (
              <div className="col-6 col-lg-3" key={s.label}>
                <div className="stat-card">
                  <div className="stat-value">{s.value.toLocaleString()}+</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-soft">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="sw-card p-4 p-lg-5 h-100">
                <div className="svc-icon">
                  <i className="bi bi-bullseye" />
                </div>
                <h4>{t("missionTitle")}</h4>
                <p className="text-muted-sw mb-0">{t("missionText")}</p>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="sw-card p-4 p-lg-5 h-100">
                <div className="svc-icon">
                  <i className="bi bi-eye-fill" />
                </div>
                <h4>{t("visionTitle")}</h4>
                <p className="text-muted-sw mb-0">{t("visionText")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-eyebrow">{t("whyTitle")}</span>
            <h2 className="section-title">{t("whyTitle")}</h2>
          </div>
          <div className="row g-4">
            {why.map((w) => (
              <div className="col-md-6 col-lg-4" key={w.title}>
                <div className="sw-card p-4 h-100">
                  <i className={`bi ${w.icon} fs-2 text-accent-dark`} />
                  <h5 className="mt-3">{w.title}</h5>
                  <p className="text-muted-sw mb-0">{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-5">
            <Link href="/contact" className="btn btn-accent btn-lg">
              {th("ctaButton")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
