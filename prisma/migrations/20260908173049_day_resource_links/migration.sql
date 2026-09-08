-- CreateTable
CREATE TABLE "_DayToResource" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_DayToSkillFile" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_DayToResource_AB_unique" ON "_DayToResource"("A", "B");

-- CreateIndex
CREATE INDEX "_DayToResource_B_index" ON "_DayToResource"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DayToSkillFile_AB_unique" ON "_DayToSkillFile"("A", "B");

-- CreateIndex
CREATE INDEX "_DayToSkillFile_B_index" ON "_DayToSkillFile"("B");

-- AddForeignKey
ALTER TABLE "_DayToResource" ADD CONSTRAINT "_DayToResource_A_fkey" FOREIGN KEY ("A") REFERENCES "days"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DayToResource" ADD CONSTRAINT "_DayToResource_B_fkey" FOREIGN KEY ("B") REFERENCES "resources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DayToSkillFile" ADD CONSTRAINT "_DayToSkillFile_A_fkey" FOREIGN KEY ("A") REFERENCES "days"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DayToSkillFile" ADD CONSTRAINT "_DayToSkillFile_B_fkey" FOREIGN KEY ("B") REFERENCES "skill_files"("id") ON DELETE CASCADE ON UPDATE CASCADE;
