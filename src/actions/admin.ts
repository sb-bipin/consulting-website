"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { slugify } from "@/lib/format";
import { deleteResume, removeResumesNotIn } from "@/lib/storage";

async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

function s(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}
function num(fd: FormData, key: string): number | null {
  const v = s(fd, key);
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}
function bool(fd: FormData, key: string): boolean {
  return fd.get(key) === "on" || fd.get(key) === "true" || fd.get(key) === "1";
}
function date(fd: FormData, key: string): Date | null {
  const v = s(fd, key);
  return v ? new Date(v) : null;
}

/* ---------------- JOBS ---------------- */

export async function saveJob(formData: FormData) {
  await requireAdmin();
  const id = s(formData, "id");
  const titleEn = s(formData, "titleEn");
  const slug = s(formData, "slug") || slugify(titleEn);

  const data = {
    slug,
    titleEn,
    titleNe: s(formData, "titleNe") || titleEn,
    descriptionEn: s(formData, "descriptionEn"),
    descriptionNe: s(formData, "descriptionNe"),
    requirementsEn: s(formData, "requirementsEn") || null,
    requirementsNe: s(formData, "requirementsNe") || null,
    benefitsEn: s(formData, "benefitsEn") || null,
    benefitsNe: s(formData, "benefitsNe") || null,
    company: s(formData, "company") || null,
    countryId: s(formData, "countryId"),
    categoryId: s(formData, "categoryId"),
    salaryMin: num(formData, "salaryMin"),
    salaryMax: num(formData, "salaryMax"),
    currency: s(formData, "currency") || "NPR",
    vacancies: num(formData, "vacancies") ?? 1,
    workingHours: s(formData, "workingHours") || null,
    contractDuration: s(formData, "contractDuration") || null,
    accommodation: bool(formData, "accommodation"),
    food: bool(formData, "food"),
    overtime: bool(formData, "overtime"),
    deadline: date(formData, "deadline"),
    interviewDate: date(formData, "interviewDate"),
    imageUrl: s(formData, "imageUrl") || null,
    status: (s(formData, "status") || "ACTIVE") as "DRAFT" | "ACTIVE" | "CLOSED",
    isFeatured: bool(formData, "isFeatured"),
  };

  if (id) {
    await prisma.job.update({ where: { id }, data });
  } else {
    await prisma.job.create({ data });
  }
  revalidatePath("/admin/jobs");
  revalidatePath("/jobs");
  redirect("/admin/jobs");
}

export async function deleteJob(formData: FormData) {
  await requireAdmin();
  const id = s(formData, "id");
  if (id) await prisma.job.delete({ where: { id } });
  revalidatePath("/admin/jobs");
}

export async function toggleJobStatus(formData: FormData) {
  await requireAdmin();
  const id = s(formData, "id");
  const status = s(formData, "status") as "DRAFT" | "ACTIVE" | "CLOSED";
  if (id) await prisma.job.update({ where: { id }, data: { status } });
  revalidatePath("/admin/jobs");
}

/* ---------------- CATEGORIES ---------------- */

export async function saveCategory(formData: FormData) {
  await requireAdmin();
  const id = s(formData, "id");
  const nameEn = s(formData, "nameEn");
  const data = {
    nameEn,
    nameNe: s(formData, "nameNe") || nameEn,
    slug: s(formData, "slug") || slugify(nameEn),
    icon: s(formData, "icon") || null,
    descriptionEn: s(formData, "descriptionEn") || null,
    descriptionNe: s(formData, "descriptionNe") || null,
    order: num(formData, "order") ?? 0,
    isActive: bool(formData, "isActive"),
  };
  if (id) await prisma.category.update({ where: { id }, data });
  else await prisma.category.create({ data });
  revalidatePath("/admin/categories");
}

export async function deleteCategory(formData: FormData) {
  await requireAdmin();
  const id = s(formData, "id");
  if (id) await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
}

/* ---------------- COUNTRIES ---------------- */

export async function saveCountry(formData: FormData) {
  await requireAdmin();
  const id = s(formData, "id");
  const nameEn = s(formData, "nameEn");
  const data = {
    nameEn,
    nameNe: s(formData, "nameNe") || nameEn,
    slug: s(formData, "slug") || slugify(nameEn),
    flag: s(formData, "flag") || null,
    descriptionEn: s(formData, "descriptionEn") || null,
    descriptionNe: s(formData, "descriptionNe") || null,
    imageUrl: s(formData, "imageUrl") || null,
    order: num(formData, "order") ?? 0,
    isActive: bool(formData, "isActive"),
  };
  if (id) await prisma.country.update({ where: { id }, data });
  else await prisma.country.create({ data });
  revalidatePath("/admin/countries");
}

export async function deleteCountry(formData: FormData) {
  await requireAdmin();
  const id = s(formData, "id");
  if (id) await prisma.country.delete({ where: { id } });
  revalidatePath("/admin/countries");
}

/* ---------------- SERVICES ---------------- */

export async function saveService(formData: FormData) {
  await requireAdmin();
  const id = s(formData, "id");
  const titleEn = s(formData, "titleEn");
  const data = {
    titleEn,
    titleNe: s(formData, "titleNe") || titleEn,
    descriptionEn: s(formData, "descriptionEn"),
    descriptionNe: s(formData, "descriptionNe") || s(formData, "descriptionEn"),
    icon: s(formData, "icon") || null,
    order: num(formData, "order") ?? 0,
    isActive: bool(formData, "isActive"),
  };
  if (id) await prisma.service.update({ where: { id }, data });
  else await prisma.service.create({ data });
  revalidatePath("/admin/services");
}

