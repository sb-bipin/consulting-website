import { getTranslations } from "next-intl/server";
import { getSettings } from "@/lib/site";
import PageHeader from "@/components/public/PageHeader";
import ContactForm from "@/components/public/ContactForm";

export default async function ContactPage() {
  const t = await getTranslations("contact");
  const settings = await getSettings();

  const phone = settings.phone || "";
  const phoneAlt = settings.phone_alt || "";
  const email = settings.email || "";
  const address = settings.address || "";
  const whatsapp = settings.whatsapp || "";

  const items = [
    { icon: "bi-geo-alt-fill", label: t("address"), value: address },
    { icon: "bi-telephone-fill", label: t("phone"), value: [phone, phoneAlt].filter(Boolean).join(" / ") },
    { icon: "bi-envelope-fill", label: t("email"), value: email },
    { icon: "bi-clock-fill", label: t("officeHours"), value: settings.office_hours || "" },
  ];

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} crumb={t("title")} />
      <section className="section">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-5">
              <div className="sw-card p-4 p-lg-5 h-100">
                <h3 className="h4 mb-4">{t("getInTouch")}</h3>
                <ul className="detail-list">
                  {items.map((it) => (
                    <li key={it.label}>
                      <i className={`bi ${it.icon} fs-5`} />
                      <div>
                        <div className="small text-muted-sw">{it.label}</div>
                        <div className="fw-semibold">{it.value || "—"}</div>
                      </div>
                    </li>
                  ))}
                </ul>

                {whatsapp && (
                  <a
                    href={`https://wa.me/${whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-success w-100 mt-3"
                  >
                    <i className="bi bi-whatsapp me-2" />
                    WhatsApp
                  </a>
                )}

                {address && (
                  <div className="mt-4 rounded-sw overflow-hidden border">
                    <iframe
                      title="map"
                      width="100%"
                      height="220"
                      style={{ border: 0 }}
                      loading="lazy"
                      src={`https://www.google.com/maps?q=${encodeURIComponent(
                        address
                      )}&output=embed`}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="col-lg-7">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
