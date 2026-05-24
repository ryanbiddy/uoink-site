(() => {
  const burger = document.querySelector("[data-nav-burger]");
  const menu = document.querySelector("[data-mobile-menu]");
  const closeButton = document.querySelector("[data-nav-close]");
  if (!burger || !menu || !closeButton) return;

  let lastFocus = null;

  const focusables = () =>
    Array.from(menu.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])')).filter(
      (node) => !node.hasAttribute("disabled"),
    );

  function openMenu() {
    lastFocus = document.activeElement;
    menu.classList.add("open");
    menu.setAttribute("aria-hidden", "false");
    burger.setAttribute("aria-expanded", "true");
    burger.setAttribute("aria-label", "Close menu");
    document.body.style.overflow = "hidden";
    const items = focusables();
    if (items[0]) items[0].focus();
  }

  function closeMenu() {
    menu.classList.remove("open");
    menu.setAttribute("aria-hidden", "true");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Open menu");
    document.body.style.overflow = "";
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  burger.addEventListener("click", openMenu);
  closeButton.addEventListener("click", closeMenu);
  menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

  document.addEventListener("keydown", (event) => {
    if (!menu.classList.contains("open")) return;
    if (event.key === "Escape") {
      closeMenu();
      return;
    }
    if (event.key !== "Tab") return;
    const items = focusables();
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
})();
