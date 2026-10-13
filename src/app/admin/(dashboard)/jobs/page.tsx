import Link from "next/link";
import { prisma } from "@/lib/prisma";
import JobForm from "@/components/admin/JobForm";
import ConfirmSubmit from "@/components/admin/ConfirmSubmit";
import { deleteJob, toggleJobStatus } from "@/actions/admin";
import { formatDate, formatSalary } from "@/lib/format";

export default async function AdminJobsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const editId = typeof sp.edit === "string" ? sp.edit : "";

  const [jobs, countries, categories, editJob] = await Promise.all([
    prisma.job.findMany({
      include: {
        country: true,
        category: true,
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.country.findMany({ orderBy: { order: "asc" } }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
    editId ? prisma.job.findUnique({ where: { id: editId } }) : null,
  ]);

  const statusBadge: Record<string, string> = {
    ACTIVE: "text-bg-success",
    DRAFT: "text-bg-secondary",
    CLOSED: "text-bg-danger",
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Jobs</h1>
          <p className="text-muted-sw mb-0">{jobs.length} positions posted</p>
        </div>
        {editId && (
          <Link href="/admin/jobs" className="btn btn-outline-primary-sw btn-sm">
            <i className="bi bi-plus-lg me-1" />
            New Job
          </Link>
        )}
      </div>

      <div className="sw-card p-3 p-lg-4 mb-4">
        <h5 className="mb-3">
          {editJob ? `Edit Job: ${editJob.titleEn}` : "Add New Job"}
        </h5>
        <JobForm
          job={editJob}
          countries={countries}
          categories={categories}
        />
      </div>

      <div className="sw-card p-3 p-lg-4">
        <div className="table-responsive">
          <table className="table admin-table align-middle">
            <thead>
              <tr>
                <th>Title</th>
                <th>Country</th>
                <th>Category</th>
                <th>Salary</th>
                <th>Applications</th>
                <th>Status</th>
                <th>Deadline</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => (
                <tr key={j.id}>
                  <td>
                    <div className="fw-semibold">{j.titleEn}</div>
                    <div className="small text-muted-sw">{j.company}</div>
                  </td>
                  <td className="small">{j.country?.flag} {j.country?.nameEn}</td>
                  <td className="small">{j.category?.nameEn}</td>
                  <td className="small">
                    {formatSalary(j.salaryMin, j.salaryMax, j.currency, "—")}
                  </td>
                  <td>
                    <Link
                      href={`/admin/applications?job=${j.id}`}
                      className="badge text-bg-light text-decoration-none"
                    >
                      {j._count.applications}
                    </Link>
                  </td>
                  <td>
                    <form action={toggleJobStatus}>
                      <input type="hidden" name="id" value={j.id} />
                      <input
                        type="hidden"
                        name="status"
                        value={j.status === "ACTIVE" ? "CLOSED" : "ACTIVE"}
                      />
                      <button
                        type="submit"
                        className={`badge border-0 ${statusBadge[j.status]}`}
                        title="Click to toggle"
                      >
                        {j.status}
                      </button>
                    </form>
                  </td>
                  <td className="small text-muted-sw">
                    {formatDate(j.deadline)}
                  </td>
                  <td className="text-end">
                    <div className="d-flex justify-content-end gap-1">
                      <Link
                        href={`/admin/jobs?edit=${j.id}`}
                        className="btn btn-sm btn-outline-primary-sw"
                      >
                        <i className="bi bi-pencil" />
                      </Link>
                      <form action={deleteJob}>
                        <input type="hidden" name="id" value={j.id} />
                        <ConfirmSubmit message={`Delete "${j.titleEn}"?`}>
                          <i className="bi bi-trash" />
                        </ConfirmSubmit>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {jobs.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center text-muted-sw py-4">
                    No jobs yet. Create your first job above.
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
