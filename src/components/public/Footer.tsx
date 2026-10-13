import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type Props = {
  settings: Record<string, string>;
};

export default async function Footer({ settings }: Props) {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");

  const company = settings.company_name || "Swostik Overseas Pvt. Ltd.";
  const phone = settings.phone || "+977-1-4000000";
  const phoneAlt = settings.phone_alt || "";
  const email = settings.email || "info@swostikoverseas.com";
  const address = settings.address || "Kathmandu, Nepal";
  const whatsapp = settings.whatsapp || "";

  const socials = [
    { key: "facebook", icon: "bi-facebook" },
    { key: "instagram", icon: "bi-instagram" },
    { key: "linkedin", icon: "bi-linkedin" },
    { key: "youtube", icon: "bi-youtube" },
  ].filter((s) => settings[s.key]);

  const year = new Date().getFullYear();

  return (
    <footer className="sw-footer">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <div className="brand-logo mb-3 text-white">
              <span className="brand-mark">
                <i className="bi bi-airplane-engines-fill" />
              </span>
              <span className="text-white">
                Swostik <span className="text-accent">Overseas</span>
              </span>
            </div>
            <p className="small">{t("aboutText")}</p>
            <p className="small mb-2">
              <i className="bi bi-patch-check-fill text-accent me-1" />
              {settings.license_no}
            </p>
            {socials.length > 0 && (
              <>
                <h6 className="mt-3">{t("followUs")}</h6>
                <div className="d-flex gap-2">
                  {socials.map((s) => (
                    <a
                      key={s.key}
                      href={settings[s.key]}
                      target="_blank"
                      rel="noreferrer"
                      className="social-link"
                      aria-label={s.key}
                    >
                      <i className={`bi ${s.icon}`} />
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="col-lg-2 col-md-6 col-6">
            <h6>{t("quickLinks")}</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li>
                <Link href="/">{nav("home")}</Link>
              </li>
              <li>
                <Link href="/jobs">{nav("jobs")}</Link>
              </li>
              <li>
                <Link href="/countries">{nav("countries")}</Link>
              </li>
              <li>
                <Link href="/services">{nav("services")}</Link>
              </li>
              <li>
                <Link href="/notices">{nav("notices")}</Link>
              </li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6 col-6">
            <h6>{t("forCandidates")}</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li>
                <Link href="/jobs">{t("browseJobs")}</Link>
              </li>
              <li>
                <Link href="/apply">{t("submitCv")}</Link>
              </li>
              <li>
                <Link href="/about">{t("preDeparture")}</Link>
              </li>
              <li>
                <Link href="/about">{nav("about")}</Link>
              </li>
              <li>
                <Link href="/contact">{nav("contact")}</Link>
              </li>
            </ul>
          </div>

          <div className="col-lg-4 col-md-6">
            <h6>{t("contact")}</h6>
            <ul className="list-unstyled d-flex flex-column gap-3 small">
              <li className="d-flex gap-2">
                <i className="bi bi-geo-alt-fill text-accent mt-1" />
                <span>{address}</span>
              </li>
              <li className="d-flex gap-2">
                <i className="bi bi-telephone-fill text-accent mt-1" />
                <span>
                  <a href={`tel:${phone}`}>{phone}</a>
                  {phoneAlt && (
                    <>
                      <br />
                      <a href={`tel:${phoneAlt}`}>{phoneAlt}</a>
                    </>
                  )}
                </span>
              </li>
              <li className="d-flex gap-2">
                <i className="bi bi-envelope-fill text-accent mt-1" />
                <a href={`mailto:${email}`}>{email}</a>
              </li>
              {whatsapp && (
                <li className="d-flex gap-2">
                  <i className="bi bi-whatsapp text-accent mt-1" />
                  <a
                    href={`https://wa.me/${whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t("forCandidates") === "" ? "WhatsApp" : "WhatsApp"}
                  </a>
                </li>
              )}
              <li className="d-flex gap-2">
                <i className="bi bi-clock-fill text-accent mt-1" />
                <span>{settings.office_hours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom d-flex flex-wrap justify-content-between gap-2">
          <span>
            © {year} {company}. {t("rights")}
          </span>
          <span className="opacity-75">{t("license")}</span>
        </div>
      </div>
    </footer>
  );
}
