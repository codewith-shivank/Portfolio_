"use client";

import { useEffect, useRef, useState } from "react";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? Math.min(1, scrollTop / docHeight) : 0;
      setProgress(scrollPercent);
      setVisible(docHeight > 0 && scrollPercent > 0.05 && scrollPercent < 0.95);
      if (barRef.current) {
        barRef.current.style.setProperty("--progress", String(scrollPercent));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`scroll-progress ${visible ? "is-visible" : ""}`}
      aria-hidden="true"
    >
      <div ref={barRef} className="scroll-progress-bar" />
      <style jsx>{`
        .scroll-progress {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 2px;
          z-index: 9998;
          background: transparent;
          opacity: 0;
          visibility: hidden;
          transform: scaleX(0);
          transform-origin: left;
          transition:
            opacity 0.4s cubic-bezier(0.2, 0.8, 0.2, 1),
            visibility 0.4s cubic-bezier(0.2, 0.8, 0.2, 1),
            transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .scroll-progress.is-visible {
          opacity: 1;
          visibility: visible;
          transform: scaleX(1);
        }
        .scroll-progress-bar {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          background: linear-gradient(
            90deg,
            #b8f56d,
            #9bc7ff
          );
          transform-origin: left;
          transform: scaleX(var(--progress, 0));
          will-change: transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .scroll-progress {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}