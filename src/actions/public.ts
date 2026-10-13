"use server";

import fs from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { resumeDir } from "@/lib/storage";

export type FormState = {
  ok: boolean;
  message: string;
} | null;

function str(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v.trim() : "";
}

async function saveResume(file: File): Promise<string | null> {
  if (!file || file.size === 0) return null;
  const allowed = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  if (!allowed.includes(file.type)) {
    throw new Error("INVALID_FILE_TYPE");
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("FILE_TOO_LARGE");
  }
  const dir = resumeDir;
  await fs.mkdir(dir, { recursive: true });
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filename = `${Date.now()}-${safeName}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(dir, filename), bytes);
  return `/uploads/resumes/${filename}`;
}

export async function submitInquiry(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const name = str(formData, "name");
  const email = str(formData, "email");
  const phone = str(formData, "phone");
  const subject = str(formData, "subject");
  const message = str(formData, "message");
  const type = str(formData, "type") === "HIRE" ? "HIRE" : "CONTACT";

  if (!name || !email || !message) {
    return { ok: false, message: "MISSING_FIELDS" };
  }

  await prisma.inquiry.create({
    data: { name, email, phone, subject, message, type },
  });

  revalidatePath("/admin/inquiries");
  return { ok: true, message: "SUCCESS" };
}

export async function submitApplication(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const fullName = str(formData, "fullName");
  const email = str(formData, "email");
  const phone = str(formData, "phone");
  if (!fullName || !email || !phone) {
    return { ok: false, message: "MISSING_FIELDS" };
  }

  const jobSlug = str(formData, "jobSlug");
  let jobId: string | null = null;
  if (jobSlug) {
    const job = await prisma.job.findUnique({
      where: { slug: jobSlug },
      select: { id: true },
    });
    jobId = job?.id ?? null;
  }

  const dobRaw = str(formData, "dob");
  const resumeFile = formData.get("resume");

  let resumeUrl: string | null = null;
  try {
    if (resumeFile instanceof File) {
      resumeUrl = await saveResume(resumeFile);
    }
  } catch (e) {
    const code = e instanceof Error ? e.message : "UPLOAD_FAILED";
    return { ok: false, message: code };
  }

  await prisma.application.create({
    data: {
      jobId,
      fullName,
      email,
      phone,
      address: str(formData, "address") || null,
      dob: dobRaw ? new Date(dobRaw) : null,
      gender: str(formData, "gender") || null,
      nationality: str(formData, "nationality") || null,
      passportNo: str(formData, "passportNo") || null,
      experience: str(formData, "experience") || null,
      coverLetter: str(formData, "coverLetter") || null,
      resumeUrl,
    },
  });

  revalidatePath("/admin/applications");
  return { ok: true, message: "SUCCESS" };
}
