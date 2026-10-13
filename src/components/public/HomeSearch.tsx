"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

type Option = {
  id: string;
  nameEn: string;
  nameNe: string;
  slug: string;
};

export default function HomeSearch({
  countries,
  categories,
}: {
  countries: Option[];
  categories: Option[];
}) {
  const t = useTranslations("home");
  const locale = useLocale();
  const router = useRouter();
  const [country, setCountry] = useState("");
  const [category, setCategory] = useState("");

  const label = (o: Option) => (locale === "ne" ? o.nameNe : o.nameEn);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (country) params.set("country", country);
    if (category) params.set("category", category);
    const qs = params.toString();
    router.push(`/jobs${qs ? `?${qs}` : ""}`);
  };

  return (
    <form className="search-card" onSubmit={submit}>
      <div className="row g-2 align-items-end">
        <div className="col-md-4">
          <label className="form-label d-block">{t("searchCountry")}</label>
          <select
            className="form-select"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            <option value="">{t("searchCountry")}</option>
            {countries.map((c) => (
              <option key={c.id} value={c.slug}>
                {label(c)}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label d-block">{t("searchCategory")}</label>
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">{t("searchCategory")}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {label(c)}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <button type="submit" className="btn btn-accent w-100">
            <i className="bi bi-search me-1" />
            {t("searchBtn")}
          </button>
        </div>
      </div>
    </form>
  );
}
