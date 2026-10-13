import { prisma } from "@/lib/prisma";
import ConfirmSubmit from "@/components/admin/ConfirmSubmit";
import SubmitButton from "@/components/admin/SubmitButton";
import { toggleInquiryRead, deleteInquiry } from "@/actions/admin";
import { formatDate } from "@/lib/format";

export default async function AdminInquiriesPage() {
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  const unread = inquiries.filter((i) => !i.isRead).length;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Inquiries</h1>
          <p className="text-muted-sw mb-0">
            {inquiries.length} total · {unread} unread
          </p>
        </div>
      </div>

      {inquiries.length === 0 ? (
        <div className="sw-card p-5 text-center">
          <i className="bi bi-inbox fs-1 text-muted-sw" />
          <h4 className="mt-3">No inquiries yet</h4>
          <p className="text-muted-sw mb-0">
            Messages submitted through the contact form will appear here.
          </p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {inquiries.map((q) => (
            <div
              className={`sw-card p-3 p-lg-4 ${q.isRead ? "" : "border-start border-4 border-warning"}`}
              key={q.id}
            >
              <div className="d-flex justify-content-between align-items-start gap-3">
                <div className="min-w-0">
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <span className="fw-bold">{q.name}</span>
                    <span
                      className={`badge ${q.type === "HIRE" ? "text-bg-primary" : "text-bg-secondary"}`}
                    >
                      {q.type === "HIRE" ? "Employer" : "Job Seeker"}
                    </span>
                    {!q.isRead && <span className="badge bg-danger">Unread</span>}
                  </div>
                  <div className="small text-muted-sw mt-1">
                    <i className="bi bi-envelope me-1" />
                    {q.email}
                    {q.phone && (
                      <>
                        <span className="mx-2">·</span>
                        <i className="bi bi-telephone me-1" />
                        {q.phone}
                      </>
                    )}
                    <span className="mx-2">·</span>
                    {formatDate(q.createdAt)}
                  </div>
                  {q.subject && <div className="fw-semibold mt-2">{q.subject}</div>}
                  <p className="pre-line mb-0 mt-2 text-muted-sw">{q.message}</p>
                </div>
                <div className="d-flex flex-column gap-1 flex-shrink-0">
                  <form action={toggleInquiryRead}>
                    <input type="hidden" name="id" value={q.id} />
                    <input type="hidden" name="isRead" value={String(q.isRead)} />
                    <SubmitButton
                      className={`btn btn-sm ${q.isRead ? "btn-outline-secondary" : "btn-primary-sw"}`}
                      pendingText="..."
                    >
                      <i className={`bi ${q.isRead ? "bi-envelope" : "bi-envelope-open"} me-1`} />
                      {q.isRead ? "Mark unread" : "Mark read"}
                    </SubmitButton>
                  </form>
                  <form action={deleteInquiry}>
                    <input type="hidden" name="id" value={q.id} />
                    <ConfirmSubmit
                      className="btn btn-sm btn-outline-danger w-100"
                      message={`Delete inquiry from "${q.name}"?`}
                    >
                      <i className="bi bi-trash me-1" />
                      Delete
                    </ConfirmSubmit>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
