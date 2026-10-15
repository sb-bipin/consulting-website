"use client";

import { useEffect } from "react";

export default function HeaderHeightSync({
  selector = "header.sticky-top",
}: {
  selector?: string;
}) {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>(selector);
    if (!header) return;

    const setVar = () => {
      document.documentElement.style.setProperty(
        "--sw-header-h",
        `${header.offsetHeight}px`,
      );
    };

    setVar();
    const observer = new ResizeObserver(setVar);
    observer.observe(header);
    window.addEventListener("resize", setVar);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", setVar);
    };
  }, [selector]);

  return null;
}
