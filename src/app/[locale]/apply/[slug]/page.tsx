import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/public/PageHeader";
import ApplyForm from "@/components/public/ApplyForm";

export default async function ApplyJobPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = await getTranslations("apply");

  const job = await prisma.job.findUnique({
    where: { slug },
    include: { country: true },
  });
  if (!job || job.status !== "ACTIVE") notFound();

  const title = locale === "ne" ? job.titleNe : job.titleEn;

  return (
    <>
      <PageHeader
        title={`${t("title")} ${title}`}
        subtitle={t("subtitle")}
        crumb={title}
      />
      <section className="section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-9">
              <ApplyForm jobSlug={job.slug} jobTitle={title} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
