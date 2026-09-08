"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Resource, SkillFile, ResourceType } from "@prisma/client";
import {
  createResource,
  updateResource,
  deleteResource,
  createSkillFile,
  updateSkillFile,
  deleteSkillFile,
  type ResourceInput,
  type SkillFileInput,
} from "@/lib/actions/admin";

const inputClass =
  "mt-1 w-full rounded border border-white/10 bg-bg px-3 py-2 text-text-primary focus:border-accent focus:outline-none";
const labelClass = "block text-sm text-text-secondary";

function emptyResource(type: ResourceType, sortOrder: number): ResourceInput {
  return { type, title: "", content_html: "", price_range: null, sort_order: sortOrder };
}

function ResourceForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: ResourceInput;
  onSave: (data: ResourceInput) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-3 rounded border border-white/10 bg-bg/50 p-4">
      <div>
        <label className={labelClass}>Título</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className={inputClass}
          required
        />
      </div>
      <div>
        <label className={labelClass}>Contenido (HTML simple)</label>
        <textarea
          value={form.content_html}
          onChange={(e) => setForm({ ...form, content_html: e.target.value })}
          rows={5}
          className={`${inputClass} font-mono text-xs`}
          required
        />
      </div>
      {form.type === "catalog_item" && (
        <div>
          <label className={labelClass}>Rango de precio</label>
          <input
            type="text"
            value={form.price_range ?? ""}
            onChange={(e) => setForm({ ...form, price_range: e.target.value })}
            placeholder="500-700€"
            className={inputClass}
          />
        </div>
      )}
      <div>
        <label className={labelClass}>Orden</label>
        <input
          type="number"
          value={form.sort_order}
          onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
          className={inputClass}
        />
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

function ResourceListSection({
  title,
  type,
  items,
  editionId,
}: {
  title: string;
  type: ResourceType;
  items: Resource[];
  editionId: string;
}) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  async function handleCreate(data: ResourceInput) {
    await createResource(editionId, data);
    setCreating(false);
    router.refresh();
  }

  async function handleUpdate(id: string, data: ResourceInput) {
    await updateResource(id, data);
    setEditingId(null);
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este elemento?")) return;
    await deleteResource(id);
    router.refresh();
  }

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
        <button
          type="button"
          onClick={() => setCreating((c) => !c)}
          className="rounded border border-accent px-3 py-1 text-sm text-accent hover:bg-accent hover:text-white"
        >
          {creating ? "Cancelar" : "Nuevo"}
        </button>
      </div>

      {creating && (
        <ResourceForm
          initial={emptyResource(type, items.length)}
          onSave={handleCreate}
          onCancel={() => setCreating(false)}
        />
      )}

      <div className="mt-3 flex flex-col gap-3">
        {items.map((item) => (
          <div key={item.id} className="rounded border-l-4 border-accent bg-card p-4">
            {editingId === item.id ? (
              <ResourceForm
                initial={{
                  type: item.type,
                  title: item.title,
                  content_html: item.content_html,
                  price_range: item.price_range,
                  sort_order: item.sort_order,
                }}
                onSave={(data) => handleUpdate(item.id, data)}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-medium text-text-primary">{item.title}</h3>
                  {item.price_range && (
                    <span className="text-sm text-accent">{item.price_range}</span>
                  )}
                </div>
                <div
                  className="prose-content mt-2 text-sm text-text-secondary"
                  dangerouslySetInnerHTML={{ __html: item.content_html }}
                />
                <div className="mt-3 flex gap-3 text-sm">
                  <button
                    type="button"
                    onClick={() => setEditingId(item.id)}
                    className="text-accent hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="text-red-400 hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
        {items.length === 0 && !creating && (
          <p className="text-sm text-text-secondary">Nada todavía.</p>
        )}
      </div>
    </section>
  );
}

function emptySkillFile(): SkillFileInput {
  return { title: "", download_url: "", instructions_html: "" };
}

function SkillFileForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: SkillFileInput;
  onSave: (data: SkillFileInput) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-3 rounded border border-white/10 bg-bg/50 p-4">
      <div>
        <label className={labelClass}>Título</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className={inputClass}
          required
        />
      </div>
      <div>
        <label className={labelClass}>Enlace de descarga</label>
        <input
          type="url"
          value={form.download_url}
          onChange={(e) => setForm({ ...form, download_url: e.target.value })}
          className={inputClass}
          required
        />
      </div>
      <div>
        <label className={labelClass}>Instrucciones (HTML simple)</label>
        <textarea
          value={form.instructions_html}
          onChange={(e) => setForm({ ...form, instructions_html: e.target.value })}
          rows={5}
          className={`${inputClass} font-mono text-xs`}
        />
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

function SkillSection({ items, editionId }: { items: SkillFile[]; editionId: string }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  async function handleCreate(data: SkillFileInput) {
    await createSkillFile(editionId, data);
    setCreating(false);
    router.refresh();
  }

  async function handleUpdate(id: string, data: SkillFileInput) {
    await updateSkillFile(id, data);
    setEditingId(null);
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta skill?")) return;
    await deleteSkillFile(id);
    router.refresh();
  }

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary">Skill</h2>
        <button
          type="button"
          onClick={() => setCreating((c) => !c)}
          className="rounded border border-accent px-3 py-1 text-sm text-accent hover:bg-accent hover:text-white"
        >
          {creating ? "Cancelar" : "Nueva"}
        </button>
      </div>

      {creating && (
        <SkillFileForm initial={emptySkillFile()} onSave={handleCreate} onCancel={() => setCreating(false)} />
      )}

      <div className="mt-3 flex flex-col gap-3">
        {items.map((item) => (
          <div key={item.id} className="rounded border-l-4 border-accent bg-card p-4">
            {editingId === item.id ? (
              <SkillFileForm
                initial={item}
                onSave={(data) => handleUpdate(item.id, data)}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <>
                <h3 className="font-medium text-text-primary">{item.title}</h3>
                <p className="mt-1 truncate text-sm text-text-secondary">{item.download_url}</p>
                <div className="mt-3 flex gap-3 text-sm">
                  <button
                    type="button"
                    onClick={() => setEditingId(item.id)}
                    className="text-accent hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="text-red-400 hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
        {items.length === 0 && !creating && (
          <p className="text-sm text-text-secondary">Nada todavía.</p>
        )}
      </div>
    </section>
  );
}

export default function ResourceManager({
  editionId,
  catalog,
  templates,
  skillFiles,
}: {
  editionId: string;
  catalog: Resource[];
  templates: Resource[];
  skillFiles: SkillFile[];
}) {
  return (
    <div className="flex max-w-2xl flex-col gap-10">
      <ResourceListSection title="Catálogo" type="catalog_item" items={catalog} editionId={editionId} />
      <ResourceListSection title="Plantillas" type="template" items={templates} editionId={editionId} />
      <SkillSection items={skillFiles} editionId={editionId} />
    </div>
  );
}
