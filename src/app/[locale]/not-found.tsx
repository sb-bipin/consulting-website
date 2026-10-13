"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function LocaleNotFound() {
  const t = useTranslations("notFound");

  return (
    <section className="section">
      <div className="container text-center py-5">
        <div
          className="display-1 fw-bold text-primary-sw"
          style={{ letterSpacing: "-2px" }}
        >
          {t("code")}
        </div>
        <h1 className="h2 mt-2">{t("title")}</h1>
        <p className="text-muted-sw mx-auto" style={{ maxWidth: 520 }}>
          {t("text")}
        </p>
        <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
          <Link href="/" className="btn btn-primary-sw btn-lg">
            <i className="bi bi-house-door me-1" />
            {t("home")}
          </Link>
          <Link href="/jobs" className="btn btn-accent btn-lg">
            <i className="bi bi-briefcase me-1" />
            {t("browseJobs")}
          </Link>
        </div>
      </div>
    </section>
  );
}
