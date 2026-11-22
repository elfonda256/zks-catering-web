"use client";

import { Suspense, useActionState } from "react";
import Image from "next/image";
import { Button } from "@/shared/components/ui/Button";
import { useSearchParams } from "next/navigation";
import { loginAction, type LoginActionState } from "./actions";

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin/dashboard";

  const initialState: LoginActionState = {};
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      {state.error && (
        <div
          role="alert"
          className="rounded-[8px] bg-rose-50 border border-rose-200 px-3 py-2 text-[13px] text-rose-700"
        >
          {state.error}
        </div>
      )}

      <div>
        <label
          htmlFor="username"
          className="block text-[13px] font-medium text-stone-700 mb-1.5"
        >
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          required
          disabled={isPending}
          className="h-10 w-full rounded-[8px] border border-stone-300 bg-white px-3 text-sm text-stone-900 placeholder:text-stone-400 focus:border-brand-500 focus:outline-none focus:ring-3 focus:ring-brand-500/15 disabled:bg-stone-100 transition-colors"
          autoFocus
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor="password"
            className="block text-[13px] font-medium text-stone-700"
          >
            Kata sandi
          </label>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          disabled={isPending}
          className="h-10 w-full rounded-[8px] border border-stone-300 bg-white px-3 text-sm text-stone-900 placeholder:text-stone-400 focus:border-brand-500 focus:outline-none focus:ring-3 focus:ring-brand-500/15 disabled:bg-stone-100 transition-colors"
        />
      </div>

      <Button type="submit" size="lg" disabled={isPending} className="w-full mt-2">
        {isPending ? "Memverifikasi..." : "Masuk"}
      </Button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 bg-ink px-4 py-12 text-stone-900">
      <div className="w-full max-w-sm overflow-hidden rounded-[16px] border border-stone-200/80 bg-white shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)]">
        <div aria-hidden="true" className="h-1 bg-brand-500" />
        <div className="p-8">
          <div className="mb-7 flex flex-col items-center text-center">
            {/* Served unoptimized: the emblem file is already sized for 2x displays */}
            <Image src="/images/zks-emblem.png" alt="" width={63} height={40} unoptimized priority />
            <h1 className="mt-5 text-[22px] font-bold tracking-tight text-ink">Masuk ke panel admin</h1>
            <p className="mt-1 text-[13px] font-medium text-brand-600">PT Zahdan Kamal Sentosa</p>
          </div>

          <Suspense fallback={<div className="text-center text-xs text-stone-400 py-4">Memuat formulir...</div>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
      <p className="text-[12px] text-white/50">Khusus admin ZKS Catering.</p>
    </main>
  );
}
