"use client";

import { useState } from "react";
import { CategoryTag } from "./category-tag";

type Project = {
  id: string;
  title: string;
  slug: string;
  category: "ai" | "data";
  summary: string;
  problem: string | null;
  solution: string | null;
  architecture: string | null;
  outcome: string | null;
  challenges: string | null;
  techStack: string[];
  links: { github?: string; live?: string; other?: string };
  coverImageUrl: string | null;
};

export function ProjectRow({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);
  const panelId = `project-panel-${project.slug}`;

  return (
    <div className="border-b border-line last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="w-full text-left py-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 group"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-1.5">
            <CategoryTag category={project.category} />
          </div>
          <h3 className="font-display text-xl sm:text-2xl leading-snug group-hover:opacity-70 transition-opacity">
            {project.title}
          </h3>
          <p className="text-slate mt-1 max-w-2xl">{project.summary}</p>
        </div>
        <div
          className="shrink-0 self-start sm:self-center text-2xl leading-none transition-transform duration-200 text-slate"
          style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
          aria-hidden="true"
        >
          +
        </div>
      </button>

      <div
        id={panelId}
        role="region"
        hidden={!open}
        className="pb-8 grid gap-6 sm:grid-cols-[minmax(0,1fr)_220px]"
      >
        <div className="space-y-5">
          {project.problem && (
            <div>
              <h4 className="text-xs uppercase tracking-wide text-slate mb-1 font-mono">
                Problem
              </h4>
              <p className="leading-relaxed">{project.problem}</p>
            </div>
          )}
          {project.solution && (
            <div>
              <h4 className="text-xs uppercase tracking-wide text-slate mb-1 font-mono">
                Solution
              </h4>
              <p className="leading-relaxed">{project.solution}</p>
            </div>
          )}
          {project.architecture && (
            <div>
              <h4 className="text-xs uppercase tracking-wide text-slate mb-1 font-mono">
                Architecture
              </h4>
              <p className="leading-relaxed">{project.architecture}</p>
            </div>
          )}
          {project.challenges && (
            <div>
              <h4 className="text-xs uppercase tracking-wide text-slate mb-1 font-mono">
                Challenges
              </h4>
              <p className="leading-relaxed">{project.challenges}</p>
            </div>
          )}
          {project.outcome && (
            <div>
              <h4 className="text-xs uppercase tracking-wide text-slate mb-1 font-mono">
                Outcome
              </h4>
              <p className="leading-relaxed">{project.outcome}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2 flex-wrap">
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noreferrer"
                className="text-sm underline underline-offset-4 hover:opacity-70"
              >
                View code
              </a>
            )}
            {project.links.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noreferrer"
                className="text-sm underline underline-offset-4 hover:opacity-70"
              >
                Live link
              </a>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="aspect-video rounded-lg border border-line bg-white/50 flex items-center justify-center text-xs text-slate font-mono">
            {project.coverImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={project.coverImageUrl}
                alt={`Screenshot of ${project.title}`}
                className="h-full w-full object-cover rounded-lg"
              />
            ) : (
              "Screenshot pending"
            )}
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-wide text-slate mb-2 font-mono">
              Stack
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="font-mono text-xs px-2 py-1 rounded border border-line text-slate"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
