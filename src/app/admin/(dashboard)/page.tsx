import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";

export default async function AdminDashboard() {
  const [
    jobCount,
    activeJobs,
    appCount,
    newApps,
    inquiryCount,
    unread,
    countryCount,
    categoryCount,
    recentApps,
    recentInquiries,
  ] = await Promise.all([
    prisma.job.count(),
    prisma.job.count({ where: { status: "ACTIVE" } }),
    prisma.application.count(),
    prisma.application.count({ where: { status: "NEW" } }),
    prisma.inquiry.count(),
    prisma.inquiry.count({ where: { isRead: false } }),
    prisma.country.count(),
    prisma.category.count(),
    prisma.application.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { job: { select: { titleEn: true } } },
    }),
    prisma.inquiry.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const cards = [
    { label: "Total Jobs", value: jobCount, sub: `${activeJobs} active`, icon: "bi-briefcase-fill", color: "#0b2c5e", bg: "rgba(11,44,94,.08)", href: "/admin/jobs" },
    { label: "Applications", value: appCount, sub: `${newApps} new`, icon: "bi-file-earmark-person-fill", color: "#0f7b6c", bg: "rgba(15,123,108,.1)", href: "/admin/applications" },
    { label: "Inquiries", value: inquiryCount, sub: `${unread} unread`, icon: "bi-chat-left-dots-fill", color: "#b8860b", bg: "rgba(245,166,35,.14)", href: "/admin/inquiries" },
    { label: "Countries", value: countryCount, sub: `${categoryCount} categories`, icon: "bi-globe2", color: "#7b2ff7", bg: "rgba(123,47,247,.1)", href: "/admin/countries" },
  ];

  return (
    <div>
      <div className="mb-4">
        <h1 className="h3 mb-1">Dashboard</h1>
        <p className="text-muted-sw mb-0">
          Overview of your recruitment portal activity
        </p>
      </div>

      <div className="row g-3 mb-4">
        {cards.map((c) => (
          <div className="col-sm-6 col-xl-3" key={c.label}>
            <Link href={c.href} className="text-decoration-none">
              <div className="admin-stat h-100">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="text-muted-sw small fw-semibold">
                      {c.label}
                    </div>
                    <div className="display-6 fw-bold" style={{ color: c.color }}>
                      {c.value}
                    </div>
                    <div className="small text-muted-sw">{c.sub}</div>
                  </div>
                  <span
                    className="icon"
                    style={{ background: c.bg, color: c.color }}
                  >
                    <i className={`bi ${c.icon}`} />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="row g-3">
        <div className="col-lg-7">
          <div className="sw-card p-3 p-lg-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Recent Applications</h5>
              <Link href="/admin/applications" className="small">
                View all
              </Link>
            </div>
            {recentApps.length === 0 ? (
              <p className="text-muted-sw mb-0">No applications yet.</p>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Applicant</th>
                      <th>Position</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentApps.map((a) => (
                      <tr key={a.id}>
                        <td>
                          <Link href={`/admin/applications/${a.id}`}>
                            {a.fullName}
                          </Link>
                        </td>
                        <td className="small text-muted-sw">
                          {a.job?.titleEn || "General"}
                        </td>
                        <td>
                          <span className="badge text-bg-light">{a.status}</span>
                        </td>
                        <td className="small text-muted-sw">
                          {formatDate(a.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="col-lg-5">
          <div className="sw-card p-3 p-lg-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Recent Inquiries</h5>
              <Link href="/admin/inquiries" className="small">
                View all
              </Link>
            </div>
            {recentInquiries.length === 0 ? (
              <p className="text-muted-sw mb-0">No inquiries yet.</p>
            ) : (
              <ul className="list-unstyled mb-0 d-flex flex-column gap-3">
                {recentInquiries.map((q) => (
                  <li key={q.id} className="d-flex gap-3">
                    <span
                      className="d-grid rounded-circle bg-soft flex-shrink-0"
                      style={{ width: 42, height: 42, placeItems: "center" }}
                    >
                      <i className="bi bi-person-fill text-primary-sw" />
                    </span>
                    <div className="min-w-0">
                      <div className="fw-semibold">
                        {q.name}
                        {!q.isRead && (
                          <span className="badge bg-danger ms-2">new</span>
                        )}
                      </div>
                      <div
                        className="small text-muted-sw text-truncate"
                        style={{ maxWidth: 280 }}
                      >
                        {q.message}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
