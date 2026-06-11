"use client";

import { useEffect } from "react";

export function ThemeProvider() {
  useEffect(() => {
    const theme = new URLSearchParams(window.location.search).get("theme") ?? "1";
    document.documentElement.dataset.theme = theme;
  }, []);
  return null;
}
