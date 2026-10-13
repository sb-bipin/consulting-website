"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  verifyPassword,
  hashPassword,
  getSession,
  createSession,
  destroySession,
} from "@/lib/auth";

export type LoginState = { ok: boolean; message: string } | null;

export async function login(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { ok: false, message: "Please enter your email and password." };
  }

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin || !(await verifyPassword(password, admin.passwordHash))) {
    return { ok: false, message: "Invalid email or password." };
  }

  await createSession({
    adminId: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
  });

  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

export type PasswordState = { ok: boolean; message: string } | null;

export async function changePassword(
  _prev: PasswordState,
  formData: FormData
): Promise<PasswordState> {
  const session = await getSession();
  if (!session) return { ok: false, message: "You are not signed in." };

  const current = String(formData.get("current") || "");
  const next = String(formData.get("password") || "");
  const confirm = String(formData.get("confirm") || "");

  if (next.length < 6) {
    return { ok: false, message: "New password must be at least 6 characters." };
  }
  if (next !== confirm) {
    return { ok: false, message: "New passwords do not match." };
  }

  const admin = await prisma.admin.findUnique({
    where: { id: session.adminId },
  });
  if (!admin) return { ok: false, message: "Account not found." };

  if (!(await verifyPassword(current, admin.passwordHash))) {
    return { ok: false, message: "Current password is incorrect." };
  }

  await prisma.admin.update({
    where: { id: admin.id },
    data: { passwordHash: await hashPassword(next) },
  });

  return { ok: true, message: "Password updated successfully." };
}
