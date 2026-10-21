"use client";

import { useEffect, useState } from "react";

/**
 * Attaches an IntersectionObserver to every `.reveal` element inside the
 * referenced container. Elements animate in when they enter the viewport and
 * reset when scrolled out, so entrances replay smoothly in both directions.
 * Honors prefers-reduced-motion by marking everything visible immediately.
 */
export function useRevealOnScroll<T extends HTMLElement>() {
  const [containerRef, setContainerRef] = useState<T | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (!containerRef) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyMotionPreference = () => {
      setReducedMotion(motionQuery.matches);
      return motionQuery.matches;
    };
    const isReduced = applyMotionPreference();

    const revealItems = Array.from(
      containerRef.querySelectorAll<HTMLElement>(".reveal"),
    );

    if (isReduced || !("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      const onChange = () => {
        if (applyMotionPreference()) {
          revealItems.forEach((item) => item.classList.add("is-visible"));
        }
      };
      motionQuery.addEventListener("change", onChange);
      return () => motionQuery.removeEventListener("change", onChange);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-visible", entry.isIntersecting);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -6% 0px" },
    );
    revealItems.forEach((item) => observer.observe(item));

    const onChange = () => {
      if (applyMotionPreference()) {
        observer.disconnect();
        revealItems.forEach((item) => item.classList.add("is-visible"));
      }
    };
    motionQuery.addEventListener("change", onChange);

    return () => {
      observer.disconnect();
      motionQuery.removeEventListener("change", onChange);
    };
  }, [containerRef]);

  return { containerRef, setContainerRef, reducedMotion };
}
