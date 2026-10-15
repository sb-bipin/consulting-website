import { getLocale, getTranslations } from "next-intl/server";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import JobCard from "@/components/public/JobCard";
import PageHeader from "@/components/public/PageHeader";
import { Link } from "@/i18n/navigation";

const PAGE_SIZE = 9;

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const locale = await getLocale();
  const t = await getTranslations("jobs");
  const tc = await getTranslations("common");

  const sp = await searchParams;
  const get = (k: string) => {
    const v = sp[k];
    return typeof v === "string" ? v : "";
  };

  const countrySlug = get("country");
  const categorySlug = get("category");
  const q = get("q");
  const sort = get("sort") || "newest";
  const page = Math.max(1, parseInt(get("page") || "1", 10) || 1);

  const where: Prisma.JobWhereInput = { status: "ACTIVE" };
  if (countrySlug) where.country = { slug: countrySlug };
  if (categorySlug) where.category = { slug: categorySlug };
  if (q) {
    where.OR = [
      { titleEn: { contains: q, mode: "insensitive" } },
      { titleNe: { contains: q } },
      { company: { contains: q, mode: "insensitive" } },
    ];
  }

  const orderBy: Prisma.JobOrderByWithRelationInput =
    sort === "salaryHigh" ? { salaryMax: "desc" } : { createdAt: "desc" };

  const [total, jobs, countries, categories] = await Promise.all([
    prisma.job.count({ where }),
    prisma.job.findMany({
      where,
      include: { country: true, category: true },
      orderBy,
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    }),
    prisma.country.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    }),
  ]);

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pick = (en: string, ne: string) => (locale === "ne" ? ne : en);

  const buildQuery = (overrides: Record<string, string>) => {
    const params = new URLSearchParams();
    const base: Record<string, string> = {
      country: countrySlug,
      category: categorySlug,
      q,
      sort,
    };
    for (const [k, v] of Object.entries({ ...base, ...overrides })) {
      if (v) params.set(k, v);
    }
    const qs = params.toString();
    return `/jobs${qs ? `?${qs}` : ""}`;
  };

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} crumb={t("title")} />

      <section className="section pt-4">
        <div className="container">
          <div className="row g-4">
            {/* Filters */}
            <div className="col-lg-3">
              <div className="sw-card p-4 sw-side-panel">
                <h5 className="mb-3">
                  <i className="bi bi-funnel-fill text-accent me-2" />
                  {tc("filters")}
                </h5>
                <form method="get">
                  <div className="mb-3">
                    <label className="form-label">{tc("search")}</label>
                    <input
                      name="q"
                      className="form-control"
                      placeholder={t("searchPlaceholder")}
                      defaultValue={q}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">{tc("country")}</label>
                    <select
                      name="country"
                      className="form-select"
                      defaultValue={countrySlug}
                    >
                      <option value="">{tc("allCountries")}</option>
                      {countries.map((c) => (
                        <option key={c.id} value={c.slug}>
                          {pick(c.nameEn, c.nameNe)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">{tc("category")}</label>
                    <select
                      name="category"
                      className="form-select"
                      defaultValue={categorySlug}
                    >
                      <option value="">{tc("allCategories")}</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.slug}>
                          {pick(c.nameEn, c.nameNe)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">{tc("sortBy")}</label>
                    <select name="sort" className="form-select" defaultValue={sort}>
                      <option value="newest">{tc("newest")}</option>
                      <option value="salaryHigh">{tc("salaryHigh")}</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary-sw w-100">
                    <i className="bi bi-search me-1" />
                    {tc("filter")}
                  </button>
                  <Link
                    href="/jobs"
                    className="btn btn-link w-100 text-muted-sw mt-1"
                  >
                    {tc("reset")}
                  </Link>
                </form>
              </div>
            </div>

            {/* Results */}
            <div className="col-lg-9">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <p className="mb-0 text-muted-sw">
                  <strong className="text-primary-sw">{total}</strong>{" "}
                  {tc("results")}
                </p>
              </div>

              {jobs.length === 0 ? (
                <div className="sw-card p-5 text-center">
                  <i className="bi bi-search fs-1 text-muted-sw" />
                  <h4 className="mt-3">{tc("noJobFound")}</h4>
                  <p className="text-muted-sw">{tc("noJobFoundDesc")}</p>
                  <Link href="/jobs" className="btn btn-primary-sw">
                    {tc("reset")}
                  </Link>
                </div>
              ) : (
                <div className="row g-4">
                  {jobs.map((job) => (
                    <div className="col-md-6" key={job.id}>
                      <JobCard job={job} />
                    </div>
                  ))}
                </div>
              )}

              {pages > 1 && (
                <nav className="mt-5">
                  <ul className="pagination justify-content-center">
                    {Array.from({ length: pages }).map((_, i) => {
                      const p = i + 1;
                      return (
                        <li
                          className={`page-item ${p === page ? "active" : ""}`}
                          key={p}
                        >
                          <Link
                            href={buildQuery({ page: String(p) })}
                            className="page-link"
                          >
                            {p}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
