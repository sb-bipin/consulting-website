import Link from "next/link";
import { prisma } from "@/lib/prisma";
import SubmitButton from "@/components/admin/SubmitButton";
import ConfirmSubmit from "@/components/admin/ConfirmSubmit";
import { saveFaq, deleteFaq } from "@/actions/admin";

export default async function AdminFaqsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const editId = typeof sp.edit === "string" ? sp.edit : "";

  const [items, edit] = await Promise.all([
    prisma.faq.findMany({ orderBy: { order: "asc" } }),
    editId ? prisma.faq.findUnique({ where: { id: editId } }) : null,
  ]);

  return (
    <div>
      <h1 className="h3 mb-4">Frequently Asked Questions</h1>
      <div className="row g-4">
        <div className="col-lg-5">
          <div className="sw-card p-3 p-lg-4 sw-side-panel">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">{edit ? "Edit FAQ" : "Add FAQ"}</h5>
              {edit && (
                <Link href="/admin/faqs" className="small">
                  Cancel
                </Link>
              )}
            </div>
            <form action={saveFaq} className="row g-3">
              {edit && <input type="hidden" name="id" value={edit.id} />}
              <div className="col-12">
                <label className="form-label">Question (English) *</label>
                <input name="questionEn" className="form-control" defaultValue={edit?.questionEn} required />
              </div>
              <div className="col-12">
                <label className="form-label">Question (Nepali)</label>
                <input name="questionNe" className="form-control" defaultValue={edit?.questionNe} />
              </div>
              <div className="col-12">
                <label className="form-label">Answer (English) *</label>
                <textarea name="answerEn" className="form-control" rows={3} defaultValue={edit?.answerEn} required />
              </div>
              <div className="col-12">
                <label className="form-label">Answer (Nepali)</label>
                <textarea name="answerNe" className="form-control" rows={3} defaultValue={edit?.answerNe} />
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

        <div className="col-lg-7">
          <div className="accordion" id="adminFaq">
            {items.map((f) => (
              <div className="sw-card p-3 mb-3" key={f.id}>
                <div className="d-flex justify-content-between gap-2">
                  <div className="fw-semibold">
                    <i className="bi bi-patch-question-fill text-accent me-2" />
                    {f.questionEn}
                  </div>
                  <div className="d-flex gap-1 flex-shrink-0">
                    {f.isActive ? (
                      <span className="badge text-bg-success align-self-center">Active</span>
                    ) : (
                      <span className="badge text-bg-secondary align-self-center">Off</span>
                    )}
                    <Link href={`/admin/faqs?edit=${f.id}`} className="btn btn-sm btn-outline-primary-sw">
                      <i className="bi bi-pencil" />
                    </Link>
                    <form action={deleteFaq}>
                      <input type="hidden" name="id" value={f.id} />
                      <ConfirmSubmit message="Delete this FAQ?">
                        <i className="bi bi-trash" />
                      </ConfirmSubmit>
                    </form>
                  </div>
                </div>
                <p className="small text-muted-sw mb-0 mt-2">{f.answerEn}</p>
                <div className="small text-muted-sw mt-2">नेपाली: {f.answerNe}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
