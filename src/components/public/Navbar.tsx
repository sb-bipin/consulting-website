"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import HeaderHeightSync from "@/components/HeaderHeightSync";

type Props = {
  settings: Record<string, string>;
};

const links = [
  { href: "/", key: "home" },
  { href: "/jobs", key: "jobs" },
  { href: "/countries", key: "countries" },
  { href: "/services", key: "services" },
  { href: "/about", key: "about" },
  { href: "/notices", key: "notices" },
  { href: "/contact", key: "contact" },
] as const;

export default function Navbar({ settings }: Props) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const phone = settings.phone || "+977-1-4000000";
  const email = settings.email || "info@swostikoverseas.com";
  const address = settings.address || "Kathmandu, Nepal";

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky-top">
      <HeaderHeightSync />
      <div className="topbar d-none d-lg-block py-2">
        <div className="container d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div className="d-flex flex-wrap gap-3">
            <span>
              <i className="bi bi-geo-alt-fill me-1 text-accent" />
              {address}
            </span>
            <a href={`mailto:${email}`}>
              <i className="bi bi-envelope-fill me-1 text-accent" />
              {email}
            </a>
          </div>
          <div className="d-flex gap-3 align-items-center">
            <a href={`tel:${phone}`}>
              <i className="bi bi-telephone-fill me-1 text-accent" />
              {phone}
            </a>
            <span className="opacity-50">|</span>
            <span>{settings.office_hours}</span>
            <Link href="/admin" className="fw-semibold">
              <i className="bi bi-shield-lock me-1" />
              Admin
            </Link>
          </div>
        </div>
      </div>

      <nav className="sw-navbar navbar navbar-expand-lg py-2">
        <div className="container">
          <Link href="/" className="brand-logo navbar-brand py-0">
            <span className="brand-mark">
              <i className="bi bi-airplane-engines-fill" />
            </span>
            <span>
              Swostik <span className="text-accent">Overseas</span>
              <small>{settings.tagline || t("applyNow")}</small>
            </span>
          </Link>

          <button
            className="navbar-toggler border-0"
            type="button"
            aria-label="Toggle navigation"
            onClick={() => setOpen((v) => !v)}
          >
            <i className="bi bi-list fs-2 text-primary-sw" />
          </button>

          <div
            className={`collapse navbar-collapse ${open ? "show" : ""}`}
            id="mainNav"
          >
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
              {links.map((l) => (
                <li className="nav-item" key={l.key}>
                  <Link
                    href={l.href}
                    className={`nav-link ${isActive(l.href) ? "active" : ""}`}
                    onClick={() => setOpen(false)}
                  >
                    {t(l.key)}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-2">
              <LanguageSwitcher />
              <Link href="/apply" className="btn btn-accent">
                <i className="bi bi-send-fill me-1" />
                {t("applyNow")}
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
