"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  ADMIN_COOKIE_NAME,
  ADMIN_COOKIE_MAX_AGE_SECONDS,
  createSessionToken,
  verifySessionToken,
} from "@/lib/auth";
import type { ResourceType } from "@prisma/client";

async function assertAdmin() {
  const token = cookies().get(ADMIN_COOKIE_NAME)?.value;
  const valid = await verifySessionToken(token);
  if (!valid) {
    throw new Error("No autorizado.");
  }
}

const SELECTED_EDITION_COOKIE = "iabl_admin_edition";

export async function setSelectedEditionId(editionId: string) {
  await assertAdmin();
  cookies().set(SELECTED_EDITION_COOKIE, editionId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  revalidatePath("/admin", "layout");
}

export async function getSelectedEditionId(): Promise<string | null> {
  await assertAdmin();
  const cookieValue = cookies().get(SELECTED_EDITION_COOKIE)?.value;
  if (cookieValue) {
    const exists = await prisma.edition.findUnique({ where: { id: cookieValue } });
    if (exists) return exists.id;
  }
  const mostRecent = await prisma.edition.findFirst({ orderBy: { start_date: "desc" } });
  return mostRecent?.id ?? null;
}

// ---------- Auth ----------

export async function loginAdmin(password: string): Promise<{ ok: boolean; error?: string }> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return { ok: false, error: "ADMIN_PASSWORD no está configurada en el servidor." };
  }
  if (password !== expected) {
    return { ok: false, error: "Contraseña incorrecta." };
  }
  const token = await createSessionToken();
  cookies().set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: ADMIN_COOKIE_MAX_AGE_SECONDS,
    path: "/",
  });
  return { ok: true };
}

export async function logoutAdmin() {
  cookies().delete(ADMIN_COOKIE_NAME);
}

// ---------- Ediciones ----------

export async function listEditions() {
  await assertAdmin();
  return prisma.edition.findMany({
    orderBy: { start_date: "desc" },
    include: { _count: { select: { days: true, students: true } } },
  });
}

export async function getEdition(editionId: string) {
  await assertAdmin();
  return prisma.edition.findUnique({ where: { id: editionId } });
}

export async function setEditionActive(editionId: string, isActive: boolean) {
  await assertAdmin();
  await prisma.edition.update({ where: { id: editionId }, data: { is_active: isActive } });
  revalidatePath("/admin/editions");
}

export async function updateEditionMeta(
  editionId: string,
  data: { name: string; start_date: string; end_date: string }
) {
  await assertAdmin();
  await prisma.edition.update({
    where: { id: editionId },
    data: {
      name: data.name,
      start_date: new Date(data.start_date),
      end_date: new Date(data.end_date),
    },
  });
  revalidatePath("/admin/editions");
}

export async function cloneEdition(
  sourceEditionId: string,
  data: { name: string; start_date: string; end_date: string; is_active: boolean }
) {
  await assertAdmin();

  const source = await prisma.edition.findUnique({
    where: { id: sourceEditionId },
    include: { days: true, resources: true, skill_files: true },
  });
  if (!source) {
    throw new Error("Edición de origen no encontrada.");
  }

  const newStart = new Date(data.start_date);

  const newEdition = await prisma.edition.create({
    data: {
      name: data.name,
      start_date: newStart,
      end_date: new Date(data.end_date),
      is_active: data.is_active,
    },
  });

  if (source.days.length > 0) {
    await prisma.day.createMany({
      data: source.days.map((day) => {
        const date = new Date(newStart);
        date.setDate(date.getDate() + (day.day_number - 1));
        return {
          edition_id: newEdition.id,
          day_number: day.day_number,
          date,
          title: day.title,
          time_estimate_minutes: day.time_estimate_minutes,
          is_live_session: day.is_live_session,
          live_session_label: day.live_session_label,
          is_unlocked: false,
          why_today: day.why_today,
          action_html: day.action_html,
          proof_required: day.proof_required,
          note_html: day.note_html,
        };
      }),
    });
  }

  if (source.resources.length > 0) {
    await prisma.resource.createMany({
      data: source.resources.map((r) => ({
        edition_id: newEdition.id,
        type: r.type,
        title: r.title,
        content_html: r.content_html,
        price_range: r.price_range,
        sort_order: r.sort_order,
      })),
    });
  }

  if (source.skill_files.length > 0) {
    await prisma.skillFile.createMany({
      data: source.skill_files.map((s) => ({
        edition_id: newEdition.id,
        title: s.title,
        download_url: s.download_url,
        instructions_html: s.instructions_html,
      })),
    });
  }

  revalidatePath("/admin/editions");
  return newEdition;
}

// ---------- Días ----------

export async function listDays(editionId: string) {
  await assertAdmin();
  return prisma.day.findMany({
    where: { edition_id: editionId },
    orderBy: { day_number: "asc" },
  });
}

