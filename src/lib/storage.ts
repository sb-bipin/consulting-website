import fs from "node:fs/promises";
import path from "node:path";

export const resumeDir = path.join(
  process.cwd(),
  "public",
  "uploads",
  "resumes"
);

export async function deleteResume(resumeUrl?: string | null): Promise<void> {
  if (!resumeUrl || !resumeUrl.startsWith("/uploads/resumes/")) return;
  const filename = path.basename(resumeUrl);
  try {
    await fs.unlink(path.join(resumeDir, filename));
  } catch {
    // file already gone - nothing to do
  }
}

export async function listResumes(): Promise<string[]> {
  try {
    const files = await fs.readdir(resumeDir);
    return files.filter((f) => f !== ".gitkeep");
  } catch {
    return [];
  }
}

export async function removeResumesNotIn(used: Set<string>): Promise<number> {
  const files = await listResumes();
  let removed = 0;
  for (const file of files) {
    if (used.has(file)) continue;
    try {
      await fs.unlink(path.join(resumeDir, file));
      removed += 1;
    } catch {
      // ignore failures on individual files
    }
  }
  return removed;
}
