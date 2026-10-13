import Link from "next/link";
import { prisma } from "@/lib/prisma";
import SubmitButton from "@/components/admin/SubmitButton";
import ConfirmSubmit from "@/components/admin/ConfirmSubmit";
import { saveTestimonial, deleteTestimonial } from "@/actions/admin";

export default async function AdminTestimonialsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const editId = typeof sp.edit === "string" ? sp.edit : "";

  const [items, edit] = await Promise.all([
    prisma.testimonial.findMany({ orderBy: { order: "asc" } }),
    editId ? prisma.testimonial.findUnique({ where: { id: editId } }) : null,
  ]);

  return (
    <div>
      <h1 className="h3 mb-4">Testimonials</h1>
      <div className="row g-4">
        <div className="col-lg-4">
          <div className="sw-card p-3 p-lg-4 sticky-lg-top" style={{ top: "100px" }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">{edit ? "Edit Testimonial" : "Add Testimonial"}</h5>
              {edit && (
                <Link href="/admin/testimonials" className="small">
                  Cancel
                </Link>
              )}
            </div>
            <form action={saveTestimonial} className="row g-3">
              {edit && <input type="hidden" name="id" value={edit.id} />}
              <div className="col-12">
                <label className="form-label">Name *</label>
                <input name="name" className="form-control" defaultValue={edit?.name} required />
              </div>
              <div className="col-12">
                <label className="form-label">Position / Country</label>
                <input name="position" className="form-control" defaultValue={edit?.position ?? ""} />
              </div>
              <div className="col-12">
                <label className="form-label">Message *</label>
                <textarea name="message" className="form-control" rows={4} defaultValue={edit?.message} required />
              </div>
              <div className="col-6">
                <label className="form-label">Rating (1-5)</label>
                <input name="rating" type="number" min={1} max={5} className="form-control" defaultValue={edit?.rating ?? 5} />
              </div>
              <div className="col-6">
                <label className="form-label">Order</label>
                <input name="order" type="number" className="form-control" defaultValue={edit?.order ?? 0} />
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
            {items.map((t) => (
              <div className="col-md-6" key={t.id}>
                <div className="sw-card p-3 h-100 d-flex flex-column">
                  <div className="text-accent mb-2">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <i className="bi bi-star-fill me-1" key={i} />
                    ))}
                  </div>
                  <p className="small text-muted-sw line-clamp-3">“{t.message}”</p>
                  <div className="mt-auto d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-semibold small">{t.name}</div>
                      <small className="text-muted-sw">{t.position}</small>
                    </div>
                    <div className="d-flex gap-1">
                      <Link href={`/admin/testimonials?edit=${t.id}`} className="btn btn-sm btn-outline-primary-sw">
                        <i className="bi bi-pencil" />
                      </Link>
                      <form action={deleteTestimonial}>
                        <input type="hidden" name="id" value={t.id} />
                        <ConfirmSubmit message={`Delete testimonial from "${t.name}"?`}>
                          <i className="bi bi-trash" />
                        </ConfirmSubmit>
                      </form>
                    </div>
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
