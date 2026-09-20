import Image from "next/image";
import Link from "next/link";
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
    return <div className="section-wrap py-32 text-center text-slate">No profile content yet. Log in to <Link href="/admin" className="underline">/admin</Link> to get started.</div>;
  }

  const aiProjects = projects.filter((project) => project.category === "ai");
  const dataProjects = projects.filter((project) => project.category === "data");
  const featuredProject = aiProjects[0];

  return (
    <div>
      <section className="section-wrap hero-section">
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow rise-in">AI engineer / {profileData.location}</p>
            <h1 className="display-title rise-in rise-in-delay">Building systems that make <em>intelligence</em> useful.</h1>
            <p className="hero-lede rise-in rise-in-delay-2">{profileData.bio}</p>
            <div className="hero-actions rise-in rise-in-delay-2">
              <Link href="#work" className="action-link">Explore the work <span aria-hidden="true">↘</span></Link>
              <Link href="#contact" className="action-link subtle">Let&apos;s connect <span aria-hidden="true">→</span></Link>
            </div>
          </div>
          <div className="hero-aside rise-in rise-in-delay-2">
            <div className="portrait-frame">
              {profileData.photoUrl ? <Image src={profileData.photoUrl} alt={`Portrait of ${profileData.name}`} fill sizes="(max-width: 640px) 280px, 290px" priority className="object-cover" /> : <div className="flex h-full items-center justify-center text-xs text-slate">Photo pending</div>}
            </div>
            <div className="hero-meta mt-6">
              <p>Currently focused on<strong>{profileData.title}</strong></p>
              <p className="mt-4">Active since<strong>{profileData.yearsActive ?? "—"}</strong></p>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="section-wrap section-rule about-grid scroll-mt-20">
        <div><p className="eyebrow">01 / Profile</p><p className="mt-5 text-sm text-slate">A practical approach to ambitious systems.</p></div>
        <div>
          <p className="about-copy">I work at the intersection of applied AI, product thinking, and the data foundations that make both dependable.</p>
          <p className="about-support mt-8">{profileData.bio}</p>
          <ul className="focus-list" aria-label="Focus areas">{profileData.focusAreas.map((area) => <li key={area}>{area}</li>)}</ul>
        </div>
      </section>

      <section id="work" className="section-wrap section-rule pb-24 pt-20 scroll-mt-20">
        <div className="section-kicker"><span>02 / Selected work</span><h2>Built with intent.</h2></div>
        <p className="mt-5 max-w-xl text-slate">Systems, experiments, and products shaped around a real problem first, then the right technical architecture.</p>
        {featuredProject && <div className="project-feature"><div className="mb-5"><CategoryTag category={featuredProject.category} /></div><ProjectRow project={featuredProject} defaultOpen /></div>}
        <div className="mt-14">
          <div className="mb-3 flex items-center justify-between"><CategoryTag category="ai" /><span className="font-mono text-xs text-slate">AI / GenAI</span></div>
          {aiProjects.filter((project) => project.id !== featuredProject?.id).map((project) => <ProjectRow key={project.id} project={project} />)}
          <div className="mb-3 mt-12 flex items-center justify-between"><CategoryTag category="data" /><span className="font-mono text-xs text-slate">Data / Analytics</span></div>
          {dataProjects.map((project) => <ProjectRow key={project.id} project={project} />)}
          {projects.length === 0 && <p className="text-sm text-slate">No published projects yet.</p>}
        </div>
      </section>

      <section id="experience" className="section-wrap section-rule pb-24 pt-20 scroll-mt-20">
        <div className="section-kicker"><span>03 / Experience</span><h2>Work in progress.</h2></div>
        <div className="experience-list">
          {experiences.map((experience, index) => <article className="experience-item" key={experience.id}>
            <span className="experience-number">0{index + 1}</span>
            <div><h3 className="experience-role">{experience.role}</h3><p className="experience-org">{experience.org}</p></div>
            <p className="experience-date">{experience.startDate} — {experience.endDate ?? "Present"}</p>
            <div className="experience-summary"><p>{experience.summary}</p><ul className="experience-highlights">{experience.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul></div>
          </article>)}
          {experiences.length === 0 && <p className="text-sm text-slate">No published experience yet.</p>}
        </div>
      </section>

      <section id="skills" className="section-wrap section-rule pb-24 pt-20 scroll-mt-20">
        <div className="section-kicker"><span>04 / Capabilities</span><h2>The working toolkit.</h2></div>
        <div className="skills-grid">{skillGroups.map((group) => <div className="skill-group" key={group.id}><h3>{group.name}</h3><p>{group.skills.join("  ·  ")}</p></div>)}</div>
      </section>

      {(certifications.length > 0 || achievements.length > 0) && <section className="section-wrap section-rule credentials-grid">
        {certifications.length > 0 && <div><p className="eyebrow">05 / Credentials</p><h2 className="mt-4 font-display text-4xl tracking-tight">Learning, formalized.</h2><ul className="credential-list">{certifications.map((cert) => <li key={cert.id}><span className="text-sm">{cert.name}</span><small>{cert.issuer}{cert.dateEarned ? ` · ${cert.dateEarned}` : ""}</small></li>)}</ul></div>}
        {achievements.length > 0 && <div><p className="eyebrow">Recognition</p><ul className="credential-list mt-6">{achievements.map((achievement) => <li key={achievement.id}><span className="text-sm font-medium">{achievement.title}</span>{achievement.description && <p className="mt-2 text-sm leading-relaxed text-slate">{achievement.description}</p>}</li>)}</ul></div>}
      </section>}

      <section id="contact" className="contact-band scroll-mt-20"><div className="section-wrap"><p className="eyebrow">06 / Contact</p><h2 className="contact-title mt-6">Let&apos;s build something that holds up.</h2><p className="contact-copy">I&apos;m open to discussing AI engineering roles, thoughtful product collaborations, and systems where the details matter.</p><div className="contact-links">
        {profileData.email ? <a href={`mailto:${profileData.email}`} className="action-link">{profileData.email} <span aria-hidden="true">↗</span></a> : <span className="action-link subtle">Email not set yet</span>}
        {profileData.githubUrl && <a href={profileData.githubUrl} target="_blank" rel="noreferrer" className="action-link subtle">GitHub ↗</a>}
        {profileData.linkedinUrl && <a href={profileData.linkedinUrl} target="_blank" rel="noreferrer" className="action-link subtle">LinkedIn ↗</a>}
      </div></div></section>
    </div>
  );
}
