import NextAuth, { type DefaultSession } from "next-auth";
import type { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { findCustomerByPhone } from "@/lib/db/queries/customers";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      customerId: number;
      phone: string;
      firstName: string;
      lastName?: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    customerId?: number;
    phone?: string;
    firstName?: string;
    lastName?: string | null;
  }
}

const credSchema = z.object({
  phone: z.string().min(7, "Phone is required"),
  password: z.string().min(1, "Password is required"),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Phone + Password",
      credentials: {
        phone: { label: "Phone", type: "tel" },
        password: { label: "Password", type: "password" },
      },
      async authorize(raw) {
        const parsed = credSchema.safeParse(raw);
        if (!parsed.success) return null;

        const customer = await findCustomerByPhone(parsed.data.phone);
        if (!customer || !customer.passwordHash) return null;

        const ok = await bcrypt.compare(parsed.data.password, customer.passwordHash);
        if (!ok) return null;

        return {
          id: String(customer.customerId),
          name: `${customer.firstName} ${customer.lastName ?? ""}`.trim(),
          customerId: customer.customerId,
          phone: customer.phone,
          firstName: customer.firstName,
          lastName: customer.lastName,
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.customerId = (user as any).customerId;
        token.phone = (user as any).phone;
        token.firstName = (user as any).firstName;
        token.lastName = (user as any).lastName;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = String(token.customerId);
        session.user.customerId = token.customerId as number;
        session.user.phone = token.phone as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = (token.lastName as string) ?? null;
      }
      return session;
    },
  },
});
