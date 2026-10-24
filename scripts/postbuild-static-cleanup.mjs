console.log("postbuild-static-cleanup: preserved Next runtime for Vercel Analytics and client stats");
// Next copies public verbatim. Keep local video backups out of the deployable export.
const { readdirSync, rmSync } = await import('node:fs');
for (const name of readdirSync('out/media/hero')) {
  if (/\.(orig|shrink)\./.test(name)) rmSync(`out/media/hero/${name}`);
}
await import('./sitemap-lastmod.mjs');
