import { generateTemplate } from "@/lib/generateTemplate";
import { scanTemplateDirectory } from "@/modules/playground/lib/initialFolder-to-json";
import fs from "fs-extra";
import { NextResponse } from "next/server"; 

export async function POST(req: Request) {
  const { framework } = await req.json();

  console.log(`[api] /api/template POST received, framework=${framework}`);

  let dir: string | undefined;

  try {
    if (!framework) {
      throw new Error("Framework parameter is required");
    }

    dir = await generateTemplate(framework);
    console.log(`[api] template created at ${dir}`);

    // Scan the template directory and convert to TemplateFolder JSON structure
    const templateJson = await scanTemplateDirectory(dir);
    console.log(`[api] template scanned successfully`);

    return NextResponse.json({ framework, templateJson });
  } catch (err: any) {
    const message = err?.message || String(err);
    console.error(`[api] template generation failed:`, err);
    console.error(`[api] error message: ${message}`);
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    if (dir) {
      try {
        console.log(`[api] cleaning up temp directory: ${dir}`);
        await fs.remove(dir);
      } catch (cleanupErr) {
        console.error(`[api] cleanup error (non-fatal):`, cleanupErr);
      }
    }
  }
}
