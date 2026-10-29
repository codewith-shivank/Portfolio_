import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "../../../lib/projects";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const project = getProject(params.slug);
  if (!project) return { title: "Project not found — CodeWithShivank" };

  return {
    title: `${project.title} — CodeWithShivank`,
    description: project.description,
  };
}

export default function ProjectCaseStudy({
  params,
}: {
  params: { slug: string };
}) {
  const project = getProject(params.slug);
  if (!project) notFound();

  return (
    <main className="case-study-page">
      <header className="case-study-header">
        <Link className="wordmark" href="/#top">CodeWithShivank</Link>
        <Link className="text-link ink-link" href="/#work">Back to work <span aria-hidden="true">↗</span></Link>
      </header>

      <article className="case-study-content">
        <div className={`case-study-art ${project.accent}`} aria-hidden="true"><span>{project.glyph}</span></div>
        <p className="eyebrow">{project.number} / Case study</p>
        <h1>{project.title}</h1>
        <p className="case-study-lede">{project.description}</p>

        <div className="case-study-grid">
          <section><p className="eyebrow">Overview</p><p>{project.overview}</p></section>
          <section><p className="eyebrow">My contribution</p><p>{project.role}</p></section>
          <section><p className="eyebrow">Outcome</p><p>{project.outcome}</p></section>
        </div>

        <div className="case-study-tags" aria-label="Technologies used">
          {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>

        <div className="case-study-actions">
          {project.liveUrl ? (
            <a className="button button-dark" href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              View live demo <span aria-hidden="true">↗</span>
            </a>
          ) : (
            <span className="case-study-unavailable">Live demo coming soon</span>
          )}
          <a className="text-link ink-link" href={project.href} target="_blank" rel="noopener noreferrer">
            View source on GitHub <span aria-hidden="true">↗</span>
          </a>
        </div>
      </article>
    </main>
  );
}
