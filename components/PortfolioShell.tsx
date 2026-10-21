"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import ServicesSection from "./services/ServicesSection";
import SiteFooter from "./footer/SiteFooter";
import { identity } from "../lib/identity";
const RuiCharacter = dynamic(() => import("./hero/RuiCharacter"), {
  ssr: false,
});

type ProjectFilter = "all" | "web" | "interactive";

const projects = [
  {
    number: "01",
    title: "Gesture-driven particle experience",
    description:
      "Hand tracking drives a real-time 20,000-particle scene built with MediaPipe Hands, Three.js, and WebGL.",
    tags: ["Three.js", "MediaPipe", "WebGL"],
    categories: ["interactive"],
    href: "https://github.com/codewith-shivank/AR-JJK-Cursed-Technique-",
    accent: "peach",
    glyph: "✳",
  },
  {
    number: "02",
    title: "Weather & air-quality dashboard",
    description:
      "Forecasts, hazard alerts, pollutant data, radar maps, and offline support in a responsive React app.",
    tags: ["React", "TypeScript", "PWA"],
    categories: ["web"],
    href: "https://github.com/codewith-shivank/atmosphere-forecast",
    accent: "blue",
    glyph: "⌁",
  },
  {
    number: "03",
    title: "Interactive 3D automotive showroom",
    description:
      "A browser-based 3D showroom built with React, Three.js, and React Three Fiber.",
    tags: ["React Three Fiber", "Three.js", "3D"],
    categories: ["interactive"],
    href: "https://github.com/codewith-shivank/Interactive-3D-Automotive-Showroom",
    accent: "yellow",
    glyph: "↗",
  },
];

const skills = [
  "MERN",
  "React",
  "TypeScript",
  "JavaScript",
  "Java",
  "Data structures & algorithms",
  "Three.js",
  "WebGL",
];

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={diagonal ? "arrow arrow-diagonal" : "arrow"}
    >
      →
    </span>
  );
}

