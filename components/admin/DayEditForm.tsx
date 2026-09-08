"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Day, Resource, SkillFile } from "@prisma/client";
import { updateDay, type DayUpdateInput } from "@/lib/actions/admin";

function toDateInputValue(date: Date | string): string {
  const d = new Date(date);
  return d.toISOString().slice(0, 10);
}

type DayWithLinks = Day & {
  resources: { id: string }[];
  skill_files: { id: string }[];
};

export default function DayEditForm({
  day,
  availableResources,
  availableSkillFiles,
}: {
  day: DayWithLinks;
  availableResources: Resource[];
  availableSkillFiles: SkillFile[];
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    date: toDateInputValue(day.date),
    title: day.title,
    time_estimate_minutes: day.time_estimate_minutes?.toString() ?? "",
    is_live_session: day.is_live_session,
    live_session_label: day.live_session_label ?? "",
    is_unlocked: day.is_unlocked,
    why_today: day.why_today ?? "",
    action_html: day.action_html ?? "",
    proof_required: day.proof_required ?? "",
    note_html: day.note_html ?? "",
  });
  const [resourceIds, setResourceIds] = useState<string[]>(day.resources.map((r) => r.id));
  const [skillFileIds, setSkillFileIds] = useState<string[]>(day.skill_files.map((s) => s.id));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  function toggleResource(id: string) {
    setResourceIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));
    setSaved(false);
  }

  function toggleSkillFile(id: string) {
    setSkillFileIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));
    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload: DayUpdateInput = {
        date: form.date,
        title: form.title,
        time_estimate_minutes: form.time_estimate_minutes
          ? Number(form.time_estimate_minutes)
          : null,
        is_live_session: form.is_live_session,
        live_session_label: form.live_session_label || null,
        is_unlocked: form.is_unlocked,
        why_today: form.why_today || null,
        action_html: form.action_html || null,
        proof_required: form.proof_required || null,
        note_html: form.note_html || null,
        resource_ids: resourceIds,
        skill_file_ids: skillFileIds,
      };
      await updateDay(day.id, payload);
      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se ha podido guardar.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "mt-1 w-full rounded border border-white/10 bg-card px-3 py-2 text-text-primary focus:border-accent focus:outline-none";
  const labelClass = "block text-sm text-text-secondary";

  return (
    <form onSubmit={handleSubmit} className="flex max-w-3xl flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Fecha</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => set("date", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Minutos estimados</label>
          <input
            type="number"
            min={0}
            value={form.time_estimate_minutes}
            onChange={(e) => set("time_estimate_minutes", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Título</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-text-primary">
          <input
            type="checkbox"
            checked={form.is_unlocked}
            onChange={(e) => set("is_unlocked", e.target.checked)}
          />
          Desbloqueado
        </label>
        <label className="flex items-center gap-2 text-sm text-text-primary">
          <input
            type="checkbox"
            checked={form.is_live_session}
            onChange={(e) => set("is_live_session", e.target.checked)}
          />
          Es sesión en directo
        </label>
      </div>

      {form.is_live_session && (
        <div>
          <label className={labelClass}>Etiqueta del directo</label>
          <input
            type="text"
            value={form.live_session_label}
            onChange={(e) => set("live_session_label", e.target.value)}
            placeholder='Ej. "Directo de apertura"'
            className={inputClass}
          />
        </div>
      )}

      <div>
        <label className={labelClass}>Por qué hoy</label>
        <textarea
          value={form.why_today}
          onChange={(e) => set("why_today", e.target.value)}
          rows={4}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>
          Acción (HTML simple: &lt;p&gt;, &lt;strong&gt;, &lt;ol&gt;/&lt;ul&gt;/&lt;li&gt;)
        </label>
        <textarea
          value={form.action_html}
          onChange={(e) => set("action_html", e.target.value)}
          rows={12}
          className={`${inputClass} font-mono text-xs`}
        />
      </div>

      <div>
        <label className={labelClass}>Prueba requerida</label>
        <textarea
          value={form.proof_required}
          onChange={(e) => set("proof_required", e.target.value)}
          rows={3}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Nota final (HTML, opcional)</label>
        <textarea
          value={form.note_html}
          onChange={(e) => set("note_html", e.target.value)}
          rows={5}
          className={`${inputClass} font-mono text-xs`}
        />
      </div>

      <div className="rounded border border-white/10 p-4">
        <p className="text-sm font-medium text-text-primary">Recursos de este día</p>
        <p className="mt-1 text-xs text-text-secondary">
          Marca las plantillas, el catálogo o la skill que el alumno debería tener a mano dentro
          de esta carta, además de la sección fija de Recursos.
        </p>

        {availableResources.length === 0 && availableSkillFiles.length === 0 ? (
          <p className="mt-3 text-sm text-text-secondary">
            Todavía no hay recursos en esta edición. Créalos en{" "}
            <span className="text-accent">Recursos</span> primero.
          </p>
        ) : (
          <div className="mt-3 flex flex-col gap-2">
            {availableResources.map((r) => (
              <label
                key={r.id}
                className="flex items-center gap-2 text-sm text-text-primary"
              >
                <input
                  type="checkbox"
                  checked={resourceIds.includes(r.id)}
                  onChange={() => toggleResource(r.id)}
                />
                <span className="text-xs uppercase tracking-wide text-text-secondary">
                  {r.type === "catalog_item" ? "Catálogo" : "Plantilla"}
                </span>
                {r.title}
              </label>
            ))}
            {availableSkillFiles.map((s) => (
              <label
                key={s.id}
                className="flex items-center gap-2 text-sm text-text-primary"
              >
                <input
                  type="checkbox"
                  checked={skillFileIds.includes(s.id)}
                  onChange={() => toggleSkillFile(s.id)}
                />
                <span className="text-xs uppercase tracking-wide text-text-secondary">Skill</span>
                {s.title}
              </label>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded bg-accent px-5 py-2 font-medium text-white transition hover:bg-accent/90 disabled:opacity-50"
        >
          {saving ? "Guardando…" : "Guardar"}
        </button>
        {saved && <span className="text-sm text-accent">Guardado.</span>}
      </div>
    </form>
  );
}
