import fs from "fs-extra";
import path from "path";

export async function normalize(dir: string) {
  await fs.remove(path.join(dir, "node_modules"));
  await fs.remove(path.join(dir, ".git"));

  const files: Record<string, string> = {};

  async function walk(current: string) {
    const entries = await fs.readdir(current);
    for (const entry of entries) {
      const full = path.join(current, entry);
      const stat = await fs.stat(full);

      if (stat.isDirectory()) {
        await walk(full);
      } else {
        const relative = path.relative(dir, full);
        files[relative] = await fs.readFile(full, "utf-8");
      }
    }
  }

  await walk(dir);
  return files;
}