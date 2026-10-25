import type { CSSProperties } from "react";

type Service = {
  number: string;
  title: string;
  description: string;
};

const services: Service[] = [
  {
    number: "01",
    title: "Frontend Development",
    description:
      "Interfaces built with React, TypeScript, and Next.js that stay clear under real content, real devices, and real deadlines.",
  },
  {
    number: "02",
    title: "Full-Stack Development",
    description:
      "From polished screens to the data and logic underneath, shipped as one coherent product.",
  },
  {
    number: "03",
    title: "UI Implementation & Animation",
    description:
      "Design translated into motion, hierarchy, and feedback that make an interface feel considered.",
  },
  {
    number: "04",
    title: "API Integration & Backend Development",
    description:
      "Connections to services, databases, and workflows a product depends on, kept reliable and observable.",
  },
  {
    number: "05",
    title: "Responsive Web Experiences",
    description:
      "Layouts that hold their shape from wide desktop down to small mobile, without losing usability.",
  },
];

export default function ServicesSection() {
  return (
    <section className="services section-pad" id="services">
      <div className="page-grid">
        <div className="section-heading services-heading reveal">
          <div className="section-index">03 / Services</div>
          <div>
            <p className="eyebrow">Ways I can contribute</p>
            <h2>
              From idea to <em>interface.</em>
            </h2>
          </div>
          <p className="heading-note">
            Practical, end-to-end web development shaped around the people who
            will use the product.
          </p>
        </div>

        <div className="services-list">
          {services.map((service, index) => (
            <article
              key={service.number}
              className="service-row reveal"
              style={{ "--delay": `${index * 70}ms` } as CSSProperties}
            >
              <span className="service-number" aria-hidden="true">
                {service.number}
              </span>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-desc">{service.description}</p>
              <span className="service-mark" aria-hidden="true">
                ↗
              </span>
            </article>
          ))}
        </div>

        <div className="tech-strip reveal">
          <span>Working with</span>
          <strong>React</strong>
          <strong>TypeScript</strong>
          <strong>Next.js</strong>
          <strong>APIs</strong>
          <strong>CSS</strong>
          <strong>and good questions.</strong>
        </div>
      </div>
    </section>
  );
}
