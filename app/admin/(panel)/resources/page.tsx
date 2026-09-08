import { listResources, listSkillFiles, getSelectedEditionId } from "@/lib/actions/admin";
import ResourceManager from "@/components/admin/ResourceManager";

export default async function AdminResourcesPage() {
  const editionId = await getSelectedEditionId();

  if (!editionId) {
    return <p className="text-text-secondary">No hay ninguna edición creada todavía.</p>;
  }

  const [resources, skillFiles] = await Promise.all([
    listResources(editionId),
    listSkillFiles(editionId),
  ]);

  const catalog = resources.filter((r) => r.type === "catalog_item");
  const templates = resources.filter((r) => r.type === "template");

  return (
    <div>
      <h1 className="text-xl font-semibold text-text-primary">Recursos</h1>
      <p className="mt-1 text-sm text-text-secondary">
        Catálogo, plantillas y skill de la edición seleccionada.
      </p>
      <div className="mt-6">
        <ResourceManager
          editionId={editionId}
          catalog={catalog}
          templates={templates}
          skillFiles={skillFiles}
        />
      </div>
    </div>
  );
}
