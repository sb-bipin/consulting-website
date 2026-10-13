import { getSettings } from "@/lib/site";
import SubmitButton from "@/components/admin/SubmitButton";
import ConfirmSubmit from "@/components/admin/ConfirmSubmit";
import { saveSettings, cleanupResumes } from "@/actions/admin";

export const dynamic = "force-dynamic";

type Field = {
  key: string;
  label: string;
  type?: "text" | "textarea";
  placeholder?: string;
};

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const cleaned = typeof sp.cleaned === "string" ? sp.cleaned : null;
  const settings = await getSettings();

  const groups: { title: string; icon: string; fields: Field[] }[] = [
    {
      title: "Company Info",
      icon: "bi-building",
      fields: [
        { key: "company_name", label: "Company Name" },
        { key: "tagline", label: "Tagline" },
        { key: "license_no", label: "License Number" },
      ],
    },
    {
      title: "Contact Details",
      icon: "bi-telephone",
      fields: [
        { key: "phone", label: "Primary Phone" },
        { key: "phone_alt", label: "Secondary Phone" },
        { key: "whatsapp", label: "WhatsApp (with country code, no +)" , placeholder: "9779800000000" },
        { key: "email", label: "Email Address" },
        { key: "address", label: "Office Address" },
        { key: "office_hours", label: "Office Hours" },
      ],
    },
    {
      title: "Social Links",
      icon: "bi-share",
      fields: [
        { key: "facebook", label: "Facebook URL" },
        { key: "instagram", label: "Instagram URL" },
        { key: "linkedin", label: "LinkedIn URL" },
        { key: "youtube", label: "YouTube URL" },
      ],
    },
    {
      title: "Homepage Stats",
      icon: "bi-bar-chart",
      fields: [
        { key: "stat_placements", label: "Successful Placements" },
        { key: "stat_countries", label: "Countries Served" },
        { key: "stat_clients", label: "Global Employers" },
        { key: "stat_years", label: "Years of Trust" },
      ],
    },
    {
      title: "Branding",
      icon: "bi-image",
      fields: [
        {
          key: "about_image_url",
          label: "About Page Image URL",
          placeholder: "/swostik-img.jpg",
        },
      ],
    },
  ];

  const heroFields: Field[] = [
    { key: "hero_title_en", label: "Hero Title (English)", type: "text" },
    { key: "hero_title_ne", label: "Hero Title (Nepali)", type: "text" },
    { key: "hero_subtitle_en", label: "Hero Subtitle (English)", type: "textarea" },
    { key: "hero_subtitle_ne", label: "Hero Subtitle (Nepali)", type: "textarea" },
  ];

  return (
    <div>
      <h1 className="h3 mb-4">Site Settings</h1>

      {cleaned !== null && (
        <div className="alert alert-success d-flex align-items-center">
          <i className="bi bi-check-circle-fill me-2" />
          Cleanup complete — removed {cleaned} unused resume file
          {cleaned === "1" ? "" : "s"}.
        </div>
      )}

      <form action={saveSettings}>
        <div className="row g-4">
          {groups.map((g) => (
            <div className="col-lg-6" key={g.title}>
              <div className="sw-card p-3 p-lg-4 h-100">
                <h5 className="mb-3">
                  <i className={`bi ${g.icon} me-2 text-accent`} />
                  {g.title}
                </h5>
                <div className="row g-3">
                  {g.fields.map((f) => (
                    <div className="col-12" key={f.key}>
                      <label className="form-label">{f.label}</label>
                      <input
                        name={`setting__${f.key}`}
                        className="form-control"
                        placeholder={f.placeholder}
                        defaultValue={settings[f.key] ?? ""}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <div className="col-12">
            <div className="sw-card p-3 p-lg-4">
              <h5 className="mb-3">
                <i className="bi bi-window-stack me-2 text-accent" />
                Homepage Hero
              </h5>
              <div className="row g-3">
                {heroFields.map((f) => (
                  <div className={f.type === "textarea" ? "col-12" : "col-md-6"} key={f.key}>
                    <label className="form-label">{f.label}</label>
                    {f.type === "textarea" ? (
                      <textarea
                        name={`setting__${f.key}`}
                        className="form-control"
                        rows={2}
                        defaultValue={settings[f.key] ?? ""}
                      />
                    ) : (
                      <input
                        name={`setting__${f.key}`}
                        className="form-control"
                        defaultValue={settings[f.key] ?? ""}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 sticky-bottom bg-soft py-3">
          <SubmitButton className="btn btn-accent btn-lg">
            <i className="bi bi-save me-2" />
            Save All Settings
          </SubmitButton>
        </div>
      </form>

      <div className="sw-card p-3 p-lg-4 mt-4 border-danger-subtle">
        <h5 className="mb-2">
          <i className="bi bi-tools me-2 text-danger" />
          Maintenance
        </h5>
        <p className="text-muted-sw small mb-3">
          Remove resume/CV files from local storage that are no longer attached
          to any application. This only deletes files that are not referenced by
          a record.
        </p>
        <form action={cleanupResumes}>
          <ConfirmSubmit
            className="btn btn-outline-danger"
            message="Delete all resume files that are not linked to an application?"
          >
            <i className="bi bi-trash3 me-1" />
            Clean up orphaned resumes
          </ConfirmSubmit>
        </form>
      </div>
    </div>
  );
}
