import { createFileRoute } from "@tanstack/react-router";

const D1_DATABASE_ID = "0fab311a-138f-48e3-a581-d451d4da2258";
const D1_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || "";
const D1_TOKEN = process.env.CLOUDFLARE_API_TOKEN || "";

// Appended to whatever the DB / fallback returns (after Ariana + FORMA).
// The "coming soon" placeholder cards were removed; this keeps the one real
// in-progress project. `stats` drives the editorial stat row directly.
const EXTRA_PROJECTS = [
  {
    url: "app.ai-outreach.dev",
    bgClass: "bg-gradient-to-br from-[#1f1a12] via-[#15110a] to-[#0d0a06]",
    centerText: "AI Outreach System",
    category: "Full-Stack · AI · Automation",
    title: "AI Outreach System — Automated Freelance Lead Gen",
    description:
      "This is an automated cold outreach assistant designed for freelance full-stack development services. It takes a company name and their website, researches what they do, and drafts a personalised cold email that you can review and send.",
    highlights: [
      "Input a company name and website to begin",
      "Automatically researches what the company does",
      "Drafts a personalised cold email tailored to each prospect",
      "Human-in-the-loop: review and edit before sending",
    ],
    tags: ["Next.js", "TypeScript", "OpenAI API", "Node.js", "Automation"],
    github: "",
    demo: "",
    stats: [
      { value: "2 inputs", label: "name + website" },
      { value: "AI", label: "drafted emails" },
      { value: "100%", label: "human-reviewed" },
    ],
    screenshots: [
      { src: "/assets/outreach-sample.svg", alt: "AI Outreach System — sample interface" },
    ],
  },
];

export const Route = createFileRoute("/api/projects/")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          // Try environment binding first
          try {
            const { getDevEnv } = await import("@/lib/platform");
            const { getDb } = await import("@/lib/db/client");
            const { getVisibleProjects } = await import("@/lib/db/projects-queries");
            
            const env = await getDevEnv();
            const db = getDb(env);
            const projects = await getVisibleProjects(db);

            if (projects && projects.length > 0) {
              const transformed = projects.map((p) => ({
                url: p.url,
                bgClass: p.bg_class,
                centerText: p.center_text,
                category: p.category,
                title: p.title,
                description: p.description,
                highlights: p.highlights,
                tags: p.tags,
                github: p.github,
                demo: p.demo,
                screenshots: p.screenshots,
              }));

              return new Response(JSON.stringify([...transformed, ...EXTRA_PROJECTS]), {
                status: 200,
                headers: { "Content-Type": "application/json" },
              });
            }
          } catch (bindingError) {
            // Binding not available; fall back to hardcoded projects below
          }

          // Fallback: Return hardcoded data based on what's in the DB
          const hardcodedProjects = [
            {
              url: "arianasepehr.vercel.app",
              bgClass: "bg-gradient-to-br from-[#1a2030] via-[#0f1520] to-[#0a0e18]",
              centerText: "B2B Export Platform",
              category: "Full-Stack · Next.js · AI Integration",
              title: "Ariana Global Trade — B2B Export Portal",
              description: "A premium B2B showcase for an agricultural commodities exporter targeting international wholesale importers. Built with genuine engineering depth: multi-language support including full Persian RTL layout switching, a dynamic volume-based pricing calculator, and an OpenAI-powered pre-qualification chatbot that routes leads automatically.",
              highlights: [
                "RTL/LTR layout switching under 180ms (EN · FA · HY)",
                "AI chat concierge with OpenAI API + graceful fallback handling",
                "Volume-tier pricing calculator running entirely client-side",
                "Responsive across 5 viewport breakpoints with sub-180ms page load"
              ],
              tags: ["Next.js 14", "TypeScript", "Tailwind CSS", "Framer Motion", "OpenAI API", "RTL Support", "React 19", "Vercel"],
              github: "https://github.com/sepehrjo/ariana-b2b-export",
              demo: "https://arianasepehr.vercel.app",
              screenshots: [
                { src: "/assets/preview-en.png", alt: "Ariana homepage" },
                { src: "/assets/languages-support.png", alt: "Multi-language support" },
                { src: "/assets/chatbot-sensitivity.png", alt: "AI chatbot" },
                { src: "/assets/quote-inquiry.png", alt: "Quote form" }
              ]
            },
            {
              url: "adart-alpha.vercel.app",
              bgClass: "bg-[#0B0B0B]",
              centerText: "Creative Agency Website",
              category: "Frontend · React 19 · Three.js · WebGL",
              title: "FORMA Studio — Art Direction & Advertising",
              description: "A premium showcase website for FORMA, an avant-garde art direction and advertising studio — built to demonstrate advanced frontend engineering. The centrepiece is a real-time Three.js WebGL scene in the hero that pauses GPU rendering via IntersectionObserver when off-screen, maintaining 60fps across all device tiers. The site is fully multilingual across four scripts — including dynamic Persian RTL — built entirely in CSS Modules.",
              highlights: [
                "Three.js WebGL 3D hero with IntersectionObserver render-pausing — zero GPU/CPU usage when scrolled out of view",
                "Full RTL/LTR layout engine for EN · RU · FA · HY via i18next with mirrored grid, alignment, and absolute positioning",
                "Zero-Tailwind CSS Modules architecture — fully scoped styles with no global override risk across every component"
              ],
              tags: ["React 19", "TypeScript", "Three.js", "@react-three/fiber", "Framer Motion", "i18next", "RTL Support", "CSS Modules", "Vite"],
              github: "https://github.com/sepehrjo/Ad_Art_Web",
              demo: "https://adart-alpha.vercel.app",
              screenshots: [
                { src: "/assets/hero_en.png", alt: "FORMA hero" },
                { src: "/assets/portfolio.png", alt: "FORMA portfolio" },
                { src: "/assets/journal.png", alt: "FORMA journal" },
                { src: "/assets/contact.png", alt: "FORMA contact" }
              ]
            }
          ];

          return new Response(JSON.stringify([...hardcodedProjects, ...EXTRA_PROJECTS]), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          console.error("Projects API error:", error);
          return new Response(JSON.stringify([]), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
