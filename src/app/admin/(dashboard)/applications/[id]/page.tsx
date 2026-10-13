import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SubmitButton from "@/components/admin/SubmitButton";
import ConfirmSubmit from "@/components/admin/ConfirmSubmit";
import { updateApplicationStatus, deleteApplication } from "@/actions/admin";
import { formatDate } from "@/lib/format";

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const app = await prisma.application.findUnique({
    where: { id },
    include: { job: true },
  });
  if (!app) notFound();

  const fields = [
    { label: "Email", value: app.email },
    { label: "Phone", value: app.phone },
    { label: "Address", value: app.address },
    { label: "Date of Birth", value: app.dob ? formatDate(app.dob) : null },
    { label: "Gender", value: app.gender },
    { label: "Nationality", value: app.nationality },
    { label: "Passport No.", value: app.passportNo },
    { label: "Applied On", value: formatDate(app.createdAt) },
  ];

  const statuses = ["NEW", "REVIEWING", "SHORTLISTED", "REJECTED", "SELECTED"];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <Link href="/admin/applications" className="small text-muted-sw">
            <i className="bi bi-arrow-left me-1" />
            Back to applications
          </Link>
          <h1 className="h3 mb-0 mt-1">{app.fullName}</h1>
        </div>
        <form action={deleteApplication}>
          <input type="hidden" name="id" value={app.id} />
          <ConfirmSubmit className="btn btn-outline-danger btn-sm" message={`Delete application from "${app.fullName}"?`}>
            <i className="bi bi-trash me-1" />
            Delete
          </ConfirmSubmit>
        </form>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="sw-card p-3 p-lg-4 mb-4">
            <h5 className="mb-3">
              <i className="bi bi-person-vcard me-2 text-accent" />
              Applicant Details
            </h5>
            <div className="row g-3">
              {fields.map((f) => (
                <div className="col-sm-6" key={f.label}>
                  <div className="p-3 rounded-sw bg-soft h-100">
                    <div className="small text-muted-sw">{f.label}</div>
                    <div className="fw-semibold">{f.value || "—"}</div>
                  </div>
                </div>
              ))}
            </div>

            {app.experience && (
              <div className="mt-4">
                <h6 className="text-muted-sw">Work Experience</h6>
                <p className="pre-line mb-0">{app.experience}</p>
              </div>
            )}
            {app.coverLetter && (
              <div className="mt-4">
                <h6 className="text-muted-sw">Cover Letter</h6>
                <p className="pre-line mb-0">{app.coverLetter}</p>
              </div>
            )}
          </div>

          {app.resumeUrl && (
            <div className="sw-card p-3 p-lg-4">
              <h5 className="mb-3">
                <i className="bi bi-file-earmark-text me-2 text-accent" />
                Resume / CV
              </h5>
              <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="btn btn-primary-sw">
                <i className="bi bi-download me-1" />
                Open / Download CV
              </a>
            </div>
          )}
        </div>

        <div className="col-lg-4">
          <div className="sw-card p-3 p-lg-4">
            <h5 className="mb-3">Application Status</h5>
            <p className="small text-muted-sw">
              Position:{" "}
              <strong>{app.job?.titleEn || "General Application"}</strong>
            </p>
            <form action={updateApplicationStatus} className="d-grid gap-3">
              <input type="hidden" name="id" value={app.id} />
              <div>
                <label className="form-label">Status</label>
                <select name="status" className="form-select" defaultValue={app.status}>
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <SubmitButton className="btn btn-primary-sw">
                <i className="bi bi-check2 me-1" />
                Update Status
              </SubmitButton>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
