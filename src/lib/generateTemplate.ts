import { execa } from "execa";
import fs from "fs-extra";
import path from "path";
import os from "os";

export async function generateTemplate(framework: string) {
  const projectName = `vibe-${framework}-${Date.now()}`;
  const tempDir = path.join(os.tmpdir(), projectName);

  await fs.ensureDir(tempDir);

  const commonOptions = {
    cwd: os.tmpdir(),
    stdio: 'pipe' as const
  };

  switch (framework) {
    case "react":
      // create-vite prompts interactively (e.g., "Use rolldown-vite (Experimental)?").
      // Run non-interactively by piping stdin and sending a newline to accept the default.
      await execa(
        "npm",
        ["create", "vite@latest", projectName, "--", "--template", "react"],
        { ...commonOptions, input: "\n" }
      );
      break;

    case "next":
      await execa(
        "npx",
        [
          "create-next-app@latest",
          projectName,
          "--ts",
          "--app",
          "--no-tailwind",
          "--no-eslint",
          "--use-npm",
          "--yes"
        ],
        commonOptions
      );
      break;

    case "vue":
      await execa(
        "npm",
        ["create", "vue@latest", projectName, "--", "--default", "--yes"],
        commonOptions
      );
      break;

    case "express":
      await execa(
        "npx",
        ["express-generator", projectName, "--no-view"],
        commonOptions
      );
      break;

    case "hono":
      await execa(
        "npm",
        ["create", "hono@latest", projectName, "--", "--yes"],
        commonOptions
      );
      break;

    case "angular":
      await execa(
        "npx",
        [
          "@angular/cli@latest",
          "new",
          projectName,
          "--standalone",
          "--skip-tests",
          "--skip-install",
          "--routing=false",
          "--style=css"
        ],
        commonOptions
      );
      break;

    default:
      throw new Error("Unsupported framework");
  }

  return tempDir;
}
