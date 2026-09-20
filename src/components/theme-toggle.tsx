"use client";

import { useSyncExternalStore } from "react";

export function ThemeToggle() {
  const theme = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("portfolio-theme-change", onStoreChange);
      return () => window.removeEventListener("portfolio-theme-change", onStoreChange);
    },
    () => (document.documentElement.dataset.theme === "dark" ? "dark" : "light"),
    () => "light"
  );

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.classList.add("theme-transition");
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem("portfolio-theme", next);
    window.dispatchEvent(new Event("portfolio-theme-change"));
    window.setTimeout(() => document.documentElement.classList.remove("theme-transition"), 320);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <span aria-hidden="true">{theme === "dark" ? "☼" : "◐"}</span>
      <span className="sr-only">{theme === "dark" ? "Light mode" : "Dark mode"}</span>
    </button>
  );
}
