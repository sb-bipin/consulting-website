import { getTranslations } from "next-intl/server";
import { getSettings } from "@/lib/site";
import PageHeader from "@/components/public/PageHeader";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";

export default async function AboutPage() {
  const t = await getTranslations("about");
  const th = await getTranslations("home");
  const [settings, teamMembers] = await Promise.all([
    getSettings(),
    prisma.teamMember.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    }),
  ]);

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
          <div className="row g-4 justify-content-center">
            <div className="col-lg-10 col-xl-8">
              <div className="text-center">
                <span className="section-eyebrow">{t("whoTitle")}</span>
                <h2 className="section-title">{t("whoTitle")}</h2>
                <p className="text-muted-sw mx-auto" style={{ maxWidth: 880 }}>
                  {t("whoText")}
                </p>
                {settings.license_no ? (
                  <p className="text-muted-sw mb-0">
                    <i className="bi bi-patch-check-fill text-accent me-2" />
                    {settings.license_no}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
          <div className="row g-3 mt-4 mt-lg-5">
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

      {teamMembers.length > 0 ? (
        <section className="section">
          <div className="container">
            <div className="text-center mb-5">
              <span className="section-eyebrow">Our Team</span>
              <h2 className="section-title">Meet Our Employees</h2>
              <p className="text-muted-sw mx-auto" style={{ maxWidth: 720 }}>
                Our experienced team is here to guide you through every step of your overseas career journey.
              </p>
            </div>
            <div className="row g-4 justify-content-center">
              {teamMembers.map((member) => (
                <div className="col-sm-6 col-lg-4 col-xl-3" key={member.id}>
                  <div className="sw-card h-100 overflow-hidden text-center">
                    <div className="ratio ratio-1x1 bg-light">
                      {member.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={member.imageUrl} alt={member.name} style={{ objectFit: "cover" }} />
                      ) : (
                        <div className="d-flex align-items-center justify-content-center h-100 text-muted-sw">
                          <i className="bi bi-person-fill" style={{ fontSize: "4rem" }} />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h5 className="mb-1">{member.name}</h5>
                      <div className="text-accent-dark fw-semibold mb-2">{member.designation}</div>
                    <div className="text-muted-sw small d-flex flex-column align-items-center gap-1">
                      <div>
                        <i className="bi bi-telephone-fill text-accent me-2" />
                        <a href={`tel:${member.contact.replace(/\s+/g, "")}`} className="text-reset text-decoration-none">
                          {member.contact}
                        </a>
                      </div>
                      {member.email ? (
                        <div className="text-truncate" style={{ maxWidth: "100%" }}>
                          <i className="bi bi-envelope-fill text-accent me-2" />
                          <a href={`mailto:${member.email}`} className="text-reset text-decoration-none">
                            {member.email}
                          </a>
                        </div>
                      ) : null}
                    </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

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
