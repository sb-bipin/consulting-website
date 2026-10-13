import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/site";
import PageHeader from "@/components/public/PageHeader";
import JobCard from "@/components/public/JobCard";
import { Link } from "@/i18n/navigation";
import { formatSalary, formatDate } from "@/lib/format";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = await getTranslations("job");
  const tc = await getTranslations("common");

  const job = await prisma.job.findUnique({
    where: { slug },
    include: { country: true, category: true },
  });

  if (!job || job.status !== "ACTIVE") notFound();

  await prisma.job.update({
    where: { id: job.id },
    data: { views: { increment: 1 } },
  });

  const similar = await prisma.job.findMany({
    where: {
      status: "ACTIVE",
      categoryId: job.categoryId,
      id: { not: job.id },
    },
    include: { country: true, category: true },
    take: 3,
  });

  const settings = await getSettings();
  const whatsapp = settings.whatsapp || "";
  const email = settings.email || "info@swostikoverseas.com";

  const pick = (en: string, ne: string) => (locale === "ne" ? ne : en);
  const title = pick(job.titleEn, job.titleNe);
  const country = job.country ? pick(job.country.nameEn, job.country.nameNe) : "";
  const category = job.category
    ? pick(job.category.nameEn, job.category.nameNe)
    : "";

  const waText = encodeURIComponent(
    `Hello, I am interested in the "${title}" position (${job.slug}).`
  );
  const mailSubject = encodeURIComponent(`Application: ${title}`);

  const facts = [
    { icon: "bi-geo-alt-fill", label: tc("country"), value: country },
    { icon: "bi-tag-fill", label: tc("category"), value: category },
    {
      icon: "bi-cash-stack",
      label: tc("salary"),
      value: formatSalary(job.salaryMin, job.salaryMax, job.currency, tc("negotiable")),
    },
    { icon: "bi-people-fill", label: tc("vacancies"), value: `${job.vacancies} ${tc("positions")}` },
    { icon: "bi-clock-fill", label: tc("workingHours"), value: job.workingHours || "—" },
    { icon: "bi-calendar-check", label: tc("contractDuration"), value: job.contractDuration || "—" },
    { icon: "bi-calendar-event", label: tc("interviewDate"), value: formatDate(job.interviewDate, locale) },
    { icon: "bi-hourglass-split", label: tc("deadline"), value: formatDate(job.deadline, locale) },
  ];

  const facilities = [
    job.accommodation && { icon: "bi-house-door-fill", label: tc("accommodation") },
    job.food && { icon: "bi-cup-hot-fill", label: tc("food") },
    job.overtime && { icon: "bi-cash-coin", label: tc("overtime") },
  ].filter(Boolean) as { icon: string; label: string }[];

  return (
    <>
      <PageHeader title={title} crumb={t("overview")} />

      <section className="section pt-4">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="sw-card p-4 p-lg-5 mb-4">
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {job.isFeatured && (
                    <span className="badge-accent">
                      <i className="bi bi-star-fill me-1" />
                      Featured
                    </span>
                  )}
                  <span className="badge-soft">
                    {job.country?.flag} {country}
                  </span>
                  <span className="badge-soft">
                    <i className={`bi ${job.category?.icon || "bi-briefcase"} me-1`} />
                    {category}
                  </span>
                </div>

                <h1 className="h3 mb-1">{title}</h1>
                <p className="text-muted-sw mb-4">
                  <i className="bi bi-building me-1" />
                  {job.company || "Swostik Overseas"}
                  <span className="mx-2">·</span>
                  <i className="bi bi-eye me-1" />
                  {job.views + 1} {t("views")}
                </p>

                <div className="row g-3 mb-4">
                  {facts.map((f) => (
                    <div className="col-sm-6" key={f.label}>
                      <div className="d-flex gap-3 p-3 rounded-sw bg-soft h-100">
                        <i className={`bi ${f.icon} fs-4 text-accent-dark`} />
                        <div>
                          <div className="small text-muted-sw">{f.label}</div>
                          <div className="fw-semibold">{f.value}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {facilities.length > 0 && (
                  <div className="d-flex flex-wrap gap-2 mb-4">
                    {facilities.map((f) => (
                      <span className="badge-soft" key={f.label}>
                        <i className={`bi ${f.icon} me-1`} />
                        {f.label}
                      </span>
                    ))}
                  </div>
                )}

                <hr />
                <h4 className="mt-4">
                  <i className="bi bi-file-text me-2 text-accent" />
                  {t("description")}
                </h4>
                <p className="pre-line text-muted-sw">
                  {pick(job.descriptionEn, job.descriptionNe)}
                </p>

                {pick(job.requirementsEn || "", job.requirementsNe || "") && (
                  <>
                    <h4 className="mt-4">
                      <i className="bi bi-list-check me-2 text-accent" />
                      {t("requirements")}
                    </h4>
                    <p className="pre-line text-muted-sw">
                      {pick(job.requirementsEn || "", job.requirementsNe || "")}
                    </p>
                  </>
                )}

                {pick(job.benefitsEn || "", job.benefitsNe || "") && (
                  <>
                    <h4 className="mt-4">
                      <i className="bi bi-gift me-2 text-accent" />
                      {t("benefits")}
                    </h4>
                    <p className="pre-line text-muted-sw">
                      {pick(job.benefitsEn || "", job.benefitsNe || "")}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Apply sidebar */}
            <div className="col-lg-4">
              <div className="sw-card p-4 sticky-lg-top mb-4" style={{ top: "100px" }}>
                <h5 className="mb-3">{t("applyTitle")}</h5>

                <Link
                  href={`/apply/${job.slug}`}
                  className="btn btn-primary-sw w-100 mb-2"
                >
                  <i className="bi bi-pencil-square me-2" />
                  {t("applyOnline")}
                </Link>
                <p className="small text-muted-sw">{t("applyOnlineDesc")}</p>

                {whatsapp && (
                  <a
                    href={`https://wa.me/${whatsapp}?text=${waText}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-success w-100 mb-2"
                  >
                    <i className="bi bi-whatsapp me-2" />
                    {t("applyWhatsapp")}
                  </a>
                )}

                <a
                  href={`mailto:${email}?subject=${mailSubject}`}
                  className="btn btn-outline-primary-sw w-100 mb-2"
                >
                  <i className="bi bi-envelope-fill me-2" />
                  {t("applyEmail")}
                </a>

                <Link href="/contact" className="btn btn-link w-100 text-muted-sw">
                  <i className="bi bi-geo-alt me-1" />
                  {t("applyVisit")}
                </Link>

                {job.deadline && (
                  <div className="alert alert-warning mt-3 mb-0 small">
                    <i className="bi bi-hourglass-split me-1" />
                    {t("applicationDeadline")}:{" "}
                    <strong>{formatDate(job.deadline, locale)}</strong>
                  </div>
                )}
              </div>
            </div>
          </div>

          {similar.length > 0 && (
            <div className="mt-5">
              <h3 className="h4 mb-4">{t("similarJobs")}</h3>
              <div className="row g-4">
                {similar.map((s) => (
                  <div className="col-md-6 col-lg-4" key={s.id}>
                    <JobCard job={s} />
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
