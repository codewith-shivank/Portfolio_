"use client";

import { useEffect, useState } from "react";

/**
 * Attaches an IntersectionObserver to every `.reveal` element inside the
 * referenced container. Elements animate in gracefully when they enter the viewport
 * and remain visible so content is never accidentally hidden.
 * Honors prefers-reduced-motion by marking everything visible immediately.
 */
export function useRevealOnScroll<T extends HTMLElement>() {
  const [containerRef, setContainerRef] = useState<T | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (!containerRef) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const revealItems = Array.from(
      containerRef.querySelectorAll<HTMLElement>(".reveal"),
    );
    const root = containerRef.ownerDocument.documentElement;
    root.classList.add("has-reveal-motion");

    if (!("IntersectionObserver" in window)) {
      setReducedMotion(motionQuery.matches);
      revealItems.forEach((item) => item.classList.add("is-visible"));
      const onChange = () => setReducedMotion(motionQuery.matches);
      motionQuery.addEventListener("change", onChange);
      return () => {
        root.classList.remove("has-reveal-motion");
        motionQuery.removeEventListener("change", onChange);
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            // Once revealed, no need to keep observing
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.04, rootMargin: "0px 0px -20px 0px" },
    );

    const onChange = () => {
      const isReduced = motionQuery.matches;
      setReducedMotion(isReduced);
      if (isReduced) {
        observer.disconnect();
        revealItems.forEach((item) => item.classList.add("is-visible"));
      } else {
        revealItems.forEach((item) => {
          // If already visible, don't re-hide
          if (!item.classList.contains("is-visible")) {
            observer.observe(item);
          }
        });
      }
    };

    setReducedMotion(motionQuery.matches);
    if (motionQuery.matches) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
    } else {
      revealItems.forEach((item) => {
        // If element is already in initial viewport, mark visible immediately
        const rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          item.classList.add("is-visible");
        } else {
          observer.observe(item);
        }
      });
    }

    motionQuery.addEventListener("change", onChange);

    return () => {
      observer.disconnect();
      root.classList.remove("has-reveal-motion");
      motionQuery.removeEventListener("change", onChange);
    };
  }, [containerRef]);

  return { containerRef, setContainerRef, reducedMotion };
}
