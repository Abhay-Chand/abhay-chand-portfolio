import Image from "next/image";
import {
  getProfile,
  getPublishedExperiences,
  getPublishedProjects,
  getPublishedSkillGroups,
  getPublishedCertifications,
  getPublishedAchievements,
} from "@/lib/data";
import { ProjectRow } from "@/components/project-row";
import { CategoryTag } from "@/components/category-tag";

// Content is managed live via /admin, so the homepage must always read the
// current database state rather than being cached as a static page.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [profileData, experiences, projects, skillGroups, certifications, achievements] =
    await Promise.all([
      getProfile(),
      getPublishedExperiences(),
      getPublishedProjects(),
      getPublishedSkillGroups(),
      getPublishedCertifications(),
      getPublishedAchievements(),
    ]);

  if (!profileData) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <p className="text-slate">
          No profile content yet. Log in to <a href="/admin" className="underline">/admin</a> to
          get started.
        </p>
      </div>
    );
  }

  const aiProjects = projects.filter((p) => p.category === "ai");
  const dataProjects = projects.filter((p) => p.category === "data");

  return (
    <div>
      {/* Hero: two-column ledger */}
      <section className="mx-auto max-w-5xl px-6 pt-16 pb-20 grid gap-12 sm:grid-cols-[1fr_260px]">
        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-slate mb-4">
            {profileData.title} · {profileData.location}
          </p>
          <h1 className="font-display text-4xl sm:text-5xl leading-[1.1] mb-6 max-w-xl">
            {profileData.tagline}
          </h1>
          <p className="text-slate leading-relaxed max-w-lg">{profileData.bio}</p>
        </div>

        <div className="space-y-6">
          <div className="relative aspect-[4/5] rounded-lg overflow-hidden border border-line">
            {profileData.photoUrl ? (
              <Image
                src={profileData.photoUrl}
                alt={`Portrait of ${profileData.name}`}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="h-full w-full bg-white/50 flex items-center justify-center text-xs text-slate font-mono">
                Photo pending
              </div>
            )}
          </div>

          <dl className="text-sm space-y-3 border-t border-line pt-4">
            <div className="flex justify-between gap-4">
              <dt className="text-slate">Active since</dt>
              <dd className="font-mono">{profileData.yearsActive ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate">Based in</dt>
              <dd>{profileData.location}</dd>
            </div>
          </dl>

          <div>
            <p className="text-xs uppercase tracking-wide text-slate mb-2 font-mono">
              Focus areas
            </p>
            <ul className="space-y-1.5">
              {profileData.focusAreas.map((area) => (
                <li key={area} className="text-sm">
                  {area}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Work */}
      <section id="work" className="mx-auto max-w-5xl px-6 py-16 border-t border-line scroll-mt-16">
        <div className="mb-10">
          <h2 className="font-display text-3xl mb-2">Work</h2>
          <p className="text-slate max-w-xl">
            Projects grouped by what they&apos;re actually for — AI systems I&apos;ve built, and
            the data analytics work that came before them.
          </p>
        </div>

        {aiProjects.length > 0 && (
          <div className="mb-12">
            <div className="mb-2">
              <CategoryTag category="ai" />
            </div>
            <div>
              {aiProjects.map((project) => (
                <ProjectRow key={project.id} project={project} />
              ))}
            </div>
          </div>
        )}

        {dataProjects.length > 0 && (
          <div>
            <div className="mb-2">
              <CategoryTag category="data" />
            </div>
            <div>
              {dataProjects.map((project) => (
                <ProjectRow key={project.id} project={project} />
              ))}
            </div>
          </div>
        )}

        {projects.length === 0 && (
          <p className="text-slate text-sm">No published projects yet.</p>
        )}
      </section>

      {/* Experience — a real sequence, so it earns a timeline */}
      <section
        id="experience"
        className="mx-auto max-w-5xl px-6 py-16 border-t border-line scroll-mt-16"
      >
        <h2 className="font-display text-3xl mb-10">Experience</h2>
        <ol className="space-y-10">
          {experiences.map((exp, i) => (
            <li key={exp.id} className="grid sm:grid-cols-[48px_1fr] gap-4">
              <div className="font-mono text-slate text-sm">{String(i + 1).padStart(2, "0")}</div>
              <div>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1">
                  <h3 className="font-display text-xl">{exp.role}</h3>
                  <span className="text-slate">— {exp.org}</span>
                </div>
                <p className="font-mono text-xs text-slate mb-3">
                  {exp.startDate} — {exp.endDate ?? "Present"}
                </p>
                <p className="mb-3 max-w-2xl leading-relaxed">{exp.summary}</p>
                <ul className="space-y-1.5 max-w-2xl">
                  {exp.highlights.map((h) => (
                    <li key={h} className="text-sm text-slate leading-relaxed pl-4 relative">
                      <span className="absolute left-0">–</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
          {experiences.length === 0 && (
            <p className="text-slate text-sm">No published experience yet.</p>
          )}
        </ol>
      </section>

      {/* Skills */}
      <section id="skills" className="mx-auto max-w-5xl px-6 py-16 border-t border-line scroll-mt-16">
        <h2 className="font-display text-3xl mb-10">Skills</h2>
        <div className="grid sm:grid-cols-2 gap-x-12 gap-y-8">
          {skillGroups.map((group) => (
            <div key={group.id}>
              <h3 className="font-mono text-xs uppercase tracking-wide text-slate mb-3">
                {group.name}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {group.skills.map((skill) => (
                  <span key={skill} className="text-sm px-2.5 py-1 rounded border border-line">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications & achievements */}
      {(certifications.length > 0 || achievements.length > 0) && (
        <section className="mx-auto max-w-5xl px-6 py-16 border-t border-line grid sm:grid-cols-2 gap-12">
          {certifications.length > 0 && (
            <div>
              <h2 className="font-display text-2xl mb-6">Certifications</h2>
              <ul className="space-y-3">
                {certifications.map((cert) => (
                  <li key={cert.id} className="text-sm">
                    <span className="font-medium">{cert.name}</span>
                    <span className="text-slate"> — {cert.issuer}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {achievements.length > 0 && (
            <div>
              <h2 className="font-display text-2xl mb-6">Achievements</h2>
              <ul className="space-y-3">
                {achievements.map((a) => (
                  <li key={a.id} className="text-sm">
                    <span className="font-medium">{a.title}</span>
                    {a.description && <p className="text-slate mt-0.5">{a.description}</p>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {/* Contact */}
      <section
        id="contact"
        className="mx-auto max-w-5xl px-6 py-20 border-t border-line scroll-mt-16"
      >
        <h2 className="font-display text-3xl mb-4">Get in touch</h2>
        <p className="text-slate max-w-lg mb-6">
          The fastest way to reach me is email. I&apos;m open to discussing AI engineering roles
          and collaborations.
        </p>
        <div className="flex flex-wrap gap-4">
          {profileData.email ? (
            <a
              href={`mailto:${profileData.email}`}
              className="inline-flex items-center rounded-full border border-ink px-5 py-2.5 text-sm hover:bg-ink hover:text-paper transition-colors"
            >
              {profileData.email}
            </a>
          ) : (
            <span className="inline-flex items-center rounded-full border border-dashed border-slate-light px-5 py-2.5 text-sm text-slate font-mono">
              Email not set yet — add it in /admin
            </span>
          )}
          {profileData.githubUrl && (
            <a
              href={profileData.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full border border-ink px-5 py-2.5 text-sm hover:bg-ink hover:text-paper transition-colors"
            >
              GitHub
            </a>
          )}
          {profileData.linkedinUrl && (
            <a
              href={profileData.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full border border-ink px-5 py-2.5 text-sm hover:bg-ink hover:text-paper transition-colors"
            >
              LinkedIn
            </a>
          )}
        </div>
      </section>
    </div>
  );
}
