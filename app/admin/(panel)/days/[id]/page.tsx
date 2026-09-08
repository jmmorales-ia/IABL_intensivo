import Link from "next/link";
import { notFound } from "next/navigation";
import { getDay, listResources, listSkillFiles } from "@/lib/actions/admin";
import DayEditForm from "@/components/admin/DayEditForm";

export default async function AdminDayEditPage({ params }: { params: { id: string } }) {
  const day = await getDay(params.id);

  if (!day) {
    notFound();
  }

  const [resources, skillFiles] = await Promise.all([
    listResources(day.edition_id),
    listSkillFiles(day.edition_id),
  ]);

  return (
    <div>
      <Link href="/admin/days" className="text-sm text-text-secondary hover:text-accent">
        &larr; Días
      </Link>
      <h1 className="mt-2 text-xl font-semibold text-text-primary">
        Día {day.day_number} · {day.title}
      </h1>
      <div className="mt-6">
        <DayEditForm day={day} availableResources={resources} availableSkillFiles={skillFiles} />
      </div>
    </div>
  );
}
