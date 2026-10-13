import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/public/PageHeader";
import JobCard from "@/components/public/JobCard";
import { Link } from "@/i18n/navigation";

export default async function CountryDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = await getTranslations("countries");
  const tc = await getTranslations("common");

  const country = await prisma.country.findUnique({ where: { slug } });
  if (!country || !country.isActive) notFound();

  const jobs = await prisma.job.findMany({
    where: { status: "ACTIVE", countryId: country.id },
    include: { country: true, category: true },
    orderBy: { createdAt: "desc" },
  });

  const pick = (en: string, ne: string) => (locale === "ne" ? ne : en);
  const name = pick(country.nameEn, country.nameNe);

  return (
    <>
      <PageHeader
        title={`${t("jobsIn")} ${name} ${country.flag ?? ""}`}
        subtitle={pick(country.descriptionEn || "", country.descriptionNe || "")}
        crumb={name}
      />
      <section className="section">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="h4 mb-0">
              {jobs.length} {tc("positions")}
            </h2>
            <Link href="/jobs" className="btn btn-outline-primary-sw btn-sm">
              {tc("backToJobs")}
            </Link>
          </div>

          {jobs.length === 0 ? (
            <div className="sw-card p-5 text-center">
              <i className="bi bi-inbox fs-1 text-muted-sw" />
              <h4 className="mt-3">{tc("noJobFound")}</h4>
              <p className="text-muted-sw">{tc("noJobFoundDesc")}</p>
              <Link href="/jobs" className="btn btn-primary-sw">
                {tc("viewAll")}
              </Link>
            </div>
          ) : (
            <div className="row g-4">
              {jobs.map((job) => (
                <div className="col-md-6 col-lg-4" key={job.id}>
                  <JobCard job={job} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
