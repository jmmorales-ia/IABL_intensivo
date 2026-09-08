"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { setSelectedEditionId, logoutAdmin } from "@/lib/actions/admin";

type EditionOption = { id: string; name: string; is_active: boolean };

const LINKS = [
  { href: "/admin/days", label: "Días" },
  { href: "/admin/students", label: "Alumnos" },
  { href: "/admin/resources", label: "Recursos" },
  { href: "/admin/editions", label: "Ediciones" },
];

export default function AdminNav({
  editions,
  selectedId,
}: {
  editions: EditionOption[];
  selectedId: string | null;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleEditionChange(e: React.ChangeEvent<HTMLSelectElement>) {
    await setSelectedEditionId(e.target.value);
    router.refresh();
  }

  async function handleLogout() {
    await logoutAdmin();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <nav className="flex flex-none flex-col border-b border-white/10 bg-card px-6 py-3 md:min-h-screen md:w-56 md:flex-none md:border-b-0 md:border-r">
      <div className="text-sm font-semibold text-text-primary">IABL · Admin</div>

      <div className="mt-4">
        <label className="block text-xs text-text-secondary">Edición</label>
        <select
          value={selectedId ?? ""}
          onChange={handleEditionChange}
          className="mt-1 w-full rounded border border-white/10 bg-bg px-2 py-1.5 text-sm text-text-primary focus:border-accent focus:outline-none"
        >
          {editions.map((ed) => (
            <option key={ed.id} value={ed.id}>
              {ed.name} {ed.is_active ? "" : "(inactiva)"}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 flex flex-row flex-wrap gap-1 md:flex-col">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded px-3 py-2 text-sm transition ${
              pathname?.startsWith(link.href)
                ? "bg-accent/15 text-accent"
                : "text-text-secondary hover:bg-white/5 hover:text-text-primary"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="mt-6 self-start text-sm text-text-secondary hover:text-red-400 md:mt-auto"
      >
        Cerrar sesión
      </button>
    </nav>
  );
}
