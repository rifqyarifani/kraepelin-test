"use client";

import { useEffect } from "react";

export default function ScrollbarScript() {
  useEffect(() => {
    // Ensure consistent width by forcing the scrollbar to always be visible
    document.documentElement.style.overflowY = "scroll";

    // Update container widths to match exactly
    const updateContainers = () => {
      const containers = document.querySelectorAll(
        ".max-w-6xl, .max-w-5xl, .max-w-4xl"
      );
      let maxWidth = 0;

      // Find the current widest container
      containers.forEach((container) => {
        const width = container.getBoundingClientRect().width;
        if (width > maxWidth) {
          maxWidth = width;
        }
      });

      // Apply exact same width to all containers
      if (maxWidth > 0) {
        containers.forEach((container) => {
          (container as HTMLElement).style.width = `${maxWidth}px`;
        });
      }
    };

    // Run initially and on resize
    updateContainers();
    window.addEventListener("resize", updateContainers);

    return () => {
      window.removeEventListener("resize", updateContainers);
    };
  }, []);

  return null;
}
