"use client";

import { useEffect, useRef, useState } from "react";
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
  galleryImages: string[];
  videoUrl: string | null;
};

function ProjectGalleryModal({
  title,
  images,
  isOpen,
  onClose,
}: {
  title: string;
  images: string[];
  isOpen: boolean;
  onClose: () => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const backdropRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setActiveIndex(0);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") setActiveIndex((current) => (current + 1) % images.length);
      if (event.key === "ArrowLeft") setActiveIndex((current) => (current - 1 + images.length) % images.length);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [images.length, isOpen, onClose]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[activeIndex];

  return (
    <div
      ref={backdropRef}
      className="project-gallery-backdrop"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div className="project-gallery-panel" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="project-gallery-close" onClick={onClose} aria-label="Close gallery">
          ×
        </button>

        <div className="project-gallery-media-wrap">
          <button
            type="button"
            className="project-gallery-nav project-gallery-nav-left"
            onClick={() => setActiveIndex((current) => (current - 1 + images.length) % images.length)}
            aria-label="Previous image"
          >
            ←
          </button>

          <img src={currentImage} alt={`${title} gallery ${activeIndex + 1}`} className="project-gallery-image" />

          <button
            type="button"
            className="project-gallery-nav project-gallery-nav-right"
            onClick={() => setActiveIndex((current) => (current + 1) % images.length)}
            aria-label="Next image"
          >
            →
          </button>
        </div>

        <div className="project-gallery-meta">
          <p className="project-gallery-caption">{title}</p>
          <span className="project-gallery-counter">{activeIndex + 1} / {images.length}</span>
        </div>
      </div>
    </div>
  );
}

export function ProjectRow({ project, defaultOpen = false }: { project: Project; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [imageTone, setImageTone] = useState<"dark" | "light" | "fallback">("fallback");
  const panelId = `project-panel-${project.slug}`;
  const media = project.galleryImages?.length ? project.galleryImages : project.coverImageUrl ? [project.coverImageUrl] : [];
  const backgroundImage = media[0] ?? project.coverImageUrl ?? null;

  useEffect(() => {
    if (!backgroundImage) {
      setImageTone("fallback");
      return;
    }

    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      const sampleSize = 40;

      if (!context) {
        setImageTone("dark");
        return;
      }

      canvas.width = sampleSize;
      canvas.height = sampleSize;
      context.drawImage(img, 0, 0, sampleSize, sampleSize);
      const pixels = context.getImageData(0, 0, sampleSize, sampleSize).data;
      let brightness = 0;
      let pixelsCount = 0;

      for (let index = 0; index < pixels.length; index += 4) {
        const alpha = pixels[index + 3];
        if (alpha === 0) continue;
        brightness += (pixels[index] * 0.299 + pixels[index + 1] * 0.587 + pixels[index + 2] * 0.114);
        pixelsCount += 1;
      }

      const averageBrightness = pixelsCount > 0 ? brightness / pixelsCount / 255 : 0;
      setImageTone(averageBrightness > 0.62 ? "light" : "dark");
    };

    img.src = backgroundImage;
  }, [backgroundImage]);

  const openGallery = (event?: React.MouseEvent<HTMLButtonElement>) => {
    event?.stopPropagation();
    if (!media.length) return;
    setGalleryOpen(true);
  };

  const togglePanel = () => {
    setOpen((value) => !value);
  };

  const cardClassName = `project-card project-card--${imageTone}`;

  return (
    <div className="project-row">
      <div
        className={cardClassName}
        style={backgroundImage ? ({ ["--project-image" as string]: `url(${backgroundImage})` } as React.CSSProperties) : undefined}
      >
        <div className="project-card-content">
          <div className="project-card-topline">
            <CategoryTag category={project.category} />
            <button
              type="button"
              aria-label={galleryOpen ? "Close gallery" : `Open gallery for ${project.title}`}
              className="project-card-plus"
              onClick={openGallery}
            >
              {galleryOpen ? "−" : "+"}
            </button>
          </div>

          <button type="button" onClick={togglePanel} aria-expanded={open} aria-controls={panelId} className="project-card-button">
            <h3 className="project-card-title">{project.title}</h3>
            <p className="project-card-summary">{project.summary}</p>
          </button>
        </div>
      </div>

      <div id={panelId} role="region" hidden={!open} className="project-details">
        <div className="project-details-inner">
          {project.problem && (
            <div>
              <h4 className="text-xs uppercase tracking-wide text-slate mb-1 font-mono">Problem</h4>
              <p className="leading-relaxed">{project.problem}</p>
            </div>
          )}
          {project.solution && (
            <div>
              <h4 className="text-xs uppercase tracking-wide text-slate mb-1 font-mono">Solution</h4>
              <p className="leading-relaxed">{project.solution}</p>
            </div>
          )}
          {project.architecture && (
            <div>
              <h4 className="text-xs uppercase tracking-wide text-slate mb-1 font-mono">Architecture</h4>
              <p className="leading-relaxed">{project.architecture}</p>
            </div>
          )}
          {project.challenges && (
            <div>
              <h4 className="text-xs uppercase tracking-wide text-slate mb-1 font-mono">Challenges</h4>
              <p className="leading-relaxed">{project.challenges}</p>
            </div>
          )}
          {project.outcome && (
            <div>
              <h4 className="text-xs uppercase tracking-wide text-slate mb-1 font-mono">Outcome</h4>
              <p className="leading-relaxed">{project.outcome}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2 flex-wrap">
            {project.links.github && (
              <a href={project.links.github} target="_blank" rel="noreferrer" className="text-sm underline underline-offset-4 hover:opacity-70">
                View code
              </a>
            )}
            {project.links.live && (
              <a href={project.links.live} target="_blank" rel="noreferrer" className="text-sm underline underline-offset-4 hover:opacity-70">
                Live link
              </a>
            )}
          </div>

          <div className="project-stack-block">
            <h4 className="text-xs uppercase tracking-wide text-slate mb-2 font-mono">Stack</h4>
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.map((tech) => (
                <span key={tech} className="font-mono text-xs px-2 py-1 rounded border border-line text-slate">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ProjectGalleryModal
        title={project.title}
        images={media.length ? media : []}
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
      />
    </div>
  );
}
