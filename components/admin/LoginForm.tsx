"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "@/lib/actions/admin";

export default function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const result = await loginAdmin(password);
    if (result.ok) {
      router.replace("/admin");
      router.refresh();
    } else {
      setError(result.error ?? "Error desconocido.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-xs flex-col gap-4">
      <div>
        <label htmlFor="password" className="block text-sm text-text-secondary">
          Contraseña de administrador
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded border border-white/10 bg-card px-3 py-2 text-text-primary focus:border-accent focus:outline-none"
          autoFocus
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="rounded bg-accent px-4 py-2 font-medium text-white transition hover:bg-accent/90 disabled:opacity-50"
      >
        {submitting ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
