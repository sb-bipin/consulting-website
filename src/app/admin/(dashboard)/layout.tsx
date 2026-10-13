import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { logout } from "@/actions/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <div className="d-none d-lg-block sticky-top" style={{ height: "100vh" }}>
        <AdminSidebar />
      </div>

      {/* Mobile offcanvas */}
      <div
        className="offcanvas offcanvas-start p-0 text-bg-dark"
        id="adminNav"
        tabIndex={-1}
        style={{ width: 270 }}
      >
        <div className="offcanvas-body p-0">
          <AdminSidebar />
        </div>
      </div>

      <div className="flex-grow-1 bg-soft d-flex flex-column min-w-0">
        <header className="bg-white border-bottom px-3 px-lg-4 py-3 d-flex justify-content-between align-items-center sticky-top">
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-outline-primary-sw d-lg-none"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#adminNav"
              aria-label="Menu"
            >
              <i className="bi bi-list" />
            </button>
            <div>
              <div className="fw-bold">Control Panel</div>
              <small className="text-muted-sw d-none d-sm-block">
                Manage jobs, applications and site content
              </small>
            </div>
          </div>

          <div className="d-flex align-items-center gap-3">
            <Link
              href="/admin/account"
              className="d-flex align-items-center gap-3 text-decoration-none text-reset"
              title="My Account"
            >
              <div className="text-end d-none d-sm-block">
                <div className="fw-semibold small">{session.name}</div>
                <div className="text-muted-sw" style={{ fontSize: ".75rem" }}>
                  {session.email}
                </div>
              </div>
              <span
                className="d-grid rounded-circle bg-primary-sw text-white fw-bold"
                style={{ width: 42, height: 42, placeItems: "center" }}
              >
                {session.name.charAt(0)}
              </span>
            </Link>
            <form action={logout}>
              <button type="submit" className="btn btn-sm btn-outline-danger">
                <i className="bi bi-box-arrow-right" />
                <span className="d-none d-md-inline ms-1">Logout</span>
              </button>
            </form>
          </div>
        </header>

        <div className="p-3 p-lg-4">{children}</div>
      </div>
    </div>
  );
}
