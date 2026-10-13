import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import LoginForm from "@/components/admin/LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/admin");

  return (
    <div className="admin-login p-3">
      <div className="sw-card p-4 p-lg-5" style={{ maxWidth: 440, width: "100%" }}>
        <div className="text-center mb-4">
          <span
            className="d-inline-grid mb-3"
            style={{
              width: 64,
              height: 64,
              placeItems: "center",
              borderRadius: 18,
              background: "var(--sw-gradient)",
              color: "#fff",
              fontSize: "1.8rem",
            }}
          >
            <i className="bi bi-airplane-engines-fill" />
          </span>
          <h1 className="h3 mb-1">Admin Panel</h1>
          <p className="text-muted-sw mb-0">
            Sign in to manage Swostik Overseas
          </p>
        </div>

        <LoginForm />

        <div className="text-center mt-4">
          <Link href="/" className="small text-muted-sw">
            <i className="bi bi-arrow-left me-1" />
            Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}
