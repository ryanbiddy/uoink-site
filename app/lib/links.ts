export const INSTALLER_URL = "https://github.com/ryanbiddy/uoink/releases/latest/download/Uoink-Setup.exe";
export const CWS_URL = "";
export const INSTALLER_PUBLISHED = false;

export function applySiteLinks(html: string): string {
  const extensionCta = CWS_URL
    ? `class="btn ghost large" href="${CWS_URL}"`
    : `class="btn ghost large disabled" href="#" aria-disabled="true"`;
  const extensionSmallCta = CWS_URL
    ? `class="btn ghost small" href="${CWS_URL}"`
    : `class="btn ghost small disabled" href="#" aria-disabled="true"`;
  const extensionTextLink = CWS_URL
    ? `class="arr-link" href="${CWS_URL}"`
    : `class="arr-link disabled" href="#" aria-disabled="true"`;

  return html
    .replace(/href="https:\/\/github\.com\/ryanbiddy\/uoink\/releases\/latest"/g, `href="${INSTALLER_URL}"`)
    .replace(/href="\/install">[^<]*Download for Windows/g, `href="${INSTALLER_URL}">Download for Windows`)
    .replace(/class="btn ghost large" href="#extension">[^<]*Sideload the extension[^<]*/g, `${extensionCta}>Chrome Web Store coming soon`)
    .replace(/class="arr-link" href="https:\/\/github\.com\/ryanbiddy\/uoink#sideload">[^<]*Sideload guide[^<]*/g, `${extensionTextLink}>Chrome Web Store coming soon`)
    .replace(/class="btn ghost small" href="https:\/\/github\.com\/ryanbiddy\/uoink#sideload">[^<]*Sideload now[^<]*/g, `${extensionSmallCta}>Chrome Web Store coming soon`)
    .replace(/class="btn ghost small" href="\/install#extension">[^<]*Sideload now[^<]*/g, `${extensionSmallCta}>Chrome Web Store coming soon`);
}
