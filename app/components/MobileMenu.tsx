"use client";

import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Burger + full-screen sheet. TopNav renders inside each page, so this
// remounts on client-side navigation and the menu keeps working on every
// route. Traps focus, closes on Escape or a link tap, restores focus to the
// burger and locks page scroll while open.
export function MobileMenu({ wordmark, children }: { wordmark: ReactNode; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const menu = menuRef.current;
    if (!open || !menu) return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    const focusables = () => Array.from(menu.querySelectorAll<HTMLElement>(FOCUSABLE));

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        burgerRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    body.style.overflow = "hidden";
    focusables()[0]?.focus();
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      body.style.overflow = previousOverflow;
    };
  }, [open]);

  function close() {
    setOpen(false);
    burgerRef.current?.focus();
  }

  function closeOnLink(event: MouseEvent<HTMLDivElement>) {
    if (event.target instanceof Element && event.target.closest("a")) close();
  }

  return (
    <>
      <button
        ref={burgerRef}
        className="nav-burger"
        type="button"
        data-nav-burger
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(true)}
      >
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <path d="M3 6h14M3 10h14M3 14h14" />
        </svg>
      </button>
      <div
        ref={menuRef}
        id="mobile-menu"
        className={open ? "mobile-menu open" : "mobile-menu"}
        data-mobile-menu
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!open}
        onClick={closeOnLink}
      >
        <div className="mobile-menu-head">
          <span aria-hidden="true">{wordmark}</span>
          <button className="close" type="button" data-nav-close aria-label="Close menu" onClick={close}>
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </>
  );
}
