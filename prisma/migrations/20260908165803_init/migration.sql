-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('catalog_item', 'template');

-- CreateTable
CREATE TABLE "editions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "editions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "days" (
    "id" TEXT NOT NULL,
    "edition_id" TEXT NOT NULL,
    "day_number" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "time_estimate_minutes" INTEGER,
    "is_live_session" BOOLEAN NOT NULL DEFAULT false,
    "live_session_label" TEXT,
    "is_unlocked" BOOLEAN NOT NULL DEFAULT false,
    "why_today" TEXT,
    "action_html" TEXT,
    "proof_required" TEXT,
    "note_html" TEXT,
    "audio_url" TEXT,
    "video_url" TEXT,

    CONSTRAINT "days_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "id" TEXT NOT NULL,
    "edition_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "progress" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "day_id" TEXT NOT NULL,
    "completed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resources" (
    "id" TEXT NOT NULL,
    "edition_id" TEXT NOT NULL,
    "type" "ResourceType" NOT NULL,
    "title" TEXT NOT NULL,
    "content_html" TEXT NOT NULL,
    "price_range" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skill_files" (
    "id" TEXT NOT NULL,
    "edition_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "download_url" TEXT NOT NULL,
    "instructions_html" TEXT NOT NULL,

    CONSTRAINT "skill_files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "days_edition_id_idx" ON "days"("edition_id");

-- CreateIndex
CREATE UNIQUE INDEX "days_edition_id_day_number_key" ON "days"("edition_id", "day_number");

-- CreateIndex
CREATE INDEX "students_edition_id_idx" ON "students"("edition_id");

-- CreateIndex
CREATE INDEX "progress_day_id_idx" ON "progress"("day_id");

-- CreateIndex
CREATE UNIQUE INDEX "progress_student_id_day_id_key" ON "progress"("student_id", "day_id");

-- CreateIndex
CREATE INDEX "resources_edition_id_idx" ON "resources"("edition_id");

-- CreateIndex
CREATE INDEX "skill_files_edition_id_idx" ON "skill_files"("edition_id");

-- AddForeignKey
ALTER TABLE "days" ADD CONSTRAINT "days_edition_id_fkey" FOREIGN KEY ("edition_id") REFERENCES "editions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_edition_id_fkey" FOREIGN KEY ("edition_id") REFERENCES "editions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progress" ADD CONSTRAINT "progress_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progress" ADD CONSTRAINT "progress_day_id_fkey" FOREIGN KEY ("day_id") REFERENCES "days"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resources" ADD CONSTRAINT "resources_edition_id_fkey" FOREIGN KEY ("edition_id") REFERENCES "editions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skill_files" ADD CONSTRAINT "skill_files_edition_id_fkey" FOREIGN KEY ("edition_id") REFERENCES "editions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
