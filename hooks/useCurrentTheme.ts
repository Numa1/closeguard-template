"use client";

import { useEffect, useState } from "react";

export function useCurrentTheme(): string {
  const [theme, setTheme] = useState("1");

  useEffect(() => {
    const read = () =>
      setTheme(document.documentElement.dataset.theme ?? "1");
    read();
    const obs = new MutationObserver(read);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => obs.disconnect();
  }, []);

  return theme;
}
