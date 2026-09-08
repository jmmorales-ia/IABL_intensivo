import { listEditions, getSelectedEditionId } from "@/lib/actions/admin";
import AdminNav from "@/components/admin/AdminNav";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const [editions, selectedId] = await Promise.all([listEditions(), getSelectedEditionId()]);

  return (
    <div className="flex min-h-screen flex-col bg-bg md:flex-row">
      <AdminNav
        editions={editions.map((e) => ({ id: e.id, name: e.name, is_active: e.is_active }))}
        selectedId={selectedId}
      />
      <div className="flex-1 px-6 py-6 md:px-10 md:py-8">{children}</div>
    </div>
  );
}
