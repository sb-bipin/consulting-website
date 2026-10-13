import Link from "next/link";
import { prisma } from "@/lib/prisma";
import SubmitButton from "@/components/admin/SubmitButton";
import ConfirmSubmit from "@/components/admin/ConfirmSubmit";
import { saveService, deleteService } from "@/actions/admin";

export default async function AdminServicesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const editId = typeof sp.edit === "string" ? sp.edit : "";

  const [items, edit] = await Promise.all([
    prisma.service.findMany({ orderBy: { order: "asc" } }),
    editId ? prisma.service.findUnique({ where: { id: editId } }) : null,
  ]);

  return (
    <div>
      <h1 className="h3 mb-4">Services</h1>
      <div className="row g-4">
        <div className="col-lg-4">
          <div className="sw-card p-3 p-lg-4 sticky-lg-top" style={{ top: "100px" }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">{edit ? "Edit Service" : "Add Service"}</h5>
              {edit && (
                <Link href="/admin/services" className="small">
                  Cancel
                </Link>
              )}
            </div>
            <form action={saveService} className="row g-3">
              {edit && <input type="hidden" name="id" value={edit.id} />}
              <div className="col-12">
                <label className="form-label">Title (English) *</label>
                <input name="titleEn" className="form-control" defaultValue={edit?.titleEn} required />
              </div>
              <div className="col-12">
                <label className="form-label">Title (Nepali)</label>
                <input name="titleNe" className="form-control" defaultValue={edit?.titleNe} />
              </div>
              <div className="col-8">
                <label className="form-label">Icon (bi)</label>
                <input name="icon" className="form-control" defaultValue={edit?.icon ?? ""} placeholder="bi-globe2" />
              </div>
              <div className="col-4">
                <label className="form-label">Order</label>
                <input name="order" type="number" className="form-control" defaultValue={edit?.order ?? 0} />
              </div>
              <div className="col-12">
                <label className="form-label">Description (English) *</label>
                <textarea name="descriptionEn" className="form-control" rows={3} defaultValue={edit?.descriptionEn} required />
              </div>
              <div className="col-12">
                <label className="form-label">Description (Nepali)</label>
                <textarea name="descriptionNe" className="form-control" rows={3} defaultValue={edit?.descriptionNe} />
              </div>
              <div className="col-12 d-flex align-items-center justify-content-between">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" name="isActive" defaultChecked={edit ? edit.isActive : true} />
                  <label className="form-check-label">Active</label>
                </div>
                <SubmitButton>
                  <i className="bi bi-save me-1" />
                  {edit ? "Update" : "Create"}
                </SubmitButton>
              </div>
            </form>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="row g-3">
            {items.map((s) => (
              <div className="col-md-6" key={s.id}>
                <div className="sw-card p-3 h-100 d-flex flex-column">
                  <div className="d-flex align-items-center gap-3">
                    <span className="cat-icon">
                      <i className={`bi ${s.icon || "bi-check2-circle"}`} />
                    </span>
                    <div className="flex-grow-1">
                      <div className="fw-semibold">{s.titleEn}</div>
                      <small className="text-muted-sw">{s.titleNe}</small>
                    </div>
                    {s.isActive ? (
                      <span className="badge text-bg-success">Active</span>
                    ) : (
                      <span className="badge text-bg-secondary">Off</span>
                    )}
                  </div>
                  <p className="small text-muted-sw mt-2 mb-3 line-clamp-2">
                    {s.descriptionEn}
                  </p>
                  <div className="d-flex gap-1 mt-auto">
                    <Link href={`/admin/services?edit=${s.id}`} className="btn btn-sm btn-outline-primary-sw">
                      <i className="bi bi-pencil" />
                    </Link>
                    <form action={deleteService}>
                      <input type="hidden" name="id" value={s.id} />
                      <ConfirmSubmit message={`Delete service "${s.titleEn}"?`}>
                        <i className="bi bi-trash" />
                      </ConfirmSubmit>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
