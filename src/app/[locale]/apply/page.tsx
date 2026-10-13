import { getTranslations } from "next-intl/server";
import PageHeader from "@/components/public/PageHeader";
import ApplyForm from "@/components/public/ApplyForm";

export default async function ApplyPage() {
  const t = await getTranslations("apply");
  return (
    <>
      <PageHeader
        title={t("generalApplication")}
        subtitle={t("generalDesc")}
        crumb={t("generalApplication")}
      />
      <section className="section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-9">
              <ApplyForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
