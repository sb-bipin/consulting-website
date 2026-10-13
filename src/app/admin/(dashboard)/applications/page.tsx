import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ConfirmSubmit from "@/components/admin/ConfirmSubmit";
import { deleteApplication } from "@/actions/admin";
import { formatDate } from "@/lib/format";
import { Prisma } from "@/generated/prisma/client";

const statusStyles: Record<string, string> = {
  NEW: "text-bg-primary",
  REVIEWING: "text-bg-info",
  SHORTLISTED: "text-bg-warning",
  REJECTED: "text-bg-danger",
  SELECTED: "text-bg-success",
};

export default async function AdminApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const jobFilter = typeof sp.job === "string" ? sp.job : "";
  const statusFilter = typeof sp.status === "string" ? sp.status : "";

  const where: Prisma.ApplicationWhereInput = {};
  if (jobFilter) where.jobId = jobFilter;
  if (statusFilter)
    where.status = statusFilter as
      | "NEW"
      | "REVIEWING"
      | "SHORTLISTED"
      | "REJECTED"
      | "SELECTED";

  const [apps, jobs] = await Promise.all([
    prisma.application.findMany({
      where,
      include: { job: { select: { id: true, titleEn: true, slug: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.job.findMany({ orderBy: { titleEn: "asc" }, select: { id: true, titleEn: true } }),
  ]);

  const statuses = ["NEW", "REVIEWING", "SHORTLISTED", "REJECTED", "SELECTED"];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Applications</h1>
          <p className="text-muted-sw mb-0">{apps.length} applications</p>
        </div>
      </div>

      <div className="sw-card p-3 p-lg-4 mb-4">
        <form className="row g-2 align-items-end" method="get">
          <div className="col-md-5">
            <label className="form-label">Filter by Job</label>
            <select name="job" className="form-select" defaultValue={jobFilter}>
              <option value="">All jobs</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.titleEn}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Filter by Status</label>
            <select name="status" className="form-select" defaultValue={statusFilter}>
              <option value="">All statuses</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3 d-flex gap-2">
            <button className="btn btn-primary-sw w-100" type="submit">
              <i className="bi bi-funnel me-1" />
              Filter
            </button>
            <Link href="/admin/applications" className="btn btn-outline-primary-sw">
              <i className="bi bi-x-lg" />
            </Link>
          </div>
        </form>
      </div>

      <div className="sw-card p-3 p-lg-4">
        <div className="table-responsive">
          <table className="table admin-table align-middle">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Position</th>
                <th>Contact</th>
                <th>Status</th>
                <th>CV</th>
                <th>Date</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {apps.map((a) => (
                <tr key={a.id}>
                  <td>
                    <Link href={`/admin/applications/${a.id}`} className="fw-semibold">
                      {a.fullName}
                    </Link>
                  </td>
                  <td className="small text-muted-sw">
                    {a.job?.titleEn || "General Application"}
                  </td>
                  <td className="small text-muted-sw">
                    <div>{a.email}</div>
                    <div>{a.phone}</div>
                  </td>
                  <td>
                    <span className={`badge ${statusStyles[a.status]}`}>
                      {a.status}
                    </span>
                  </td>
                  <td>
                    {a.resumeUrl ? (
                      <a href={a.resumeUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary-sw">
                        <i className="bi bi-file-earmark-pdf" /> View
                      </a>
                    ) : (
                      <span className="text-muted-sw small">—</span>
                    )}
                  </td>
                  <td className="small text-muted-sw">{formatDate(a.createdAt)}</td>
                  <td className="text-end">
                    <div className="d-flex justify-content-end gap-1">
                      <Link href={`/admin/applications/${a.id}`} className="btn btn-sm btn-outline-primary-sw">
                        <i className="bi bi-eye" />
                      </Link>
                      <form action={deleteApplication}>
                        <input type="hidden" name="id" value={a.id} />
                        <ConfirmSubmit message={`Delete application from "${a.fullName}"?`}>
                          <i className="bi bi-trash" />
                        </ConfirmSubmit>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {apps.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-muted-sw py-4">
                    No applications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
