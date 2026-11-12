import flags from "../../content/flags.json";

// Phones and tablets can't run the installer. Wherever a download button shows up,
// phone visitors get this block instead. The markup is plain HTML so the home hero
// (an HTML string) and the React pages share it. app/phone.css shows it on phones
// and hides the installer links, with no JavaScript needed; PhoneGate.tsx adds the
// share button and a second, UA-based check.

export const PHONE_SHARE_URL = "https://uoink.app/install";
export const PHONE_MAIL_SUBJECT = "Install Uoink on my computer";
export const PHONE_MAIL_BODY = `Open this on my computer: ${PHONE_SHARE_URL}`;

// Runs in <head> before paint: marks the page as a phone or tablet (iPadOS asks for
// the desktop site, so it reports Macintosh plus touch points).
export const PHONE_CLASS_SCRIPT = `(function(){try{var n=navigator,u=n.userAgent||'';var p=/iPhone|iPad|iPod|Android/i.test(u)||(/Macintosh/.test(u)&&n.maxTouchPoints>1);if(p)document.documentElement.classList.add('is-phone');}catch(e){}})();`;

export const PHONE_INBOX_ENABLED = flags.phoneInbox.enabled === true;
export const CHROME_STORE_URL = flags.addToChrome.enabled === true && flags.addToChrome.url ? flags.addToChrome.url : "";
export const NPX_COMMAND = flags.npx.enabled === true ? flags.npx.command : "";

export function phoneBlockHtml(): string {
  const mailto = `mailto:?subject=${encodeURIComponent(PHONE_MAIL_SUBJECT)}&body=${encodeURIComponent(PHONE_MAIL_BODY)}`;
  const inbox = PHONE_INBOX_ENABLED
    ? `<p class="phone-block-inbox">After you install, Uoink has a phone inbox. Share links from your phone to your computer. <a href="/install#phone-inbox">How it works</a></p>`
    : "";
  return `<div class="phone-block" role="region" data-phone-block aria-label="Uoink runs on your computer">
<h2 class="phone-block-title">Uoink runs on your computer</h2>
<p class="phone-block-line">It saves to your own disk, and your AI reads it there. A phone can't run it, so send yourself the link and open it on your computer.</p>
${inbox}
<div class="phone-block-actions">
<button type="button" class="btn primary" data-phone-share hidden>Send me the link</button>
<a class="btn ghost" data-phone-mail href="${mailto}">Email it to me</a>
</div>
<p class="phone-block-status" data-phone-status role="status" aria-live="polite"></p>
</div>`;
}
