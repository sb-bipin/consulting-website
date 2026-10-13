"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { formatSalary, daysLeft } from "@/lib/format";

export type JobCardJob = {
  id: string;
  slug: string;
  titleEn: string;
  titleNe: string;
  company: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  currency: string;
  vacancies: number;
  deadline: Date | string | null;
  isFeatured: boolean;
  country: { nameEn: string; nameNe: string; flag: string | null } | null;
  category: { nameEn: string; nameNe: string; icon: string | null } | null;
};

export default function JobCard({ job }: { job: JobCardJob }) {
  const locale = useLocale();
  const t = useTranslations("common");
  const tj = useTranslations("jobs");

  const title = locale === "ne" ? job.titleNe : job.titleEn;
  const country = job.country
    ? locale === "ne"
      ? job.country.nameNe
      : job.country.nameEn
    : "";
  const category = job.category
    ? locale === "ne"
      ? job.category.nameNe
      : job.category.nameEn
    : "";
  const left = daysLeft(job.deadline);

  return (
    <div className="sw-card job-card d-flex flex-column">
      <div className="job-card-top">
        <div className="d-flex justify-content-between align-items-start gap-2">
          <span className="badge-soft d-inline-flex align-items-center gap-1">
            {job.country?.flag && <span>{job.country.flag}</span>}
            {country}
          </span>
          {job.isFeatured && (
            <span className="badge-accent">
              <i className="bi bi-star-fill me-1" />
              {tj("featured")}
            </span>
          )}
        </div>
        <h3 className="job-title mt-3">{title}</h3>
        <div className="company">
          <i className="bi bi-building me-1" />
          {job.company || "Swostik Overseas"}
        </div>
        <div className="job-meta">
          <span>
            <i className="bi bi-cash-stack me-1" />
            {formatSalary(job.salaryMin, job.salaryMax, job.currency, t("negotiable"))}
          </span>
          <span>
            <i className="bi bi-people me-1" />
            {job.vacancies} {t("positions")}
          </span>
        </div>
      </div>
      <div className="p-3 pt-3 mt-auto">
        <div className="d-flex flex-wrap gap-2 mb-3 small text-muted-sw">
          {category && (
            <span>
              <i className={`bi ${job.category?.icon || "bi-briefcase"} me-1`} />
              {category}
            </span>
          )}
          {left !== null && (
            <span className={left <= 7 ? "text-danger fw-semibold" : ""}>
              <i className="bi bi-calendar-event me-1" />
              {left > 0 ? `${left} days left` : "Closed"}
            </span>
          )}
        </div>
        <Link href={`/jobs/${job.slug}`} className="btn btn-primary-sw w-100">
          {t("viewDetails")}
          <i className="bi bi-arrow-right ms-1" />
        </Link>
      </div>
    </div>
  );
}
