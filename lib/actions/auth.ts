"use server";

import { signIn, signOut } from "@/lib/auth";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { findCustomerByPhone, createCustomer, findCustomerById } from "@/lib/db/queries/customers";
import { revalidatePath } from "next/cache";

const registerSchema = z.object({
  phone: z.string().min(7, "Phone is required").max(20),
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().max(50).optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type ActionState = { ok: boolean; error?: string };

export async function registerAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = registerSchema.safeParse({
    phone: String(formData.get("phone") ?? "").trim(),
    firstName: String(formData.get("firstName") ?? "").trim(),
    lastName: String(formData.get("lastName") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const existing = await findCustomerByPhone(parsed.data.phone);
  if (existing) {
    return { ok: false, error: "An account with this phone already exists. Try logging in." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  const customerId = await createCustomer({
    phone: parsed.data.phone,
    firstName: parsed.data.firstName,
    lastName: parsed.data.lastName || undefined,
    email: parsed.data.email || undefined,
    passwordHash,
  });

  // Auto sign-in
  try {
    await signIn("credentials", {
      phone: parsed.data.phone,
      password: parsed.data.password,
      redirect: false,
    });
  } catch {
    // ignore — they can log in manually
  }

  revalidatePath("/");
  return { ok: true };
}

const loginSchema = z.object({
  phone: z.string().min(7),
  password: z.string().min(1),
});

export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    phone: String(formData.get("phone") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
  });
  if (!parsed.success) return { ok: false, error: "Phone and password are required" };

  try {
    await signIn("credentials", {
      phone: parsed.data.phone,
      password: parsed.data.password,
      redirectTo: "/",
    });
    return { ok: true };
  } catch (err: any) {
    if (err?.type === "CredentialsSignin" || err?.message?.includes("Credentials")) {
      return { ok: false, error: "Invalid phone or password" };
    }
    // Re-throw redirect-like errors so Next.js can handle them
    if (err?.digest?.startsWith?.("NEXT_REDIRECT")) throw err;
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}
