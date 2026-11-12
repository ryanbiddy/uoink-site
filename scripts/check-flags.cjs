// Checks content/flags.json and what the static export shows for each flag.
//   node scripts/check-flags.cjs            source rules only
//   node scripts/check-flags.cjs --static   also checks out/ (run after the build)
//   node scripts/check-flags.cjs --expect-off  fail if ANY flag is on (use before the release pass)
// Default state: every flag is off, and nothing flagged appears in the built pages.
// Flipping a flag is a content/flags.json edit; see README notes in the PR.
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const flags = JSON.parse(fs.readFileSync(path.join(root, "content", "flags.json"), "utf8"));
const args = new Set(process.argv.slice(2));
const failures = [];
const fail = (m) => failures.push(m);

const chrome = flags.addToChrome || {};
const npx = flags.npx || {};
const inbox = flags.phoneInbox || {};
for (const [name, f] of Object.entries({ addToChrome: chrome, npx, phoneInbox: inbox })) {
  if (typeof f.enabled !== "boolean") fail(`${name}.enabled must be true or false`);
}

const storeOk = /^https:\/\/(chromewebstore\.google\.com|chrome\.google\.com\/webstore)\//.test(chrome.url || "");
if (chrome.enabled && !storeOk) fail("addToChrome is on but url is not a Chrome Web Store link");
if (!chrome.enabled && chrome.url) fail("addToChrome is off but url is set; turn it on or clear the url");
if (npx.enabled && npx.command !== "npx uoink") fail('npx is on but command is not "npx uoink"');

if (args.has("--expect-off")) {
  if (chrome.enabled) fail("--expect-off: addToChrome is on");
  if (npx.enabled) fail("--expect-off: npx is on");
  if (inbox.enabled) fail("--expect-off: phoneInbox is on");
}

if (args.has("--static")) {
  const out = path.join(root, "out");
  const read = (f) => (fs.existsSync(path.join(out, f)) ? fs.readFileSync(path.join(out, f), "utf8") : null);
  const pages = { home: "index.html", install: "install.html", get: "get.html" };
  for (const [name, file] of Object.entries(pages)) {
    const html = read(file);
    if (html === null) { fail(`out/${file} missing`); continue; }
    if (!html.includes("data-phone-block")) fail(`${name}: phone block missing from the static HTML`);
    if (!html.includes("data-phone-share")) fail(`${name}: Send me the link button missing`);
    if (!/href="mailto:\?subject=/.test(html)) fail(`${name}: mailto link missing or prefilled with an address`);
    if (!html.includes("is-phone")) fail(`${name}: is-phone class script missing`);
    const chromeShown = html.includes("data-flag-chrome");
    const npxShown = html.includes("data-flag-npx");
    if (name !== "home") {
      if (chromeShown !== !!chrome.enabled) fail(`${name}: Add to Chrome is ${chromeShown ? "shown" : "hidden"} but the flag is ${chrome.enabled ? "on" : "off"}`);
      if (npxShown !== !!npx.enabled) fail(`${name}: npx row is ${npxShown ? "shown" : "hidden"} but the flag is ${npx.enabled ? "on" : "off"}`);
    }
  }
  const install = read("install.html") || "";
  const inboxShown = install.includes('id="phone-inbox"');
  if (inboxShown !== !!inbox.enabled) fail(`install: phone inbox section is ${inboxShown ? "shown" : "hidden"} but the flag is ${inbox.enabled ? "on" : "off"}`);
  const home = read("index.html") || "";
  const mentionsInbox = /phone inbox/i.test((home.match(/<div class="phone-block"[\s\S]*?phone-block-status/) || [""])[0]);
  if (mentionsInbox !== !!inbox.enabled) fail(`home: phone block ${mentionsInbox ? "mentions" : "omits"} the phone inbox but the flag is ${inbox.enabled ? "on" : "off"}`);
  if (inbox.enabled === false && chrome.enabled === false && npx.enabled === false) {
    for (const file of ["index.html", "install.html", "get.html"]) {
      const html = read(file) || "";
      if (/Add to Chrome|npx uoink/.test(html)) fail(`${file}: flagged text appears while its flag is off`);
    }
  }
}

if (failures.length) {
  console.error("FAIL check-flags:\n- " + failures.join("\n- "));
  process.exit(1);
}
console.log(`PASS check-flags: addToChrome=${chrome.enabled ? "on" : "off"}, npx=${npx.enabled ? "on" : "off"}, phoneInbox=${inbox.enabled ? "on" : "off"}${args.has("--static") ? "; static pages match" : ""}`);
