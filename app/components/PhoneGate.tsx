"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { PHONE_SHARE_URL } from "../content/phone";

// Phone and tablet handling that needs JavaScript. The CSS in app/phone.css already
// hides installer links and shows the phone block on touch devices; this adds:
//  - the is-phone class (also set before paint by PHONE_CLASS_SCRIPT in the layout head),
//  - the Send me the link button (native share sheet, copy-link fallback),
//  - removal of the href from installer links, so nothing is tappable even if the
//    CSS media query didn't match (a desktop browser pretending to be a phone).
// No tracking: nothing is sent anywhere.

const INSTALLER = 'a[href^="https://usage.uoink.app/get/"], a[href*="/releases/download"], a[href$="/releases/latest"]';

function isPhone(): boolean {
  return document.documentElement.classList.contains("is-phone") || window.matchMedia("(hover: none) and (pointer: coarse)").matches;
}

function copyText(text: string): Promise<boolean> {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text).then(
      () => true,
      () => legacyCopy(text),
    );
  }
  return Promise.resolve(legacyCopy(text));
}

function legacyCopy(text: string): boolean {
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  document.body.removeChild(area);
  return ok;
}

function say(button: Element, message: string) {
  const status = button.closest("[data-phone-block]")?.querySelector("[data-phone-status]");
  if (status) status.textContent = message;
}

function onClick(event: Event) {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const button = target.closest("[data-phone-share]");
  if (!button) return;
  event.preventDefault();
  const nav = navigator as Navigator & { share?: (data: ShareData) => Promise<void> };
  const fallback = () =>
    copyText(PHONE_SHARE_URL).then((ok) => say(button, ok ? "Link copied. Open it on your computer." : `Open ${PHONE_SHARE_URL} on your computer.`));
  if (nav.share) {
    nav
      .share({ title: "Uoink", text: "Install Uoink on your computer", url: PHONE_SHARE_URL })
      .then(() => say(button, "Sent. Open it on your computer."))
      .catch((error: unknown) => {
        if (error && (error as { name?: string }).name === "AbortError") return;
        return fallback();
      });
  } else {
    void fallback();
  }
}

export function PhoneGate() {
  const pathname = usePathname();

  useEffect(() => {
    if (isPhone()) document.documentElement.classList.add("is-phone");
    document.querySelectorAll<HTMLElement>("[data-phone-share]").forEach((el) => {
      el.hidden = false;
    });
    if (!isPhone()) return;
    document.querySelectorAll<HTMLAnchorElement>(INSTALLER).forEach((a) => {
      a.removeAttribute("href");
      a.setAttribute("aria-hidden", "true");
      a.tabIndex = -1;
    });
  }, [pathname]);

  useEffect(() => {
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
