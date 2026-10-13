import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import ChangePasswordForm from "@/components/admin/ChangePasswordForm";

export const dynamic = "force-dynamic";

export default async function AdminAccountPage() {
  const session = await getSession();
  const admin = session
    ? await prisma.admin.findUnique({
        where: { id: session.adminId },
        select: { name: true, email: true, role: true, createdAt: true },
      })
    : null;

  return (
    <div>
      <h1 className="h3 mb-4">My Account</h1>
      <div className="row g-4">
        <div className="col-lg-5">
          <div className="sw-card p-3 p-lg-4 h-100">
            <h5 className="mb-3">
              <i className="bi bi-person-badge me-2 text-accent" />
              Profile
            </h5>
            <div className="d-flex align-items-center gap-3 mb-4">
              <span
                className="d-grid rounded-circle bg-primary-sw text-white fw-bold fs-4"
                style={{ width: 64, height: 64, placeItems: "center" }}
              >
                {(admin?.name || session?.name || "A").charAt(0)}
              </span>
              <div>
                <div className="fw-bold">{admin?.name || session?.name}</div>
                <div className="text-muted-sw small">
                  {admin?.email || session?.email}
                </div>
              </div>
            </div>
            <ul className="list-unstyled mb-0 d-flex flex-column gap-3">
              <li className="d-flex justify-content-between border-bottom pb-2">
                <span className="text-muted-sw">Role</span>
                <span className="fw-semibold text-capitalize">
                  {admin?.role || session?.role || "admin"}
                </span>
              </li>
              <li className="d-flex justify-content-between">
                <span className="text-muted-sw">Member since</span>
                <span className="fw-semibold">
                  {admin?.createdAt ? formatDate(admin.createdAt) : "—"}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="sw-card p-3 p-lg-4 h-100">
            <h5 className="mb-3">
              <i className="bi bi-key me-2 text-accent" />
              Change Password
            </h5>
            <ChangePasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
}
