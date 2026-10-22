"use client";

import { Suspense, useActionState } from "react";
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
          className="rounded-lg bg-rose-50 border border-rose-200/80 p-3 text-xs text-rose-700 flex items-start gap-2"
        >
          <span className="font-semibold shrink-0">Gagal:</span>
          <span>{state.error}</span>
        </div>
      )}

      <div>
        <label
          htmlFor="username"
          className="block text-xs font-medium text-slate-700 mb-1.5"
        >
          Nama Pengguna (Username)
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          required
          disabled={isPending}
          className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 disabled:bg-slate-100 transition-colors"
          placeholder="Masukkan username admin"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor="password"
            className="block text-xs font-medium text-slate-700"
          >
            Kata Sandi (Password)
          </label>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          disabled={isPending}
          className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 disabled:bg-slate-100 transition-colors"
          placeholder="Masukkan kata sandi"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="h-10 w-full rounded-lg bg-slate-900 px-4 text-center text-sm font-medium text-white shadow-xs hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/20 disabled:opacity-50 transition-colors cursor-pointer flex items-center justify-center gap-2 mt-2"
      >
        {isPending ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Memverifikasi...</span>
          </>
        ) : (
          "Masuk Panel"
        )}
      </button>

      <div className="pt-2 text-center">
        <p className="text-[11px] text-slate-400 font-mono">
          Area Terbatas · Akses Khusus Tim Operasional ZKS
        </p>
      </div>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 text-slate-900">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] border border-slate-200/80 p-7">
        <div className="mb-6 text-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 border border-slate-200/70 text-[10px] font-mono font-medium text-slate-600 uppercase tracking-wider mb-1">
            ZKS ERP · Karawang
          </div>
          <h1 className="text-lg font-semibold tracking-tight text-slate-900">
            Masuk Panel Admin
          </h1>
          <p className="text-xs text-slate-500">
            PT Zahdan Kamal Sentosa Catering
          </p>
        </div>

        <Suspense fallback={<div className="text-center text-xs text-slate-400 py-4">Memuat formulir...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
