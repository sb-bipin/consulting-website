import Link from "next/link";
import { prisma } from "@/lib/prisma";
import SubmitButton from "@/components/admin/SubmitButton";
import ConfirmSubmit from "@/components/admin/ConfirmSubmit";
import { saveNotice, deleteNotice } from "@/actions/admin";
import { formatDate } from "@/lib/format";

const toDate = (d: Date | null | undefined) =>
  d ? new Date(d).toISOString().slice(0, 10) : "";

export default async function AdminNoticesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const editId = typeof sp.edit === "string" ? sp.edit : "";

  const [items, edit] = await Promise.all([
    prisma.notice.findMany({ orderBy: { publishedAt: "desc" } }),
    editId ? prisma.notice.findUnique({ where: { id: editId } }) : null,
  ]);

  return (
    <div>
      <h1 className="h3 mb-4">Notices & Announcements</h1>
      <div className="row g-4">
        <div className="col-lg-5">
          <div className="sw-card p-3 p-lg-4 sticky-lg-top" style={{ top: "100px" }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">{edit ? "Edit Notice" : "Add Notice"}</h5>
              {edit && (
                <Link href="/admin/notices" className="small">
                  Cancel
                </Link>
              )}
            </div>
            <form action={saveNotice} className="row g-3">
              {edit && <input type="hidden" name="id" value={edit.id} />}
              <div className="col-12">
                <label className="form-label">Title (English) *</label>
                <input name="titleEn" className="form-control" defaultValue={edit?.titleEn} required />
              </div>
              <div className="col-12">
                <label className="form-label">Title (Nepali)</label>
                <input name="titleNe" className="form-control" defaultValue={edit?.titleNe} />
              </div>
              <div className="col-12">
                <label className="form-label">Body (English) *</label>
                <textarea name="bodyEn" className="form-control" rows={4} defaultValue={edit?.bodyEn} required />
              </div>
              <div className="col-12">
                <label className="form-label">Body (Nepali)</label>
                <textarea name="bodyNe" className="form-control" rows={4} defaultValue={edit?.bodyNe} />
              </div>
              <div className="col-8">
                <label className="form-label">Published Date</label>
                <input name="publishedAt" type="date" className="form-control" defaultValue={toDate(edit?.publishedAt ?? new Date())} />
              </div>
              <div className="col-4 d-flex align-items-end">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" name="isActive" defaultChecked={edit ? edit.isActive : true} />
                  <label className="form-check-label">Active</label>
                </div>
              </div>
              <div className="col-12">
                <SubmitButton>
                  <i className="bi bi-save me-1" />
                  {edit ? "Update" : "Create"}
                </SubmitButton>
              </div>
            </form>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="d-flex flex-column gap-3">
            {items.map((n) => (
              <div className="sw-card p-3" key={n.id}>
                <div className="d-flex justify-content-between gap-2">
                  <div>
                    <div className="fw-semibold">{n.titleEn}</div>
                    <small className="text-muted-sw">
                      <i className="bi bi-calendar3 me-1" />
                      {formatDate(n.publishedAt)}
                    </small>
                  </div>
                  <div className="d-flex gap-1 flex-shrink-0">
                    {n.isActive ? (
                      <span className="badge text-bg-success align-self-center">Active</span>
                    ) : (
                      <span className="badge text-bg-secondary align-self-center">Off</span>
                    )}
                    <Link href={`/admin/notices?edit=${n.id}`} className="btn btn-sm btn-outline-primary-sw">
                      <i className="bi bi-pencil" />
                    </Link>
                    <form action={deleteNotice}>
                      <input type="hidden" name="id" value={n.id} />
                      <ConfirmSubmit message="Delete this notice?">
                        <i className="bi bi-trash" />
                      </ConfirmSubmit>
                    </form>
                  </div>
                </div>
                <p className="small text-muted-sw mb-0 mt-2 pre-line">{n.bodyEn}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
