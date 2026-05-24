import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = fileURLToPath(new URL("../out/", import.meta.url));

async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* htmlFiles(full);
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      yield full;
    }
  }
}

function stripRuntime(html) {
  return html
    .replace(/<link[^>]+rel="preload"[^>]+as="script"[^>]*>/g, "")
    .replace(/<script[^>]+src="\/_next\/static\/chunks\/[^"]+"[^>]*><\/script>/g, "")
    .replace(/<script[^>]+src="\/_next\/static\/[^"]+"[^>]*><\/script>/g, "")
    .replace(/<script>\s*\(self\.__next_[\s\S]*?<\/script>/g, "")
    .replace(/<script>\s*self\.__next_[\s\S]*?<\/script>/g, "");
}

let cleaned = 0;
for await (const file of htmlFiles(outDir)) {
  const before = await readFile(file, "utf8");
  const after = stripRuntime(before);
  if (after !== before) {
    await writeFile(file, after, "utf8");
    cleaned += 1;
  }
}

console.log(`postbuild-static-cleanup: stripped Next runtime from ${cleaned} HTML files`);
