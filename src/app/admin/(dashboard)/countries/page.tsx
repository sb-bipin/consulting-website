import Link from "next/link";
import { prisma } from "@/lib/prisma";
import SubmitButton from "@/components/admin/SubmitButton";
import ConfirmSubmit from "@/components/admin/ConfirmSubmit";
import { saveCountry, deleteCountry } from "@/actions/admin";

export default async function AdminCountriesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const editId = typeof sp.edit === "string" ? sp.edit : "";

  const [items, edit] = await Promise.all([
    prisma.country.findMany({
      orderBy: { order: "asc" },
      include: { _count: { select: { jobs: true } } },
    }),
    editId ? prisma.country.findUnique({ where: { id: editId } }) : null,
  ]);

  return (
    <div>
      <h1 className="h3 mb-4">Destination Countries</h1>
      <div className="row g-4">
        <div className="col-lg-4">
          <div className="sw-card p-3 p-lg-4 sw-side-panel">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">{edit ? "Edit Country" : "Add Country"}</h5>
              {edit && (
                <Link href="/admin/countries" className="small">
                  Cancel
                </Link>
              )}
            </div>
            <form action={saveCountry} className="row g-3">
              {edit && <input type="hidden" name="id" value={edit.id} />}
              <div className="col-8">
                <label className="form-label">Name (English) *</label>
                <input name="nameEn" className="form-control" defaultValue={edit?.nameEn} required />
              </div>
              <div className="col-4">
                <label className="form-label">Flag</label>
                <input name="flag" className="form-control" defaultValue={edit?.flag ?? ""} placeholder="🇳🇵" />
              </div>
              <div className="col-12">
                <label className="form-label">Name (Nepali)</label>
                <input name="nameNe" className="form-control" defaultValue={edit?.nameNe} />
              </div>
              <div className="col-12">
                <label className="form-label">Slug</label>
                <input name="slug" className="form-control" defaultValue={edit?.slug} />
              </div>
              <div className="col-12">
                <label className="form-label">Description (English)</label>
                <textarea name="descriptionEn" className="form-control" rows={2} defaultValue={edit?.descriptionEn ?? ""} />
              </div>
              <div className="col-12">
                <label className="form-label">Description (Nepali)</label>
                <textarea name="descriptionNe" className="form-control" rows={2} defaultValue={edit?.descriptionNe ?? ""} />
              </div>
              <div className="col-6">
                <label className="form-label">Order</label>
                <input name="order" type="number" className="form-control" defaultValue={edit?.order ?? 0} />
              </div>
              <div className="col-6 d-flex align-items-end">
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

        <div className="col-lg-8">
          <div className="sw-card p-3 p-lg-4">
            <div className="table-responsive">
              <table className="table admin-table align-middle">
                <thead>
                  <tr>
                    <th>Country</th>
                    <th>Slug</th>
                    <th>Jobs</th>
                    <th>Order</th>
                    <th>Active</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <span className="fs-4 me-2">{c.flag}</span>
                        <span className="fw-semibold">{c.nameEn}</span>
                        <div className="small text-muted-sw">{c.nameNe}</div>
                      </td>
                      <td className="small text-muted-sw">{c.slug}</td>
                      <td>
                        <span className="badge text-bg-light">{c._count.jobs}</span>
                      </td>
                      <td className="small">{c.order}</td>
                      <td>
                        {c.isActive ? (
                          <span className="badge text-bg-success">Yes</span>
                        ) : (
                          <span className="badge text-bg-secondary">No</span>
                        )}
                      </td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-1">
                          <Link href={`/admin/countries?edit=${c.id}`} className="btn btn-sm btn-outline-primary-sw">
                            <i className="bi bi-pencil" />
                          </Link>
                          <form action={deleteCountry}>
                            <input type="hidden" name="id" value={c.id} />
                            <ConfirmSubmit message={`Delete country "${c.nameEn}"?`}>
                              <i className="bi bi-trash" />
                            </ConfirmSubmit>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
