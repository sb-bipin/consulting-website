"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export default function LanguageSwitcher({
  variant = "light",
}: {
  variant?: "light" | "dark";
}) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchTo = (next: "en" | "ne") => {
    if (next === locale) return;
    router.replace(pathname, { locale: next });
  };

  const btnBase = "btn btn-sm px-2 py-1 fw-semibold";
  const activeCls =
    variant === "dark" ? "btn-primary-sw" : "btn-primary-sw";
  const inactiveCls =
    variant === "dark"
      ? "btn-outline-sw text-white"
      : "btn-outline-primary-sw";

  return (
    <div className="d-inline-flex align-items-center gap-1">
      <i
        className={`bi bi-translate me-1 ${
          variant === "dark" ? "text-white" : "text-primary-sw"
        }`}
      />
      <button
        type="button"
        className={`${btnBase} ${locale === "en" ? activeCls : inactiveCls}`}
        onClick={() => switchTo("en")}
        aria-label="English"
      >
        EN
      </button>
      <button
        type="button"
        className={`${btnBase} ${locale === "ne" ? activeCls : inactiveCls}`}
        onClick={() => switchTo("ne")}
        aria-label="Nepali"
      >
        नेपाली
      </button>
    </div>
  );
}
