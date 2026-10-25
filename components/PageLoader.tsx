"use client";

import { useEffect, useState } from "react";

export default function PageLoader() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      setIsLoaded(true);
      setTimeout(() => setShowLoader(false), 600);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (!mounted || !showLoader) return null;

  return (
    <div
      className={`page-loader ${isLoaded ? "is-loaded" : ""}`}
      aria-hidden="true"
    >
      <div className="loader-content">
        <div className="loader-ring" aria-hidden="true">
          <span className="loader-dot" />
        </div>
        <p className="loader-text">Loading</p>
      </div>
      <style jsx>{`
        .page-loader {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: #f1eee7;
          display: grid;
          place-items: center;
          opacity: 1;
          visibility: visible;
          transition: opacity 0.5s cubic-bezier(0.2, 0.8, 0.2, 1),
            visibility 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .page-loader.is-loaded {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }
        .loader-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.25rem;
          transform: none;
          transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .page-loader.is-loaded .loader-content {
          transform: translateY(-1rem);
        }
        .loader-ring {
          width: 48px;
          height: 48px;
          border: 2px solid rgba(23, 33, 31, 0.15);
          border-radius: 50%;
          position: relative;
          animation: ring-pulse 2.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .loader-dot {
          position: absolute;
          top: -2px;
          left: 50%;
          width: 8px;
          height: 8px;
          background: #17211f;
          border-radius: 50%;
          transform: translateX(-50%);
          animation: dot-orbit 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .loader-text {
          font: 500 0.68rem/1 "DM Mono", monospace;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #73756d;
          animation: text-fade 1.8s ease-in-out infinite;
        }
        @keyframes ring-pulse {
          0%, 100% {
            transform: scale(1);
            border-color: rgba(23, 33, 31, 0.15);
          }
          50% {
            transform: scale(1.15);
            border-color: rgba(23, 33, 31, 0.35);
          }
        }
        @keyframes dot-orbit {
          0% { transform: translateX(-50%) rotate(0deg) translateY(-24px) rotate(0deg); }
          100% { transform: translateX(-50%) rotate(360deg) translateY(-24px) rotate(-360deg); }
        }
        @keyframes text-fade {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .loader-ring,
          .loader-dot,
          .loader-text {
            animation: none !important;
          }
          .loader-ring { border-color: #17211f; }
          .loader-dot { background: #17211f; }
          .loader-text { opacity: 1; }
          .loader-content {
            transform: none !important;
            transition: none !important;
          }
          .page-loader.is-loaded .loader-content {
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
}