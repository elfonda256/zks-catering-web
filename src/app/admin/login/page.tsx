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
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      {state.error && (
        <div
          role="alert"
          className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700"
        >
          {state.error}
        </div>
      )}

      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-neutral-700 mb-1"
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
          className="w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 disabled:bg-neutral-100 transition-colors"
          placeholder="Masukkan username admin"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-neutral-700 mb-1"
        >
          Kata Sandi (Password)
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          disabled={isPending}
          className="w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 disabled:bg-neutral-100 transition-colors"
          placeholder="Masukkan kata sandi"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-neutral-900 py-2.5 px-4 text-center text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900/30 disabled:opacity-50 transition-colors cursor-pointer"
      >
        {isPending ? "Memverifikasi..." : "Masuk"}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-50 px-4 py-12 text-neutral-900">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md border border-neutral-200 p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Masuk Panel Admin
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            Zahdan Kamal Sentosa Catering
          </p>
        </div>

        <Suspense fallback={<div className="text-center text-sm text-neutral-500">Memuat formulir...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