export default function PortfolioShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState<ProjectFilter>("all");
  const [copied, setCopied] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(motionQuery.matches);
    updateMotion();
    motionQuery.addEventListener("change", updateMotion);

    const revealItems = Array.from(document.querySelectorAll(".reveal"));
    if (reducedMotion || !("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.14 },
      );
      revealItems.forEach((item) => observer.observe(item));
      return () => {
        observer.disconnect();
        motionQuery.removeEventListener("change", updateMotion);
      };
    }

    return () => motionQuery.removeEventListener("change", updateMotion);
  }, [reducedMotion]);

  const visibleProjects = projects.filter(
    (project) => filter === "all" || project.categories.includes(filter),
  );

  async function copyEmail() {
    const email = identity.email;
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <main>
      <section className="hero" id="top">
        <div className="noise" aria-hidden="true" />
        <header className="site-header">
          <a
            className="wordmark"
            href="#top"
            onClick={closeMenu}
            aria-label="CodeWithShivank home"
          >
            CodeWithShivank
          </a>
          <button
            className="menu-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="site-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span>{menuOpen ? "Close" : "Index"}</span>
            <span className="menu-icon" aria-hidden="true">
              {menuOpen ? "×" : "↘"}
            </span>
          </button>
          <nav
            id="site-navigation"
            className={`site-nav ${menuOpen ? "is-open" : ""}`}
            aria-label="Primary navigation"
          >
            <a href="#work" onClick={closeMenu}>
              Work <span>01</span>
            </a>
            <a href="#about" onClick={closeMenu}>
              About <span>02</span>
            </a>
            <a href="#services" onClick={closeMenu}>
              Services <span>03</span>
            </a>
            <a href="#contact" onClick={closeMenu}>
              Contact <span>04</span>
            </a>
          </nav>
        </header>

        <div className="hero-content page-grid">
          <div className="hero-intro">
            <p className="eyebrow light">
              {identity.headline}
            </p>
            <h1>
              Shivank<span aria-hidden="true">.</span>
            </h1>
            <p className="hero-manifesto">{identity.role}</p>
            <p className="hero-description">
              Building full-stack web apps and interactive browser experiments,
              from weather tools to real-time 3D.
            </p>
            <div className="hero-actions">
              <a className="button button-light" href="#work">
                See the work <Arrow diagonal />
              </a>
              <a className="text-link light-link" href="#contact">
                Start a conversation <Arrow />
              </a>
            </div>
          </div>

          <RuiCharacter
            className="hero-character"
            reducedMotion={reducedMotion}
          />
        </div>

        <nav className="hero-footer page-grid" aria-label="Explore portfolio">
          <a href="#work">
            <span className="hero-footer-index">01 / Work</span>
            <strong>
              Explore the work <Arrow diagonal />
            </strong>
            <span>Interfaces built to be used.</span>
          </a>
          <a href="#about">
            <span className="hero-footer-index">02 / Approach</span>
            <strong>
              Get to know me <Arrow diagonal />
            </strong>
            <span>Clear thinking, useful details.</span>
          </a>
          <a href="#contact">
            <span className="hero-footer-index">03 / Inquiry</span>
            <strong>
              Start a conversation <Arrow diagonal />
            </strong>
            <span>Have something worth making?</span>
          </a>
        </nav>
      </section>

      <section className="statement section-pad" id="about">
        <div className="page-grid statement-grid reveal">
          <div className="section-index">01 / About</div>
          <div className="statement-copy">
            <p className="eyebrow">The short version</p>
            <h2>
              Curious by nature. <span>Building</span> for the web.
            </h2>
            <p className="body-copy">
              I&apos;m {identity.name}, a BCA student at BBDU graduating in
              2028 and an aspiring software engineer. I build full-stack web
              projects with the MERN stack, explore Java and data structures,
              and enjoy creating interactive experiences in the browser.
            </p>
            <div className="skill-set">
              <p className="eyebrow">Tools &amp; areas of focus</p>
              <ul className="skill-list" aria-label="Skills and technologies">
                {skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </div>
            <a className="text-link ink-link" href="#services">
              How I can help <Arrow diagonal />
            </a>
          </div>
          <div className="annotation-note">
            <span>↳</span>Less noise.
            <br />
            More signal.
          </div>
        </div>
      </section>

      <section className="work section-pad" id="work">
        <div className="page-grid work-grid">
          <div className="section-heading reveal">
            <div className="section-index">02 / Selected work</div>
            <div>
              <p className="eyebrow">From my GitHub</p>
              <h2>
                Built to be <em>used.</em>
              </h2>
            </div>
            <p className="heading-note">
              A selection of projects and experiments from my GitHub.
            </p>
          </div>

          <div
            className="filter-row reveal"
            role="group"
            aria-label="Filter selected work"
          >
            {(["all", "web", "interactive"] as ProjectFilter[]).map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={filter === item}
                className={filter === item ? "active" : ""}
                onClick={() => setFilter(item)}
              >
                {item === "all"
                  ? "All work"
                  : item === "web"
                    ? "Web apps"
                    : "Interactive"}
              </button>
            ))}
          </div>

          <div className="project-list" aria-live="polite">
            {visibleProjects.map((project, index) => (
              <a
                className={`project-row reveal ${project.accent}`}
                href={project.href}
                key={project.title}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} on GitHub`}
                style={{ "--delay": `${index * 80}ms` } as React.CSSProperties}
              >
                <span className="project-number">{project.number}</span>
                <span className="project-visual" aria-hidden="true">
                  <span>{project.glyph}</span>
                  <i />
                </span>
                <span className="project-info">
                  <strong>{project.title}</strong>
                  <span>{project.description}</span>
                </span>
                <span className="project-tags">
                  {project.tags.map((tag) => (
                    <small key={tag}>{tag}</small>
                  ))}
                </span>
                <span className="project-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <ServicesSection />

      <section className="contact section-pad" id="contact">
        <div className="page-grid contact-grid reveal">
          <div className="section-index">04 / Contact</div>
          <div className="contact-main">
            <p className="eyebrow light">Have something worth making?</p>
            <h2>
              Let&apos;s make
              <br />
              <em>the next bit.</em>
            </h2>
            <p className="contact-copy">
              Tell me what you&apos;re trying to untangle, launch, or make more
              useful. A rough note is a good place to start.
            </p>
            <a
              className="button button-light contact-button"
              href={`mailto:${identity.email}?subject=Hello%20Shivank`}
            >
              Send an email <Arrow diagonal />
            </a>
            <button type="button" className="copy-button" onClick={copyEmail}>
              {copied ? "Copied to clipboard" : `${identity.email}  /  copy`}
            </button>
          </div>
          <div className="contact-aside">
            <span>Open to</span>
            <strong>
              Thoughtful
              <br />
              collaborations
            </strong>
            <span>01 — 04 / 04</span>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
