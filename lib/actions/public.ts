"use server";

import { prisma } from "@/lib/prisma";

export async function getActiveEditions() {
  return prisma.edition.findMany({
    where: { is_active: true },
    orderBy: { start_date: "desc" },
    select: { id: true, name: true, start_date: true, end_date: true },
  });
}

export async function createStudent(editionId: string, name: string) {
  const trimmed = name.trim();
  if (!trimmed) {
    throw new Error("El nombre no puede estar vacío.");
  }
  const edition = await prisma.edition.findUnique({ where: { id: editionId } });
  if (!edition || !edition.is_active) {
    throw new Error("Edición no encontrada.");
  }
  const student = await prisma.student.create({
    data: { edition_id: editionId, name: trimmed },
  });
  return student;
}

export async function getStudentSession(studentId: string) {
  if (!studentId) return null;
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      edition: { select: { id: true, name: true, is_active: true } },
    },
  });
  if (!student) return null;
  return student;
}

export async function getEditionBundle(editionId: string) {
  const [edition, days, resources, skillFiles] = await Promise.all([
    prisma.edition.findUnique({ where: { id: editionId } }),
    prisma.day.findMany({
      where: { edition_id: editionId },
      orderBy: { day_number: "asc" },
    }),
    prisma.resource.findMany({
      where: { edition_id: editionId },
      orderBy: [{ sort_order: "asc" }, { title: "asc" }],
    }),
    prisma.skillFile.findMany({
      where: { edition_id: editionId },
    }),
  ]);

  if (!edition) return null;

  return {
    edition,
    days,
    catalog: resources.filter((r) => r.type === "catalog_item"),
    templates: resources.filter((r) => r.type === "template"),
    skillFiles,
  };
}

export async function getProgressForStudent(studentId: string) {
  const progress = await prisma.progress.findMany({
    where: { student_id: studentId },
    select: { day_id: true, completed_at: true },
  });
  return progress;
}

export async function markDayComplete(studentId: string, dayId: string) {
  const day = await prisma.day.findUnique({ where: { id: dayId } });
  if (!day || !day.is_unlocked) {
    throw new Error("Este día no está disponible todavía.");
  }
  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student || student.edition_id !== day.edition_id) {
    throw new Error("Alumno no válido para esta edición.");
  }

  await prisma.progress.upsert({
    where: { student_id_day_id: { student_id: studentId, day_id: dayId } },
    update: {},
    create: { student_id: studentId, day_id: dayId },
  });

  return { ok: true };
}

export async function getDayForStudent(studentId: string, dayNumber: number) {
  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) {
    throw new Error("Alumno no válido.");
  }
  const day = await prisma.day.findUnique({
    where: { edition_id_day_number: { edition_id: student.edition_id, day_number: dayNumber } },
  });
  if (!day) return null;

  const progress = await prisma.progress.findUnique({
    where: { student_id_day_id: { student_id: studentId, day_id: day.id } },
  });

  return { day, completed: Boolean(progress) };
}
