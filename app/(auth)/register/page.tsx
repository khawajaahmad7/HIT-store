"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { registerAction } from "@/lib/actions/auth";
import { ABOUT_HERO_IMAGE } from "@/lib/placeholders";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full font-display">
      {pending ? "Creating account…" : "Create Account"}
    </button>
  );
}

export default function RegisterPage() {
  const [state, formAction] = useFormState(registerAction, { ok: false });

  return (
    <div className="relative mx-auto flex min-h-[95vh] max-w-md flex-col justify-center px-6 py-24 z-10">
      {/* Quiet background image with heavy overlay */}
      <div className="absolute inset-0 -z-20 overflow-hidden">
        <Image
          src={ABOUT_HERO_IMAGE.src}
          alt=""
          fill
          className="object-cover opacity-[0.06]"
          unoptimized
          priority
        />
        <div className="absolute inset-0 bg-paper/90" />
      </div>

      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-ink/40">Portal</p>
        <h1 className="mt-2 font-display text-display-md font-bold text-ink">Join HIT BY HUMA</h1>
        <p className="mt-2 text-sm text-ink/65 leading-relaxed">Create an account for faster checkout and to track your orders.</p>
      </div>

      <form action={formAction} className="mt-6 space-y-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-ink/40">First name</label>
            <input
              name="firstName"
              type="text"
              required
              className="mt-2 w-full border-b border-ink/20 bg-transparent px-0 py-3 text-sm focus:border-ink focus:outline-none rounded-none text-ink font-sans"
            />
          </div>
          <div>
            <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-ink/40">Last name</label>
            <input
              name="lastName"
              type="text"
              className="mt-2 w-full border-b border-ink/20 bg-transparent px-0 py-3 text-sm focus:border-ink focus:outline-none rounded-none text-ink font-sans"
            />
          </div>
        </div>
        <div>
          <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-ink/40">Phone</label>
          <input
            name="phone"
            type="tel"
            required
            placeholder="0300 1234567"
            className="mt-2 w-full border-b border-ink/20 bg-transparent px-0 py-3 text-sm focus:border-ink focus:outline-none rounded-none text-ink placeholder:text-ink/30 font-sans"
          />
        </div>
        <div>
          <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-ink/40">Email (optional)</label>
          <input
            name="email"
            type="email"
            placeholder="name@domain.com"
            className="mt-2 w-full border-b border-ink/20 bg-transparent px-0 py-3 text-sm focus:border-ink focus:outline-none rounded-none text-ink placeholder:text-ink/30 font-sans"
          />
        </div>
        <div>
          <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-ink/40">Password</label>
          <input
            name="password"
            type="password"
            required
            minLength={6}
            placeholder="At least 6 characters"
            className="mt-2 w-full border-b border-ink/20 bg-transparent px-0 py-3 text-sm focus:border-ink focus:outline-none rounded-none text-ink placeholder:text-ink/30 font-sans"
          />
        </div>

        {state.error && (
          <p className="rounded bg-maroon/10 px-3 py-2 text-xs font-mono uppercase tracking-wider text-maroon text-center">{state.error}</p>
        )}

        <SubmitButton />

        <p className="text-center text-xs font-mono uppercase tracking-wider text-ink/50 pt-2">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-maroon underline decoration-maroon underline-offset-4 hover:text-ink hover:decoration-ink transition-colors">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
