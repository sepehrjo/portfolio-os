import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";

interface Stat {
  value: string;
  label: string;
}

interface Project {
  url: string;
  bgClass: string;
  centerText: string;
  category: string;
  title: string;
  description: string;
  highlights: string[];
  tags: string[];
  github: string;
  demo: string;
  screenshots?: { src: string; alt: string }[];
  stats?: Stat[];
}

function BrowserChrome({ url }: { url: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-[var(--border)] bg-black/40 px-4 py-3">
      <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
      <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
      <span className="h-3 w-3 rounded-full bg-[#28C840]" />
      <div className="ml-4 flex-1 rounded bg-black/40 px-3 py-1 font-mono-ui text-xs text-text-tertiary">{url}</div>
    </div>
  );
}

/**
 * Editorial stat row. Stats are not stored in the DB, so we resolve a sensible
 * three-stat set per project. `p.stats` (if ever provided) always wins.
 */
function statsFor(p: Project): Stat[] {
  if (p.stats && p.stats.length) return p.stats;
  const t = p.title.toLowerCase();
  if (t.includes("ariana")) {
    return [
      { value: "<180ms", label: "RTL/LTR switch" },
      { value: "5", label: "viewports" },
      { value: "3", label: "languages" },
    ];
  }
  if (t.includes("forma")) {
    return [
      { value: "60fps", label: "WebGL hero" },
      { value: "4", label: "languages" },
      { value: "0", label: "Tailwind" },
    ];
  }
  return [];
}

function ProjectRow({ p, index }: { p: Project; index: number }) {
  const { t } = useTranslation();

  // Tag pills come from the category, split on the middot separator.
  const pills = p.category.split("·").map((s) => s.trim()).filter(Boolean);

  // Two-tone title: bold primary lead, muted remainder after the em dash.
  const [lead, ...restParts] = p.title.split("—");
  const titleLead = lead.trim();
  const titleRest = restParts.join("—").trim();

  const stats = statsFor(p);
  const img = p.screenshots && p.screenshots.length > 0 ? p.screenshots[0] : null;

  const caseHref =
    p.demo && p.demo !== "#" ? p.demo : p.github && p.github !== "#" ? p.github : null;

  // Alternate image/text sides on desktop (even = image left, odd = image right).
  const imageRight = index % 2 === 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="grid items-center gap-10 md:grid-cols-2 md:gap-16"
    >
      {/* Image — single framed screenshot, fitted to the browser mockup */}
      <div className={imageRight ? "md:order-2" : "md:order-1"}>
        <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-bg-card transition-colors duration-300 hover:border-[var(--border-hover)]">
          <BrowserChrome url={p.url} />
          <div className="relative aspect-[16/11] w-full overflow-hidden">
            {img ? (
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
            ) : (
              <div className={`flex h-full w-full items-center justify-center ${p.bgClass}`}>
                <div className="absolute inset-0 dot-grid opacity-[0.06]" />
                <h3 className="font-display relative px-6 text-center text-2xl font-bold text-text-primary md:text-4xl">
                  {p.centerText}
                </h3>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Details */}
      <div className={imageRight ? "md:order-1" : "md:order-2"}>
        {/* Tag pills */}
        <div className="flex flex-wrap gap-2">
          {pills.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[var(--border)] px-3 py-1 font-mono-ui text-xs text-text-secondary"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Two-tone title */}
        <h3 className="font-display mt-6 text-3xl font-bold leading-[1.1] tracking-tight md:text-4xl">
          <span className="text-text-primary">{titleLead}</span>
          {titleRest && <span className="text-text-tertiary"> — {titleRest}</span>}
        </h3>

        {/* Description */}
        <p className="mt-5 max-w-xl text-base leading-relaxed text-text-secondary md:text-lg">
          {p.description}
        </p>

        {/* Stats */}
        {stats.length > 0 && (
          <div className="mt-8 grid max-w-md grid-cols-3 gap-4 border-t border-[var(--border)] pt-8">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="font-display text-2xl font-bold text-accent md:text-3xl">{s.value}</div>
                <div className="mt-1 text-xs text-text-tertiary md:text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* View case study */}
        {caseHref && (
          <a
            href={caseHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-1.5 text-base font-medium text-text-primary transition-colors hover:text-accent"
          >
            {t('projects.viewCaseStudy')}
            <ArrowUpRight size={18} className="text-accent" />
          </a>
        )}
      </div>
    </motion.div>
  );
}

export function Projects() {
  const { t } = useTranslation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load projects:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section id="work" className="py-28">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="text-text-secondary">{t('projects.loading')}</div>
        </div>
      </section>
    );
  }

  return (
    <section id="work" className="py-28">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="font-mono-ui text-sm text-accent">{t('projects.label')}</div>
          <h2 className="font-display mt-4 text-4xl font-bold md:text-5xl">{t('projects.title')}</h2>
          <p className="mt-4 text-base text-text-secondary md:text-lg">
            {t('projects.subtitle')}
          </p>
        </motion.div>

        <div className="mt-20 space-y-24 md:space-y-32">
          {projects.map((p, i) => (
            <ProjectRow key={p.title} p={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
