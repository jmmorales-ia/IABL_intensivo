import { listDays, getSelectedEditionId } from "@/lib/actions/admin";
import DaysTable from "@/components/admin/DaysTable";

export default async function AdminDaysPage() {
  const editionId = await getSelectedEditionId();

  if (!editionId) {
    return <p className="text-text-secondary">No hay ninguna edición creada todavía.</p>;
  }

  const days = await listDays(editionId);

  return (
    <div>
      <h1 className="text-xl font-semibold text-text-primary">Días</h1>
      <p className="mt-1 text-sm text-text-secondary">
        Desbloquea cada día cuando toque y edita su contenido.
      </p>
      <div className="mt-6">
        <DaysTable days={days} />
      </div>
    </div>
  );
}
