"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { FamilyWordmark } from "./FamilyWordmark";

// WEB-2 family renderer and pointer geometry, without the prototype's GSAP runtime.
export function FamilyStrip() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current!;
    const stage = el.querySelector<HTMLElement>(".family-stage")!;
    const handle = el.querySelector<HTMLElement>(".charge-handle")!;
    const button = el.querySelector<HTMLButtonElement>(".send-charge")!;
    const label = el.querySelector<HTMLElement>(".charge-status")!;
    const u = el.querySelector<SVGElement>('[data-brand="u"]')!;
    const z = el.querySelector<SVGElement>('[data-brand="z"]')!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let caught = false, frame = 0;
    let position = { x: 0, y: 0 };
    let start: { x: number; y: number; px: number; py: number; id: number; moved: boolean } | null = null;

    function points() {
      const s = stage.getBoundingClientRect(), zr = z.getBoundingClientRect(), ur = u.getBoundingClientRect();
      return {
        origin: { x: zr.left - s.left + 4.76 - 24, y: zr.top - s.top + 4.76 - 24 },
        target: { x: ur.left - s.left + 17 - 24, y: ur.top - s.top + 28 - 24 },
      };
    }
    function place(p: typeof position) {
      position = p;
      handle.style.transform = `translate(${p.x}px, ${p.y}px)`;
    }
    function update() {
      handle.setAttribute("aria-valuenow", caught ? "100" : "0");
      handle.setAttribute("aria-valuetext", caught ? "At Uoink" : "At Zing");
      label.textContent = caught ? "A shared charge" : "At Zing";
      button.textContent = caught ? "Send it back" : "Send the charge";
    }
    function settle(animate = true) {
      cancelAnimationFrame(frame);
      const { origin, target } = points(), destination = caught ? target : origin;
      if (!animate || reduced.matches || document.documentElement.dataset.motionPaused === "true") { place(destination); return; }
      const from = { ...position }, began = performance.now(), duration = caught ? 340 : 375;
      function tick(now: number) {
        const t = Math.min(1, (now - began) / duration);
        // back.out(1.2), exactly the smooth pull from the reviewed motion row.
        const eased = caught ? 1 + 2.2 * (t - 1) ** 3 + 1.2 * (t - 1) ** 2 : Math.floor(t * 9) / 9;
        place({ x: from.x + (destination.x - from.x) * eased, y: from.y + (destination.y - from.y) * eased });
        if (t < 1) frame = requestAnimationFrame(tick);
      }
      frame = requestAnimationFrame(tick);
    }
    function send(next = !caught) { start = null; caught = next; update(); settle(); }
    function down(e: PointerEvent) {
      if (!e.isPrimary || e.button !== 0) return;
      cancelAnimationFrame(frame);
      handle.focus({ preventScroll: true });
      start = { x: e.clientX, y: e.clientY, px: position.x, py: position.y, id: e.pointerId, moved: false };
      handle.setPointerCapture(e.pointerId);
    }
    function move(e: PointerEvent) {
      if (!start || start.id !== e.pointerId) return;
      const dx = e.clientX - start.x, dy = e.clientY - start.y;
      start.moved ||= Math.hypot(dx, dy) > 4;
      // Keep the touch target within the strip so a drag cannot widen the page.
      place({ x: Math.max(-24, Math.min(stage.clientWidth - 24, start.px + dx)), y: Math.max(-24, Math.min(stage.clientHeight - 24, start.py + dy)) });
      const { origin, target } = points(), destination = caught ? origin : target;
      if (Math.hypot(position.x - destination.x, position.y - destination.y) < 26) send();
    }
    function up(e: PointerEvent) {
      if (!start || start.id !== e.pointerId) return;
      const moved = start.moved;
      start = null;
      if (moved) settle(); else send();
    }
    function cancel() { if (!start) return; start = null; settle(); }
    function key(e: KeyboardEvent) {
      if (!["Enter", " ", "ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
      e.preventDefault();
      if (e.key === "Home" || e.key === "ArrowRight") send(false);
      else if (e.key === "End" || e.key === "ArrowLeft") send(true);
      else send();
    }
    function click() { send(); }
    function resize() { start = null; settle(false); }
    function motionChange() { start = null; settle(false); }
    const observer = new ResizeObserver(resize);
    observer.observe(stage);
    handle.addEventListener("pointerdown", down);
    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", up);
    handle.addEventListener("pointercancel", cancel);
    handle.addEventListener("lostpointercapture", cancel);
    handle.addEventListener("keydown", key);
    button.addEventListener("click", click);
    reduced.addEventListener("change", motionChange);
    document.addEventListener("uoink-motion-change", motionChange);
    settle(false);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      handle.removeEventListener("pointerdown", down);
      handle.removeEventListener("pointermove", move);
      handle.removeEventListener("pointerup", up);
      handle.removeEventListener("pointercancel", cancel);
      handle.removeEventListener("lostpointercapture", cancel);
      handle.removeEventListener("keydown", key);
      button.removeEventListener("click", click);
      reduced.removeEventListener("change", motionChange);
      document.removeEventListener("uoink-motion-change", motionChange);
    };
  }, []);

  return (
    <div className="family-footer" ref={root}>
      <div className="container"><div className="family-strip">
        <p className="family-caption">Uoink pulls it in.<br />Zing sends it out.</p>
        <div className="family-stage">
          <div className="family-wordmarks">
            <Link className="family-product" href="/" aria-label="Uoink"><FamilyWordmark cap={34} ground="ink" /></Link>
            <span className="family-dot" aria-hidden="true">·</span>
            <a className="family-product" href="https://myzing.app" aria-label="Zing"><FamilyWordmark brand="z" cap={34} ground="ink" /></a>
          </div>
          <span className="charge-handle" tabIndex={0} role="slider" aria-label="Move the shared charge from Zing to Uoink"
            aria-valuemin={0} aria-valuemax={100} aria-valuenow={0} aria-valuetext="At Zing" aria-describedby="family-drag-hint"><i /></span>
        </div>
        <p className="drag-hint" id="family-drag-hint">Drag the yellow charge from Z to U.</p>
        <div className="family-actions">
          <button type="button" className="button secondary on-ink send-charge">Send the charge</button>
          <span className="charge-status" role="status">At Zing</span>
        </div>
        <p className="family-credit">Uoink · Zing, by Replay Ryan Tools</p>
        <p className="maker-credit">Made by Replay Ryan Tools · <a href="https://x.com/replayryan">@replayryan</a></p>
      </div></div>
    </div>
  );
}
