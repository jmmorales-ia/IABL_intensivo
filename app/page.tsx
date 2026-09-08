"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getActiveEditions, createStudent, getStudentSession } from "@/lib/actions/public";
import { getStoredStudentId, setStoredStudentId, clearStoredStudentId } from "@/lib/client/storage";

type Edition = { id: string; name: string; start_date: Date; end_date: Date };

export default function WelcomePage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [editions, setEditions] = useState<Edition[]>([]);
  const [editionId, setEditionId] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const existingId = getStoredStudentId();
      if (existingId) {
        const session = await getStudentSession(existingId);
        if (session) {
          router.replace("/dias");
          return;
        }
        clearStoredStudentId();
      }

      const active = await getActiveEditions();
      setEditions(active);
      if (active.length === 1) {
        setEditionId(active[0].id);
      }
      setChecking(false);
    })();
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!editionId) {
      setError("Selecciona una edición.");
      return;
    }
    if (!name.trim()) {
      setError("Escribe tu nombre.");
      return;
    }

    setSubmitting(true);
    try {
      const student = await createStudent(editionId, name);
      setStoredStudentId(student.id);
      router.replace("/dias");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se ha podido guardar tu nombre.");
      setSubmitting(false);
    }
  }

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <p className="text-text-secondary">Cargando…</p>
      </main>
    );
  }

  if (editions.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 text-center">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">
            No hay ninguna edición activa ahora mismo
          </h1>
          <p className="mt-2 text-text-secondary">
            Vuelve a intentarlo más tarde o contacta con tu organización.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-text-primary">Intensivo · IA Business Lab</h1>
        <p className="mt-2 text-text-secondary">
          30 días de acción, un poco cada día. Escribe tu nombre para empezar.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          {editions.length > 1 && (
            <div>
              <label htmlFor="edition" className="block text-sm text-text-secondary">
                Edición
              </label>
              <select
                id="edition"
                value={editionId}
                onChange={(e) => setEditionId(e.target.value)}
                className="mt-1 w-full rounded border border-white/10 bg-card px-3 py-2 text-text-primary focus:border-accent focus:outline-none"
              >
                <option value="" disabled>
                  Elige tu edición
                </option>
                {editions.map((ed) => (
                  <option key={ed.id} value={ed.id}>
                    {ed.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm text-text-secondary">
              Tu nombre
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre y apellido"
              className="mt-1 w-full rounded border border-white/10 bg-card px-3 py-2 text-text-primary placeholder:text-text-secondary/60 focus:border-accent focus:outline-none"
              autoFocus
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 rounded bg-accent px-4 py-2 font-medium text-white transition hover:bg-accent/90 disabled:opacity-50"
          >
            {submitting ? "Entrando…" : "Empezar"}
          </button>
        </form>
      </div>
    </main>
  );
}
