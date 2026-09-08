"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setEditionActive, updateEditionMeta, cloneEdition } from "@/lib/actions/admin";
import { formatFullDate } from "@/lib/format";

type EditionRow = {
  id: string;
  name: string;
  start_date: Date;
  end_date: Date;
  is_active: boolean;
  _count: { days: number; students: number };
};

function toDateInputValue(date: Date | string): string {
  return new Date(date).toISOString().slice(0, 10);
}

const inputClass =
  "mt-1 w-full rounded border border-white/10 bg-bg px-3 py-2 text-text-primary focus:border-accent focus:outline-none";
const labelClass = "block text-sm text-text-secondary";

function EditEditionForm({
  edition,
  onCancel,
}: {
  edition: EditionRow;
  onCancel: () => void;
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: edition.name,
    start_date: toDateInputValue(edition.start_date),
    end_date: toDateInputValue(edition.end_date),
  });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await updateEditionMeta(edition.id, form);
    setSaving(false);
    onCancel();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-3 rounded border border-white/10 bg-bg/50 p-4">
      <div>
        <label className={labelClass}>Nombre</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={inputClass}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Inicio</label>
          <input
            type="date"
            value={form.start_date}
            onChange={(e) => setForm({ ...form, start_date: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Fin</label>
          <input
            type="date"
            value={form.end_date}
            onChange={(e) => setForm({ ...form, end_date: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded bg-accent px-4 py-1.5 text-sm font-medium text-white hover:bg-accent/90 disabled:opacity-50"
        >
          {saving ? "Guardando…" : "Guardar"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded px-4 py-1.5 text-sm text-text-secondary hover:text-text-primary"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

function CloneForm({ editions }: { editions: EditionRow[] }) {
  const router = useRouter();
  const [sourceId, setSourceId] = useState(editions[0]?.id ?? "");
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!sourceId || !name.trim() || !startDate || !endDate) {
      setError("Rellena todos los campos.");
      return;
    }
    setSaving(true);
    try {
      await cloneEdition(sourceId, {
        name,
        start_date: startDate,
        end_date: endDate,
        is_active: isActive,
      });
      setName("");
      setStartDate("");
      setEndDate("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se ha podido crear la edición.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded border border-white/10 bg-card p-4">
      <div>
        <label className={labelClass}>Clonar desde</label>
        <select
          value={sourceId}
          onChange={(e) => setSourceId(e.target.value)}
          className={inputClass}
        >
          {editions.map((ed) => (
            <option key={ed.id} value={ed.id}>
              {ed.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelClass}>Nombre de la nueva edición</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Intensivo Enero 2027"
          className={inputClass}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Inicio</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Fin</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm text-text-primary">
        <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
        Visible para alumnos (activa)
      </label>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={saving}
        className="self-start rounded bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 disabled:opacity-50"
      >
        {saving ? "Creando…" : "Crear edición clonada"}
      </button>
      <p className="text-xs text-text-secondary">
        Todos los días de la nueva edición se crean bloqueados; las fechas se recalculan a partir
        de la fecha de inicio manteniendo el número de día.
      </p>
    </form>
  );
}

export default function EditionManager({ editions }: { editions: EditionRow[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function handleToggleActive(id: string, current: boolean) {
    setPendingId(id);
    await setEditionActive(id, !current);
    router.refresh();
    setPendingId(null);
  }

  return (
    <div className="flex max-w-2xl flex-col gap-10">
      <section>
        <h2 className="text-lg font-semibold text-text-primary">Ediciones existentes</h2>
        <div className="mt-3 flex flex-col gap-3">
          {editions.map((ed) => (
            <div key={ed.id} className="rounded border-l-4 border-accent bg-card p-4">
              {editingId === ed.id ? (
                <EditEditionForm edition={ed} onCancel={() => setEditingId(null)} />
              ) : (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-medium text-text-primary">{ed.name}</h3>
                      <p className="mt-1 text-sm text-text-secondary">
                        {formatFullDate(ed.start_date)} — {formatFullDate(ed.end_date)}
                      </p>
                      <p className="mt-1 text-xs text-text-secondary">
                        {ed._count.days} días · {ed._count.students} alumnos
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleActive(ed.id, ed.is_active)}
                      disabled={pendingId === ed.id}
                      className={`flex-none rounded px-2 py-1 text-xs font-medium transition disabled:opacity-50 ${
                        ed.is_active ? "bg-accent/15 text-accent" : "bg-white/5 text-text-secondary"
                      }`}
                    >
                      {ed.is_active ? "Activa" : "Inactiva"}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingId(ed.id)}
                    className="mt-3 text-sm text-accent hover:underline"
                  >
                    Editar nombre / fechas
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-text-primary">Nueva edición (clonar)</h2>
        <div className="mt-3">
          <CloneForm editions={editions} />
        </div>
      </section>
    </div>
  );
}
