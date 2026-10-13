import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function PageHeader({
  title,
  subtitle,
  crumb,
}: {
  title: string;
  subtitle?: string;
  crumb?: string;
}) {
  const t = await getTranslations("nav");
  return (
    <section className="page-header">
      <div className="container">
        <h1 className="fw-bold mb-2">{title}</h1>
        {subtitle && (
          <p className="mb-3" style={{ color: "rgba(255,255,255,.85)" }}>
            {subtitle}
          </p>
        )}
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link href="/">
                <i className="bi bi-house-door me-1" />
                {t("home")}
              </Link>
            </li>
            <li className="breadcrumb-item active">{crumb || title}</li>
          </ol>
        </nav>
      </div>
    </section>
  );
}
