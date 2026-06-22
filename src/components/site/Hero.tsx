import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { HeroParticles } from "./HeroParticles";
import { Typewriter } from "./Typewriter";
import { MagneticButton } from "./MagneticButton";
import { CountUp } from "./CountUp";
import { useTranslation } from "@/hooks/useTranslation";

type Stat = { value: number; prefix?: string; suffix?: string; decimals?: number; label: string };

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
} as const;

/**
 * Renders the hero description with editorial accents:
 *  - the word "everything" is emphasized in primary text
 *  - the closing clause "results that speak louder than promises" is set in italic serif
 * Falls back to plain text for non-English copy that doesn't contain the markers.
 */
function HeroDescription({ text }: { text: string }) {
  const emph = "everything";
  const italic = "results that speak louder than promises";

  const renderEmph = (s: string, base: string): ReactNode[] => {
    const i = s.indexOf(emph);
    if (i < 0) return [s];
    return [
      s.slice(0, i),
      <span key={base} className="font-medium text-text-primary">{emph}</span>,
      s.slice(i + emph.length),
    ];
  };

  const i = text.indexOf(italic);
  if (i < 0) return <>{text}</>;
  const head = text.slice(0, i);
  const tail = text.slice(i + italic.length);
  return (
    <>
      {renderEmph(head, "emph")}
      <span className="font-serif italic text-text-primary">{italic}</span>
      {tail}
    </>
  );
}

export function Hero() {
  const { t } = useTranslation();

  const stats = (t('hero.stats') as Stat[]) || [];

  const scrollTo = (id: string) => document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-24">
      <div className="dot-grid absolute inset-0 opacity-[0.04]" />
      <HeroParticles />

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16">
        <div className="order-1">
        <div className="font-mono-ui text-sm text-accent">
          <Typewriter text={t('hero.typewriter')} />
        </div>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.4 }}
          className="font-display mt-6 text-5xl font-extrabold leading-[0.9] tracking-[-0.03em] sm:text-6xl lg:text-7xl"
        >
          {t('hero.heading1')}
          <br />
          {t('hero.heading2')}
          <br />
          <span className="text-accent">{t('hero.heading3')}</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.6 }}
          className="mt-8 max-w-[580px] text-lg leading-relaxed text-text-secondary md:text-xl"
        >
          <HeroDescription text={t('hero.description')} />
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.8 }}
          className="mt-8 inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-bg-card/60 px-4 py-2"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative h-2 w-2 rounded-full bg-accent" />
          </span>
          <span className="text-sm text-text-secondary">{t('hero.status')}</span>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 1 }}
          className="mt-10 flex flex-wrap items-center gap-6"
        >
          <MagneticButton
            onClick={() => scrollTo("#work")}
            className="rounded-md bg-accent px-6 py-3 text-sm font-medium text-bg transition-colors hover:bg-accent-hover"
          >
            {t('hero.cta1')}
          </MagneticButton>
          <button
            onClick={() => scrollTo("#contact")}
            className="text-sm text-text-secondary underline-offset-4 hover:text-text-primary hover:underline"
          >
            {t('hero.cta2')}
          </button>
        </motion.div>
        </div>

        {/* Right: animated stat panel */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="order-2 w-full"
        >
          <div className="relative rounded-2xl border border-[var(--border)] bg-bg-card/60 p-6 backdrop-blur md:p-8">
            <div className="flex items-center justify-between">
              <span className="font-mono-ui text-xs uppercase tracking-wider text-text-tertiary">
                // by the numbers
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-3 py-1">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-75" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-accent" />
                </span>
                <span className="font-mono-ui text-[11px] text-text-secondary">live</span>
              </span>
            </div>

            <div className="mt-6 grid grid-cols-2 overflow-hidden rounded-xl border border-[var(--border)]">
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className={`p-5 md:p-6 border-[var(--border)] ${i % 2 === 0 ? "border-r" : ""} ${i < 2 ? "border-b" : ""}`}
                >
                  <div className="font-display text-3xl font-extrabold tracking-tight text-accent md:text-4xl">
                    <CountUp to={s.value} prefix={s.prefix} suffix={s.suffix} decimals={s.decimals} />
                  </div>
                  <div className="mt-1 text-xs text-text-secondary md:text-sm">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-5 font-mono-ui text-xs text-text-tertiary">
              measured in production · Yerevan, AM
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
