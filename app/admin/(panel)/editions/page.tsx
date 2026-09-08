import { listEditions } from "@/lib/actions/admin";
import EditionManager from "@/components/admin/EditionManager";

export default async function AdminEditionsPage() {
  const editions = await listEditions();

  return (
    <div>
      <h1 className="text-xl font-semibold text-text-primary">Ediciones</h1>
      <p className="mt-1 text-sm text-text-secondary">
        Activa o desactiva ediciones y crea nuevas clonando una existente.
      </p>
      <div className="mt-6">
        <EditionManager editions={editions} />
      </div>
    </div>
  );
}
