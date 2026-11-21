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
          className="block text-[13px] font-medium text-slate-700 mb-1.5"
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
          className="h-10 w-full rounded-[8px] border border-slate-300 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 disabled:bg-slate-100 transition-colors"
          autoFocus
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor="password"
            className="block text-[13px] font-medium text-slate-700"
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
          className="h-10 w-full rounded-[8px] border border-slate-300 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 disabled:bg-slate-100 transition-colors"
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
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 text-slate-900">
      <div className="w-full max-w-sm bg-white rounded-[12px] border border-slate-200 p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          {/* Served unoptimized: the emblem file is already sized for 2x displays */}
          <Image src="/images/zks-emblem.png" alt="" width={63} height={40} unoptimized priority />
          <h1 className="mt-4 text-[20px] font-semibold tracking-tight text-slate-900">Masuk ke panel admin</h1>
          <p className="mt-1 text-[13px] text-slate-500">PT Zahdan Kamal Sentosa</p>
        </div>

        <Suspense fallback={<div className="text-center text-xs text-slate-400 py-4">Memuat formulir...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