export async function deleteService(formData: FormData) {
  await requireAdmin();
  const id = s(formData, "id");
  if (id) await prisma.service.delete({ where: { id } });
  revalidatePath("/admin/services");
}

/* ---------------- TESTIMONIALS ---------------- */

export async function saveTestimonial(formData: FormData) {
  await requireAdmin();
  const id = s(formData, "id");
  const data = {
    name: s(formData, "name"),
    position: s(formData, "position") || null,
    message: s(formData, "message"),
    imageUrl: s(formData, "imageUrl") || null,
    rating: num(formData, "rating") ?? 5,
    order: num(formData, "order") ?? 0,
    isActive: bool(formData, "isActive"),
  };
  if (id) await prisma.testimonial.update({ where: { id }, data });
  else await prisma.testimonial.create({ data });
  revalidatePath("/admin/testimonials");
}

export async function deleteTestimonial(formData: FormData) {
  await requireAdmin();
  const id = s(formData, "id");
  if (id) await prisma.testimonial.delete({ where: { id } });
  revalidatePath("/admin/testimonials");
}

/* ---------------- FAQS ---------------- */

export async function saveFaq(formData: FormData) {
  await requireAdmin();
  const id = s(formData, "id");
  const qEn = s(formData, "questionEn");
  const data = {
    questionEn: qEn,
    questionNe: s(formData, "questionNe") || qEn,
    answerEn: s(formData, "answerEn"),
    answerNe: s(formData, "answerNe") || s(formData, "answerEn"),
    order: num(formData, "order") ?? 0,
    isActive: bool(formData, "isActive"),
  };
  if (id) await prisma.faq.update({ where: { id }, data });
  else await prisma.faq.create({ data });
  revalidatePath("/admin/faqs");
}

export async function deleteFaq(formData: FormData) {
  await requireAdmin();
  const id = s(formData, "id");
  if (id) await prisma.faq.delete({ where: { id } });
  revalidatePath("/admin/faqs");
}

/* ---------------- NOTICES ---------------- */

export async function saveNotice(formData: FormData) {
  await requireAdmin();
  const id = s(formData, "id");
  const titleEn = s(formData, "titleEn");
  const data = {
    titleEn,
    titleNe: s(formData, "titleNe") || titleEn,
    bodyEn: s(formData, "bodyEn"),
    bodyNe: s(formData, "bodyNe") || s(formData, "bodyEn"),
    isActive: bool(formData, "isActive"),
    publishedAt: date(formData, "publishedAt") ?? new Date(),
  };
  if (id) await prisma.notice.update({ where: { id }, data });
  else await prisma.notice.create({ data });
  revalidatePath("/admin/notices");
}

export async function deleteNotice(formData: FormData) {
  await requireAdmin();
  const id = s(formData, "id");
  if (id) await prisma.notice.delete({ where: { id } });
  revalidatePath("/admin/notices");
}

/* ---------------- APPLICATIONS ---------------- */

export async function updateApplicationStatus(formData: FormData) {
  await requireAdmin();
  const id = s(formData, "id");
  const status = s(formData, "status") as
    | "NEW"
    | "REVIEWING"
    | "SHORTLISTED"
    | "REJECTED"
    | "SELECTED";
  if (id) await prisma.application.update({ where: { id }, data: { status } });
  revalidatePath("/admin/applications");
}

export async function deleteApplication(formData: FormData) {
  await requireAdmin();
  const id = s(formData, "id");
  if (!id) return;
  const existing = await prisma.application.findUnique({
    where: { id },
    select: { resumeUrl: true },
  });
  await prisma.application.delete({ where: { id } });
  await deleteResume(existing?.resumeUrl);
  revalidatePath("/admin/applications");
}

export async function cleanupResumes() {
  await requireAdmin();
  const apps = await prisma.application.findMany({
    where: { resumeUrl: { not: null } },
    select: { resumeUrl: true },
  });
  const used = new Set(
    apps.map((a) => a.resumeUrl!.split("/").pop() as string)
  );
  const removed = await removeResumesNotIn(used);
  revalidatePath("/admin/settings");
  redirect(`/admin/settings?cleaned=${removed}`);
}

/* ---------------- INQUIRIES ---------------- */

export async function toggleInquiryRead(formData: FormData) {
  await requireAdmin();
  const id = s(formData, "id");
  const isRead = s(formData, "isRead") === "true";
  if (id) await prisma.inquiry.update({ where: { id }, data: { isRead: !isRead } });
  revalidatePath("/admin/inquiries");
}

export async function deleteInquiry(formData: FormData) {
  await requireAdmin();
  const id = s(formData, "id");
  if (id) await prisma.inquiry.delete({ where: { id } });
  revalidatePath("/admin/inquiries");
}

/* ---------------- SETTINGS ---------------- */

export async function saveSettings(formData: FormData) {
  await requireAdmin();
  const entries: [string, string][] = [];
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("setting__") && typeof value === "string") {
      entries.push([key.replace("setting__", ""), value]);
    }
  }
  await Promise.all(
    entries.map(([key, value]) =>
      prisma.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    )
  );
  revalidatePath("/admin/settings");
  revalidatePath("/");
}