export async function getDay(dayId: string) {
  await assertAdmin();
  return prisma.day.findUnique({ where: { id: dayId } });
}

export async function toggleDayLock(dayId: string) {
  await assertAdmin();
  const day = await prisma.day.findUnique({ where: { id: dayId } });
  if (!day) throw new Error("Día no encontrado.");
  await prisma.day.update({ where: { id: dayId }, data: { is_unlocked: !day.is_unlocked } });
  revalidatePath("/admin/days");
}

export interface DayUpdateInput {
  date: string;
  title: string;
  time_estimate_minutes: number | null;
  is_live_session: boolean;
  live_session_label: string | null;
  is_unlocked: boolean;
  why_today: string | null;
  action_html: string | null;
  proof_required: string | null;
  note_html: string | null;
}

export async function updateDay(dayId: string, data: DayUpdateInput) {
  await assertAdmin();
  await prisma.day.update({
    where: { id: dayId },
    data: {
      date: new Date(data.date),
      title: data.title,
      time_estimate_minutes: data.time_estimate_minutes,
      is_live_session: data.is_live_session,
      live_session_label: data.live_session_label || null,
      is_unlocked: data.is_unlocked,
      why_today: data.why_today || null,
      action_html: data.action_html || null,
      proof_required: data.proof_required || null,
      note_html: data.note_html || null,
    },
  });
  revalidatePath("/admin/days");
  revalidatePath(`/admin/days/${dayId}`);
}

// ---------- Alumnos ----------

export async function listStudentsWithProgress(editionId: string) {
  await assertAdmin();
  const [students, totalUnlockedDays] = await Promise.all([
    prisma.student.findMany({
      where: { edition_id: editionId },
      include: {
        progress: {
          select: { completed_at: true, day: { select: { day_number: true } } },
          orderBy: { completed_at: "desc" },
        },
      },
      orderBy: { created_at: "asc" },
    }),
    prisma.day.count({ where: { edition_id: editionId, is_unlocked: true } }),
  ]);

  return students
    .map((s) => ({
      id: s.id,
      name: s.name,
      created_at: s.created_at,
      completedCount: s.progress.length,
      lastCompletedAt: s.progress[0]?.completed_at ?? null,
      lastCompletedDayNumber: s.progress[0]?.day.day_number ?? null,
      totalUnlockedDays,
    }))
    .sort((a, b) => b.completedCount - a.completedCount);
}

// ---------- Recursos (catálogo y plantillas) ----------

export async function listResources(editionId: string) {
  await assertAdmin();
  return prisma.resource.findMany({
    where: { edition_id: editionId },
    orderBy: [{ type: "asc" }, { sort_order: "asc" }],
  });
}

export interface ResourceInput {
  type: ResourceType;
  title: string;
  content_html: string;
  price_range: string | null;
  sort_order: number;
}

export async function createResource(editionId: string, data: ResourceInput) {
  await assertAdmin();
  await prisma.resource.create({
    data: {
      edition_id: editionId,
      type: data.type,
      title: data.title,
      content_html: data.content_html,
      price_range: data.type === "catalog_item" ? data.price_range : null,
      sort_order: data.sort_order,
    },
  });
  revalidatePath("/admin/resources");
}

export async function updateResource(resourceId: string, data: ResourceInput) {
  await assertAdmin();
  await prisma.resource.update({
    where: { id: resourceId },
    data: {
      type: data.type,
      title: data.title,
      content_html: data.content_html,
      price_range: data.type === "catalog_item" ? data.price_range : null,
      sort_order: data.sort_order,
    },
  });
  revalidatePath("/admin/resources");
}

export async function deleteResource(resourceId: string) {
  await assertAdmin();
  await prisma.resource.delete({ where: { id: resourceId } });
  revalidatePath("/admin/resources");
}

// ---------- Skill files ----------

export async function listSkillFiles(editionId: string) {
  await assertAdmin();
  return prisma.skillFile.findMany({ where: { edition_id: editionId } });
}

export interface SkillFileInput {
  title: string;
  download_url: string;
  instructions_html: string;
}

export async function createSkillFile(editionId: string, data: SkillFileInput) {
  await assertAdmin();
  await prisma.skillFile.create({ data: { edition_id: editionId, ...data } });
  revalidatePath("/admin/resources");
}

export async function updateSkillFile(skillFileId: string, data: SkillFileInput) {
  await assertAdmin();
  await prisma.skillFile.update({ where: { id: skillFileId }, data });
  revalidatePath("/admin/resources");
}

export async function deleteSkillFile(skillFileId: string) {
  await assertAdmin();
  await prisma.skillFile.delete({ where: { id: skillFileId } });
  revalidatePath("/admin/resources");
}
