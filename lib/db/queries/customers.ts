import { db } from "@/lib/db";
import { customers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function findCustomerByPhone(phone: string) {
  const rows = await db.select().from(customers).where(eq(customers.phone, phone)).limit(1);
  return rows[0] ?? null;
}

export async function findCustomerById(id: number) {
  const rows = await db.select().from(customers).where(eq(customers.customerId, id)).limit(1);
  return rows[0] ?? null;
}

export async function createCustomer(data: {
  phone: string;
  firstName: string;
  lastName?: string;
  email?: string;
  passwordHash: string;
}) {
  const [result] = await db.insert(customers).values({
    phone: data.phone,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    passwordHash: data.passwordHash,
    isActive: 1,
  });
  return Number((result as any).insertId);
}

export async function updateCustomerAddress(id: number, address: string, city: string) {
  await db
    .update(customers)
    .set({ address, city, updatedAt: new Date() })
    .where(eq(customers.customerId, id));
}
