export type ProjectCategory = "web" | "interactive";

export type Project = {
  number: string;
  slug: string;
  title: string;
  description: string;
  overview: string;
  role: string;
  outcome: string;
  tags: string[];
  categories: ProjectCategory[];
  href: string;
  liveUrl?: string;
  accent: "peach" | "blue" | "yellow";
  glyph: string;
};

export const projects: Project[] = [
  {
    number: "01",
    slug: "gesture-driven-particle-experience",
    title: "Gesture-driven particle experience",
    description:
      "Hand tracking drives a real-time 20,000-particle scene built with MediaPipe Hands, Three.js, and WebGL.",
    overview:
      "An interactive browser experiment that turns hand movement into a visual control surface. The scene is designed to feel immediate while keeping the interaction understandable when a camera or hand signal is unavailable.",
    role: "Interaction design, frontend implementation, real-time rendering, and performance tuning.",
    outcome:
      "A focused WebGL prototype that demonstrates how camera input can become a playful, responsive interface.",
    tags: ["Three.js", "MediaPipe", "WebGL"],
    categories: ["interactive"],
    href: "https://github.com/codewith-shivank/AR-JJK-Cursed-Technique-",
    accent: "peach",
    glyph: "✳",
  },
  {
    number: "02",
    slug: "weather-air-quality-dashboard",
    title: "Weather & air-quality dashboard",
    description:
      "Forecasts, hazard alerts, pollutant data, radar maps, and offline support in a responsive React app.",
    overview:
      "A weather dashboard that brings forecast context and air-quality information into one readable view. The interface prioritizes useful summaries first, then gives deeper data room to breathe.",
    role: "Product structure, responsive UI, data integration, and progressive web app behavior.",
    outcome:
      "A practical dashboard concept for checking conditions quickly across desktop and mobile screens.",
    tags: ["React", "TypeScript", "PWA"],
    categories: ["web"],
    href: "https://github.com/codewith-shivank/atmosphere-forecast",
    accent: "blue",
    glyph: "⌁",
  },
  {
    number: "03",
    slug: "interactive-3d-automotive-showroom",
    title: "Interactive 3D automotive showroom",
    description:
      "A browser-based 3D showroom built with React, Three.js, and React Three Fiber.",
    overview:
      "A browser showroom concept where the product is explored spatially rather than through a flat gallery. The experience uses 3D as a way to create orientation and presence, not as decoration alone.",
    role: "Scene composition, React Three Fiber integration, camera behavior, and interaction polish.",
    outcome:
      "A reusable foundation for presenting products with a stronger sense of scale and movement on the web.",
    tags: ["React Three Fiber", "Three.js", "3D"],
    categories: ["interactive"],
    href: "https://github.com/codewith-shivank/Interactive-3D-Automotive-Showroom",
    accent: "yellow",
    glyph: "↗",
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
