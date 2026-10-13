import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/site";
import JobCard from "@/components/public/JobCard";
import HomeSearch from "@/components/public/HomeSearch";
import { initials } from "@/lib/format";

export default async function HomePage() {
  const locale = await getLocale();
  const t = await getTranslations("home");
  const tc = await getTranslations("common");
  const tp = await getTranslations("process");
  const ts = await getTranslations("services");

  const [
    settings,
    countries,
    categories,
    services,
    testimonials,
    faqs,
  ] = await Promise.all([
    getSettings(),
    prisma.country.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      take: 12,
    }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      take: 8,
    }),
    prisma.service.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
    prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      take: 3,
    }),
    prisma.faq.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      take: 5,
    }),
  ]);

  let featuredJobs = await prisma.job.findMany({
    where: { status: "ACTIVE", isFeatured: true },
    include: { country: true, category: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });
  if (featuredJobs.length === 0) {
    featuredJobs = await prisma.job.findMany({
      where: { status: "ACTIVE" },
      include: { country: true, category: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    });
  }

  const stats = [
    {
      value: Number(settings.stat_placements || 25000),
      label: t("statsPlacements"),
      icon: "bi-people-fill",
    },
    {
      value: Number(settings.stat_countries || 12),
      label: t("statsCountries"),
      icon: "bi-globe2",
    },
    {
      value: Number(settings.stat_clients || 300),
      label: t("statsClients"),
      icon: "bi-building",
    },
    {
      value: Number(settings.stat_years || 15),
      label: t("statsYears"),
      icon: "bi-award-fill",
    },
  ];

  const processSteps = [1, 2, 3, 4, 5, 6];

  const pick = (en: string, ne: string) => (locale === "ne" ? ne : en);

  return (
    <>
      {/* Hero */}
      <section className="hero py-5">
        <div className="container py-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <span className="hero-badge mb-3">
                <i className="bi bi-patch-check-fill text-accent" />
                {t("heroBadge")}
              </span>
              <h1 className="mt-3">
                {pick(settings.hero_title_en || "", settings.hero_title_ne || "") ||
                  t("heroTitle")}
              </h1>
              <p className="hero-lead mt-3">
                {pick(
                  settings.hero_subtitle_en || "",
                  settings.hero_subtitle_ne || ""
                ) || t("heroSubtitle")}
              </p>
              <div className="d-flex flex-wrap gap-3 mt-4">
                <Link href="/jobs" className="btn btn-accent btn-lg">
                  <i className="bi bi-search me-1" />
                  {t("searchBtn")}
                </Link>
                <Link href="/contact" className="btn btn-outline-sw btn-lg">
                  <i className="bi bi-chat-dots me-1" />
                  {t("ctaButton")}
                </Link>
              </div>
              <div className="d-flex flex-wrap gap-4 mt-4 small">
                <span>
                  <i className="bi bi-check-circle-fill text-accent me-1" />
                  {t("trustLicensed")}
                </span>
                <span>
                  <i className="bi bi-check-circle-fill text-accent me-1" />
                  {t("trustEthical")}
                </span>
                <span>
                  <i className="bi bi-check-circle-fill text-accent me-1" />
                  {t("trustSupport")}
                </span>
              </div>
            </div>
            <div className="col-lg-5">
              <HomeSearch
                countries={countries.map((c) => ({
                  id: c.id,
                  nameEn: c.nameEn,
                  nameNe: c.nameNe,
                  slug: c.slug,
                }))}
                categories={categories.map((c) => ({
                  id: c.id,
                  nameEn: c.nameEn,
                  nameNe: c.nameNe,
                  slug: c.slug,
                }))}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-sm bg-soft">
        <div className="container">
          <div className="row g-3">
            {stats.map((s) => (
              <div className="col-6 col-lg-3" key={s.label}>
                <div className="stat-card">
                  <i className={`bi ${s.icon} fs-3 text-accent-dark`} />
                  <div className="stat-value mt-2">
                    {s.value.toLocaleString()}+
                  </div>
                  <div className="stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-eyebrow">{tc("viewAll")}</span>
            <h2 className="section-title">{t("featuredTitle")}</h2>
            <p className="section-lead">{t("featuredSubtitle")}</p>
          </div>
          <div className="row g-4">
            {featuredJobs.map((job) => (
              <div className="col-md-6 col-lg-4" key={job.id}>
                <JobCard job={job} />
              </div>
            ))}
          </div>
          <div className="text-center mt-5">
            <Link href="/jobs" className="btn btn-outline-primary-sw btn-lg">
              {tc("viewAll")}
              <i className="bi bi-arrow-right ms-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section bg-soft">
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-eyebrow">{tc("category")}</span>
            <h2 className="section-title">{t("categoriesTitle")}</h2>
            <p className="section-lead">{t("categoriesSubtitle")}</p>
          </div>
          <div className="row g-3">
            {categories.map((c) => (
              <div className="col-md-6 col-lg-3" key={c.id}>
                <Link
                  href={`/jobs?category=${c.slug}`}
                  className="category-tile"
                >
                  <span className="cat-icon">
                    <i className={`bi ${c.icon || "bi-briefcase"}`} />
                  </span>
                  <span className="fw-semibold">
                    {pick(c.nameEn, c.nameNe)}
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Countries */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-eyebrow">{tc("country")}</span>
            <h2 className="section-title">{t("countriesTitle")}</h2>
            <p className="section-lead">{t("countriesSubtitle")}</p>
          </div>
          <div className="row g-3">
            {countries.map((c) => (
              <div className="col-6 col-md-4 col-lg-3" key={c.id}>
                <Link href={`/jobs?country=${c.slug}`} className="country-card">
                  <div className="flag">{c.flag}</div>
                  <div className="fw-semibold mt-2">{pick(c.nameEn, c.nameNe)}</div>
                  <small className="text-muted-sw">{tc("viewDetails")}</small>
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-5">
            <Link href="/countries" className="btn btn-outline-primary-sw btn-lg">
              {t("countriesTitle")}
              <i className="bi bi-arrow-right ms-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section bg-primary-sw text-white">
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-eyebrow">{ts("title")}</span>
            <h2 className="section-title text-white">{t("servicesTitle")}</h2>
            <p className="section-lead" style={{ color: "rgba(255,255,255,.75)" }}>
              {t("servicesSubtitle")}
            </p>
          </div>
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

      {/* Process */}
      <section className="section bg-soft">
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-eyebrow">{tp("title")}</span>
            <h2 className="section-title">{t("processTitle")}</h2>
            <p className="section-lead">{t("processSubtitle")}</p>
          </div>
          <div className="row g-4">
            {processSteps.map((n) => (
              <div className="col-md-6 col-lg-4" key={n}>
                <div className="process-step">
                  <span className="step-num">{n}</span>
                  <h5>{tp(`step${n}Title`)}</h5>
                  <p className="text-muted-sw mb-0">{tp(`step${n}Desc`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-eyebrow">{t("testimonialsTitle")}</span>
            <h2 className="section-title">{t("testimonialsTitle")}</h2>
            <p className="section-lead">{t("testimonialsSubtitle")}</p>
          </div>
          <div className="row g-4">
            {testimonials.map((item) => (
              <div className="col-md-6 col-lg-4" key={item.id}>
                <div className="testimonial-card d-flex flex-column">
                  <div className="text-accent mb-2">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <i className="bi bi-star-fill me-1" key={i} />
                    ))}
                  </div>
                  <p className="quote">“{item.message}”</p>
                  <div className="d-flex align-items-center gap-3 mt-auto">
                    <span className="avatar-circle">{initials(item.name)}</span>
                    <div>
                      <div className="fw-bold">{item.name}</div>
                      <small className="text-muted-sw">{item.position}</small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-soft">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-5">
              <span className="section-eyebrow">{t("faqTitle")}</span>
              <h2 className="section-title">{t("faqTitle")}</h2>
              <p className="text-muted-sw">{t("faqSubtitle")}</p>
              <Link href="/contact" className="btn btn-primary-sw mt-2">
                <i className="bi bi-chat-dots me-1" />
                {t("ctaButton")}
              </Link>
            </div>
            <div className="col-lg-7">
              <div className="accordion" id="faqAccordion">
                {faqs.map((f, i) => (
                  <div className="accordion-item mb-3 border rounded-sw overflow-hidden" key={f.id}>
                    <h2 className="accordion-header">
                      <button
                        className={`accordion-button ${i !== 0 ? "collapsed" : ""}`}
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#faq${i}`}
                      >
                        {pick(f.questionEn, f.questionNe)}
                      </button>
                    </h2>
                    <div
                      id={`faq${i}`}
                      className={`accordion-collapse collapse ${i === 0 ? "show" : ""}`}
                      data-bs-parent="#faqAccordion"
                    >
                      <div className="accordion-body text-muted-sw">
                        {pick(f.answerEn, f.answerNe)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <div className="cta-band text-center text-lg-start">
            <div className="row align-items-center g-4">
              <div className="col-lg-8">
                <h2 className="mb-2">{t("ctaTitle")}</h2>
                <p className="mb-0" style={{ color: "rgba(255,255,255,.85)" }}>
                  {t("ctaSubtitle")}
                </p>
              </div>
              <div className="col-lg-4 text-lg-end">
                <Link href="/contact" className="btn btn-accent btn-lg">
                  {t("ctaButton")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
