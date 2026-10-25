"use client";

import { identity, socials } from "../../lib/identity";

const footerNav = [
  { label: "Home", href: "#top", index: "01" },
  { label: "Work", href: "#work", index: "02" },
  { label: "About", href: "#about", index: "03" },
  { label: "Contact", href: "#contact", index: "04" },
];

export default function SiteFooter() {
  const activeSocials = socials.filter((social) => social.url.length > 0);
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer" id="footer">
      <div className="page-grid">
        <div className="footer-cta reveal">
          <p className="eyebrow light">
            {identity.role}
          </p>
          <h2 className="footer-headline" aria-label="Let's build something">
            <span className="footer-line">
              <span>L</span>
              <span>E</span>
              <span>T</span>
              <span>&apos;</span>
              <span>S</span>
            </span>{" "}
            <span className="footer-line">
              <span>B</span>
              <span>U</span>
              <span>I</span>
              <span>L</span>
              <span>D</span>
            </span>
            <br />
            <em className="footer-line footer-line-accent">
              <span>S</span>
              <span>O</span>
              <span>M</span>
              <span>E</span>
              <span>T</span>
              <span>H</span>
              <span>I</span>
              <span>N</span>
              <span>G</span>
              <span>.</span>
            </em>
          </h2>
          <a
            className="button button-light footer-email"
            href={`mailto:${identity.email}`}
          >
            {identity.email}
            <span aria-hidden="true" className="arrow arrow-diagonal">
              →
            </span>
          </a>
        </div>

        <nav className="footer-nav reveal" aria-label="Footer navigation">
          {footerNav.map((item) => (
            <a key={item.href} href={item.href}>
              <span className="footer-nav-index" aria-hidden="true">
                {item.index}
              </span>
              <span>{item.label}</span>
              <span aria-hidden="true" className="arrow arrow-diagonal">
                →
              </span>
            </a>
          ))}
        </nav>

        <div className="footer-meta reveal">
          <div className="footer-meta-block">
            <span className="footer-meta-label">Identity</span>
            <strong>{identity.name}</strong>
            <span>{identity.handle}</span>
          </div>
          <div className="footer-meta-block">
            <span className="footer-meta-label">Education</span>
            <strong>{identity.education}</strong>
          </div>
          {activeSocials.length > 0 && (
            <div className="footer-meta-block">
              <span className="footer-meta-label">Socials</span>
              <div className="footer-socials">
                {activeSocials.map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="footer-end reveal">
          <span>
            CodeWithShivank
          </span>
          <a href="#top">
            Back to top{" "}
            <span aria-hidden="true" className="arrow">
              ↑
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
