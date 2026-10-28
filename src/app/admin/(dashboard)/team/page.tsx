import Link from "next/link";
import { prisma } from "@/lib/prisma";
import SubmitButton from "@/components/admin/SubmitButton";
import ConfirmSubmit from "@/components/admin/ConfirmSubmit";
import { saveTeamMember, deleteTeamMember } from "@/actions/admin";
import TeamMemberForm from "@/components/admin/TeamMemberForm";

export default async function AdminTeamPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const editId = typeof sp.edit === "string" ? sp.edit : "";

  const [items, edit] = await Promise.all([
    prisma.teamMember.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] }),
    editId ? prisma.teamMember.findUnique({ where: { id: editId } }) : null,
  ]);

  return (
    <div>
      <h1 className="h3 mb-4">Team Members</h1>
      <div className="row g-4">
        <div className="col-lg-4">
          <div className="sw-card p-3 p-lg-4 sw-side-panel">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">{edit ? "Edit Team Member" : "Add Team Member"}</h5>
              {edit && (
                <Link href="/admin/team" className="small">
                  Cancel
                </Link>
              )}
            </div>
            <TeamMemberForm edit={edit} />
          </div>
        </div>

        <div className="col-lg-8">
          <div className="row g-3">
            {items.length === 0 && (
              <div className="col-12">
                <div className="sw-card p-4 text-center text-muted-sw">
                  No team members added yet.
                </div>
              </div>
            )}
            {items.map((m) => (
              <div className="col-md-6 col-xl-4" key={m.id}>
                <div className="sw-card h-100 overflow-hidden d-flex flex-column">
                  <div className="ratio ratio-1x1 bg-light">
                    {m.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.imageUrl} alt={m.name} style={{ objectFit: "cover" }} />
                    ) : (
                      <div className="d-flex align-items-center justify-content-center h-100 text-muted-sw">
                        <i className="bi bi-person-fill fs-1" />
                      </div>
                    )}
                  </div>
                  <div className="p-3 d-flex flex-column flex-grow-1">
                    <div className="fw-semibold">{m.name}</div>
                    <div className="text-accent-dark small">{m.designation}</div>
                    <div className="mt-2 small text-muted-sw d-flex flex-column gap-1">
                      <div>
                        <i className="bi bi-telephone me-2" />
                        <a href={`tel:${m.contact.replace(/\s+/g, "")}`} className="text-reset text-decoration-none">
                          {m.contact}
                        </a>
                      </div>
                      {m.email ? (
                        <div className="text-truncate">
                          <i className="bi bi-envelope me-2" />
                          <a href={`mailto:${m.email}`} className="text-reset text-decoration-none">
                            {m.email}
                          </a>
                        </div>
                      ) : null}
                    </div>
                    <div className="mt-auto pt-3 d-flex justify-content-between align-items-center">
                      <span className={`badge ${m.isActive ? "bg-success-subtle text-success" : "bg-secondary-subtle text-secondary"}`}>
                        {m.isActive ? "Active" : "Inactive"}
                      </span>
                      <div className="d-flex gap-1">
                        <Link href={`/admin/team?edit=${m.id}`} className="btn btn-sm btn-outline-primary-sw">
                          <i className="bi bi-pencil" />
                        </Link>
                        <form action={deleteTeamMember}>
                          <input type="hidden" name="id" value={m.id} />
                          <ConfirmSubmit message={`Delete team member "${m.name}"?`}>
                            <i className="bi bi-trash" />
                          </ConfirmSubmit>
                        </form>
                      </div>
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
