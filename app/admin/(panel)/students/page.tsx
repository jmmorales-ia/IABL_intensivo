import { listStudentsWithProgress, getSelectedEditionId } from "@/lib/actions/admin";
import StudentsTable from "@/components/admin/StudentsTable";

export default async function AdminStudentsPage() {
  const editionId = await getSelectedEditionId();

  if (!editionId) {
    return <p className="text-text-secondary">No hay ninguna edición creada todavía.</p>;
  }

  const students = await listStudentsWithProgress(editionId);

  return (
    <div>
      <h1 className="text-xl font-semibold text-text-primary">Alumnos</h1>
      <p className="mt-1 text-sm text-text-secondary">
        Progreso de cada alumno en la edición seleccionada.
      </p>
      <div className="mt-6">
        <StudentsTable students={students} />
      </div>
    </div>
  );
}
