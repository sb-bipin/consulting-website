"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin", label: "Dashboard", icon: "bi-speedometer2" },
  { href: "/admin/jobs", label: "Jobs", icon: "bi-briefcase-fill" },
  { href: "/admin/categories", label: "Categories", icon: "bi-tags-fill" },
  { href: "/admin/countries", label: "Countries", icon: "bi-globe2" },
  { href: "/admin/applications", label: "Applications", icon: "bi-file-earmark-person-fill" },
  { href: "/admin/inquiries", label: "Inquiries", icon: "bi-chat-left-dots-fill" },
  { href: "/admin/services", label: "Services", icon: "bi-grid-1x2-fill" },
  { href: "/admin/testimonials", label: "Testimonials", icon: "bi-chat-quote-fill" },
  { href: "/admin/faqs", label: "FAQs", icon: "bi-question-circle-fill" },
  { href: "/admin/notices", label: "Notices", icon: "bi-megaphone-fill" },
  { href: "/admin/settings", label: "Settings", icon: "bi-gear-fill" },
  { href: "/admin/account", label: "My Account", icon: "bi-person-circle" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <div className="admin-sidebar d-flex flex-column p-3">
      <Link
        href="/admin"
        className="d-flex align-items-center gap-2 text-white text-decoration-none mb-4 px-2"
      >
        <span
          className="d-grid"
          style={{
            width: 40,
            height: 40,
            placeItems: "center",
            borderRadius: 12,
            background: "var(--sw-accent)",
            color: "#1c1c1c",
          }}
        >
          <i className="bi bi-airplane-engines-fill" />
        </span>
        <span className="fw-bold">
          Swostik <span className="text-accent">Admin</span>
        </span>
      </Link>

      <ul className="nav nav-pills flex-column gap-1">
        {items.map((it) => (
          <li className="nav-item" key={it.href}>
            <Link
              href={it.href}
              className={`nav-link d-flex align-items-center gap-2 ${
                isActive(it.href) ? "active" : ""
              }`}
            >
              <i className={`bi ${it.icon}`} />
              {it.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-3">
        <Link
          href="/"
          className="nav-link d-flex align-items-center gap-2"
          target="_blank"
        >
          <i className="bi bi-box-arrow-up-right" />
          View Website
        </Link>
      </div>
    </div>
  );
}
