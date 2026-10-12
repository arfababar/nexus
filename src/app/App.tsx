import React, { useState, useEffect, useRef, Suspense } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShaderBackground } from "@/components/ui/sih";
import { TiltedGridHero } from "@/components/ui/tilted-grid-hero";
import Timeline from "@/components/ui/timeline";
import ShutterGlyphFooter from "@/components/ui/shutter-glyph-footer";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { InteractiveButton3D } from "@/components/3d/InteractiveButton3D";
import { Card3DTilt } from "@/components/ui/Card3DTilt";
import { Counter } from "@/components/ui/Counter";
import { PartnersSection } from "@/components/sections/PartnersSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import {
  ArrowRight,
  ChevronDown,
  Users,
  BarChart3,
  Zap,
  Shield,
  Clock,
  CheckCheck,
  Send,
  Check,
} from "lucide-react";

const ReactiveArtifacts = React.lazy(
  () => import("@/components/3d/ReactiveArtifacts")
);
const DisperseArtifact = React.lazy(
  () => import("@/components/3d/DisperseArtifact")
);

/* ─── Curated BPO Imagery for TiltedGridHero ────────────────────────── */
const BPO_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?w=640&q=75",
    alt: "Global Customer Support Specialists",
  },
  {
    src: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=640&q=75",
    alt: "Enterprise Operations Command Center",
  },
  {
    src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=640&q=75",
    alt: "Technology Support Engineering",
  },
  {
    src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=640&q=75",
    alt: "Modern Global Headquarters",
  },
  {
    src: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=640&q=75",
    alt: "Collaborative Operations Squad",
  },
  {
    src: "https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=640&q=75",
    alt: "Cloud Infrastructure Architecture",
  },
  {
    src: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=640&q=75",
    alt: "Business Intelligence & Analytics",
  },
  {
    src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=640&q=75",
    alt: "Executive Delivery Leadership",
  },
  {
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=640&q=75",
    alt: "Dedicated Client Solutions Architect",
  },
  {
    src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=640&q=75",
    alt: "Enterprise Strategy Consultation",
  },
];

/* ─── Splash Screen ─────────────────────────────────────────────────── */
function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [exiting, setExiting] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setExiting(true);
    }, 1400);
    const doneTimer = setTimeout(() => {
      onCompleteRef.current();
    }, 2000);
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  return (
    <div
      className={`splash-screen${exiting ? " is-exiting" : ""}`}
      role="status"
      aria-label="Loading Nexus BPO Experience"
    >
      <div className="splash-orb">
        <div className="splash-orb-inner" />
        <div className="splash-ring" />
        <div className="splash-ring-2" />
      </div>
      <p className="splash-wordmark">
        NEXUS<em style={{ color: "#7CE88A", fontStyle: "normal" }}>.</em>BPO
      </p>
      <p className="splash-tagline">Elite Business Process Outsourcing</p>
      <div className="splash-dots" aria-hidden="true">
        <span className="splash-dot" />
        <span className="splash-dot" />
        <span className="splash-dot" />
      </div>
    </div>
  );
}

/* ─── Site Header ───────────────────────────────────────────────────── */
function SiteHeader({
  onTalkClick,
  onNavigate,
}: {
  onTalkClick: () => void;
  onNavigate: (href: string) => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "#journey", label: "Services" },
    { href: "#process", label: "How It Works" },
    { href: "#why-us", label: "Why Us" },
    { href: "#testimonials", label: "Testimonials" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <header
      className={`site-header${scrolled ? " scrolled" : ""}`}
      role="banner"
    >
      <div className="site-header__inner">
        <a href="#" className="site-logo" aria-label="Nexus BPO Home">
          <div className="site-logo__mark" aria-hidden="true">
            <svg
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="14"
                cy="14"
                r="12"
                stroke="#7CE88A"
                strokeWidth="1.5"
                strokeOpacity="0.4"
              />
              <circle cx="14" cy="14" r="6" fill="#7CE88A" fillOpacity="0.2" />
              <path
                d="M14 2 L14 8 M14 20 L14 26 M2 14 L8 14 M20 14 L26 14"
                stroke="#7CE88A"
                strokeWidth="1.5"
                strokeOpacity="0.6"
              />
              <circle cx="14" cy="14" r="3" fill="#7CE88A" />
            </svg>
          </div>
          <span className="site-logo__wordmark">
            NEXUS<em>.</em>BPO
          </span>
        </a>

        <nav
          className={`site-nav${navOpen ? " is-open" : ""}`}
          aria-label="Primary navigation"
        >
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="nav-link"
              onClick={(e) => {
                e.preventDefault();
                setNavOpen(false);
                onNavigate(href);
              }}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="site-header__cta">
          <div className="status-badge hidden sm:inline-flex">
            <span className="status-dot" />
            NOC ONLINE
          </div>
          <button
            type="button"
            className="btn-primary"
            style={{ padding: "8px 18px", fontSize: "0.8rem" }}
            onClick={onTalkClick}
          >
            Let's Talk
          </button>
          <button
            type="button"
            className={`nav-toggle${navOpen ? " is-open" : ""}`}
            aria-expanded={navOpen}
            aria-label={navOpen ? "Close menu" : "Open menu"}
            onClick={() => setNavOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}

/* ─── Hero Section with ShaderBackground, TiltedGridHero & DisperseArtifact ─ */
function HeroSection({
  onTalkClick,
  onServicesClick,
}: {
  onTalkClick: () => void;
  onServicesClick: () => void;
}) {
  return (
    <section className="hero-section" id="hero" aria-label="Hero Section">
      {/* 21st.dev Component #1: ShaderBackground (WebGL Silk) */}
      <div className="hero-shader-bg" aria-hidden="true">
        <ShaderBackground className="absolute inset-0" />
      </div>

      {/* Atmospheric gradient overlay for typography contrast */}
      <div className="hero-overlay" aria-hidden="true" />

      {/* 21st.dev Component #2: TiltedGridHero (3D Cylinder Image Reel) */}
      <div className="hero-grid-layer" aria-hidden="true">
        <TiltedGridHero
          images={BPO_IMAGES}
          speed={5}
          tileHeight={28}
          aspectRatio={16 / 9}
          gap={5}
          axis={62}
          curve={75}
          fade={14}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* Hero Foreground Content: Headline on left, DisperseArtifact on right (below on mobile) */}
      <div className="hero-content">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-12 w-full">
          <div className="lg:col-span-7 flex flex-col items-start">
            <span className="hero-eyebrow">
              <span className="hero-eyebrow-dot" aria-hidden="true" />
              Elite Business Process Outsourcing
            </span>

            <h1 className="hero-headline">
              Operations That
              <br />
              <em className="text-shimmer">Scale With You.</em>
            </h1>

            <p className="hero-subline">
              Nexus BPO delivers high-throughput customer support, technical
              operations, and automated back-office solutions — so you can focus on
              growth.
            </p>

            {/* C3: Three.js Animated 3D Interactive Buttons */}
            <div className="hero-actions">
              <InteractiveButton3D
                variant="primary"
                onClick={onTalkClick}
                aria-label="Let's Talk - Contact Nexus BPO"
              >
                Let's Talk
                <ArrowRight size={16} aria-hidden="true" />
              </InteractiveButton3D>

              <InteractiveButton3D
                variant="secondary"
                onClick={onServicesClick}
                aria-label="Explore BPO Services"
              >
                Explore Services
                <ChevronDown size={16} aria-hidden="true" />
              </InteractiveButton3D>
            </div>
          </div>

          <div className="lg:col-span-5 w-full">
            <Suspense fallback={<div className="w-full h-[260px] lg:h-[440px]" />}>
              <DisperseArtifact />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll-hint" aria-hidden="true">
        <span className="hero-scroll-hint__line" />
        <span className="hero-scroll-hint__label">Scroll</span>
      </div>
    </section>
  );
}

/* ─── Why Us Section with Animated Counters ─────────────────────────── */
const DIFFS = [
  {
    icon: <Zap size={22} />,
    title: "Rapid Deployment",
    desc: "Fully operational squads active in 2–4 weeks. No protracted recruiting delays, zero ramp-up downtime.",
  },
  {
    icon: <Shield size={22} />,
    title: "SOC2 & ISO 27001",
    desc: "Rigorous cyber defense, GDPR, CCPA, and PCI-DSS compliance built into every terminal and workstation.",
  },
  {
    icon: <Users size={22} />,
    title: "Elastic Scalability",
    desc: "Seamlessly scale from 5 to 500 agents during seasonal spikes with zero restrictive long-term contracts.",
  },
  {
    icon: <CheckCheck size={22} />,
    title: "Continuous QA Audits",
    desc: "Dedicated QA analysts, double-blind scorecard reviews, and automated sentiment tracking on 100% of logs.",
  },
  {
    icon: <Clock size={22} />,
    title: "Follow-the-Sun 24/7",
    desc: "Synchronized global delivery centers ensure your customers receive instant answers no matter the timezone.",
  },
  {
    icon: <BarChart3 size={22} />,
    title: "Live Telemetry Portal",
    desc: "Direct access to real-time dashboards, CSAT trends, ticket resolution speeds, and SLA metrics.",
  },
];

function WhyUsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (e) => e.isIntersecting && e.target.classList.add("is-visible")
        ),
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    sectionRef.current
      ?.querySelectorAll(".reveal, .section-label")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="why-us" ref={sectionRef} className="relative py-24 px-4 z-10">
      <div className="section">
        <div className="reveal">
          <span className="section-label">
            <span className="section-label__line" />
            Operational Edge
          </span>
          <h2 className="section-heading">
            Engineered for <em>High Velocity</em>
          </h2>
          <p className="section-subheading">
            Six architectural pillars that make Nexus BPO the definitive operational partner
            for ambitious enterprises.
          </p>
        </div>

        <div className="differentiators-grid">
          {DIFFS.map((d, i) => (
            <div
              key={d.title}
              className={`reveal reveal-delay-${(i % 4) + 1}`}
            >
              <Card3DTilt maxTilt={8} glare={true} className="diff-card">
                <div className="diff-card__icon" aria-hidden="true">
                  {d.icon}
                </div>
                <h3 className="diff-card__title">{d.title}</h3>
                <p className="diff-card__desc">{d.desc}</p>
              </Card3DTilt>
            </div>
          ))}
        </div>

        {/* Animated KPI Stats Bar */}
        <div className="stats-strip reveal reveal-delay-2">
          <div className="stat-item">
            <span className="stat-item__value">
              <Counter value={98} suffix="%" />
            </span>
            <span className="stat-item__label">Global CSAT Benchmark</span>
          </div>

          <div className="stat-item">
            <span className="stat-item__value">
              <Counter value={2} suffix="–4wk" />
            </span>
            <span className="stat-item__label">Average Launch Speed</span>
          </div>

          <div className="stat-item">
            <span className="stat-item__value">
              <Counter value={500} suffix="+" />
            </span>
            <span className="stat-item__label">Dedicated Specialists</span>
          </div>

          <div className="stat-item">
            <span className="stat-item__value">
              <Counter value={40} suffix="%" />
            </span>
            <span className="stat-item__label">Average Overhead Reduction</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Contact Section with Validation & Animations ──────────────────── */
function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (e) => e.isIntersecting && e.target.classList.add("is-visible")
        ),
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    sectionRef.current
      ?.querySelectorAll(".reveal, .section-label")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Full name is required";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Valid corporate email required";
    if (!message.trim()) errs.message = "Please describe your operational needs";
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }
    setErrors({});
    setSubmitted(true);
  };

  return (
    <section id="contact" ref={sectionRef} className="relative py-24 px-4 z-10">
      <div className="cta-section">
        <div className="cta-card">
          <p className="cta-eyebrow">// READY TO SCALE</p>
          <h2 className="cta-heading">
            Let's Build Something
            <br />
            <em className="text-shimmer">High-Velocity.</em>
          </h2>
          <p className="cta-subheading">
            Tell us about your operational roadmap. We will deliver a bespoke
            capacity proposal within 24 hours.
          </p>

          <div className="cta-actions reveal mb-10">
            <a
              href="mailto:partnerships@nexusbpo.com"
              className="btn-secondary inline-flex items-center gap-2"
            >
              <span>partnerships@nexusbpo.com</span>
            </a>
          </div>

          <div className="contact-form-wrap reveal reveal-delay-2">
            {submitted ? (
              <div
                className="form-success p-8 rounded-3xl bg-white/[0.03] border border-[#7CE88A]/30 backdrop-blur-md"
                role="status"
              >
                <div className="form-success__icon" aria-hidden="true">
                  <Check size={28} />
                </div>
                <p className="form-success__title text-2xl font-bold font-display text-white mt-4">
                  Intake Received
                </p>
                <p className="form-success__message text-zinc-300 mt-2 max-w-md mx-auto">
                  Thank you, <strong>{name}</strong>. An enterprise solutions
                  director will reach out to <strong>{email}</strong> within
                  one business day with a customized capacity plan.
                </p>
                <p className="form-note mt-6 text-zinc-500 text-xs text-center">
                  (Frontend demonstration confirmation — simulated intake)
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setName("");
                    setEmail("");
                    setCompany("");
                    setMessage("");
                  }}
                  className="mt-6 px-4 py-2 rounded-xl text-xs font-mono text-[#7CE88A] border border-[#7CE88A]/30 hover:bg-[#7CE88A]/10 transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form
                className={`contact-form text-left ${
                  isShaking ? "animate-shake" : ""
                }`}
                onSubmit={handleSubmit}
                noValidate
                aria-label="Enterprise Contact Intake"
              >
                <div className="form-row">
                  <div className="form-field">
                    <label className="form-label" htmlFor="cf-name">
                      Full Name *
                    </label>
                    <input
                      id="cf-name"
                      className="form-input"
                      type="text"
                      placeholder="Alex Vance"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      aria-required="true"
                      aria-invalid={!!errors.name}
                    />
                    {errors.name && (
                      <span className="text-red-400 text-xs mt-1">
                        {errors.name}
                      </span>
                    )}
                  </div>

                  <div className="form-field">
                    <label className="form-label" htmlFor="cf-email">
                      Corporate Email *
                    </label>
                    <input
                      id="cf-email"
                      className="form-input"
                      type="email"
                      placeholder="alex@enterprise.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      aria-required="true"
                      aria-invalid={!!errors.email}
                    />
                    {errors.email && (
                      <span className="text-red-400 text-xs mt-1">
                        {errors.email}
                      </span>
                    )}
                  </div>
                </div>

                <div className="form-field">
                  <label className="form-label" htmlFor="cf-company">
                    Company / Organization
                  </label>
                  <input
                    id="cf-company"
                    className="form-input"
                    type="text"
                    placeholder="Acme Global Inc."
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>

                <div className="form-field">
                  <label className="form-label" htmlFor="cf-message">
                    Operational Requirements *
                  </label>
                  <textarea
                    id="cf-message"
                    className="form-textarea"
                    placeholder="Tell us about desired headcount, timezone coverage, or service scopes..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    aria-required="true"
                    aria-invalid={!!errors.message}
                  />
                  {errors.message && (
                    <span className="text-red-400 text-xs mt-1">
                      {errors.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                  <p className="form-note text-xs text-zinc-500">
                    Encrypted intake · Response within 24 business hours
                  </p>
                  <InteractiveButton3D
                    type="submit"
                    variant="primary"
                    className="w-full sm:w-auto"
                  >
                    <span>Submit Proposal Request</span>
                    <Send size={15} aria-hidden="true" />
                  </InteractiveButton3D>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Main Application Container ────────────────────────────────────── */
export const App: React.FC = () => {
  const [splashDone, setSplashDone] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const lenisRef = useRef<Lenis | null>(null);

  // Initialize Lenis smooth scroll synced with GSAP ScrollTrigger
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.2,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const tickerCallback = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    const onScroll = () => {
      const total =
        document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        setScrollProgress((window.scrollY / total) * 100);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const refreshTriggers = () => {
      ScrollTrigger.refresh();
    };

    document.fonts?.ready?.then(refreshTriggers);
    window.addEventListener("load", refreshTriggers);

    return () => {
      window.removeEventListener("load", refreshTriggers);
      window.removeEventListener("scroll", onScroll);
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!splashDone) return;
    const id = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
    return () => cancelAnimationFrame(id);
  }, [splashDone]);

  const scrollToTarget = (selector: string) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(selector);
    } else {
      document.querySelector(selector)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToContact = () => {
    scrollToTarget("#contact");
  };

  const scrollToServices = () => {
    scrollToTarget("#journey");
  };

  return (
    <>
      {/* Precision Glowing Custom Cursor */}
      <CustomCursor />

      {/* Lenis Smooth Scroll Progress Indicator */}
      <div
        className="scroll-progress-bar"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      {/* Fixed Background 3D Floating Reactive Artifacts (z-index: 0, pointer-events: none) */}
      <Suspense fallback={null}>
        <ReactiveArtifacts />
      </Suspense>

      {/* Splash Screen */}
      {!splashDone && <SplashScreen onComplete={() => setSplashDone(true)} />}

      <div
        className="relative z-10"
        style={{
          opacity: splashDone ? 1 : 0,
          transition: "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
        }}
      >
        <SiteHeader
          onTalkClick={scrollToContact}
          onNavigate={scrollToTarget}
        />

        {/* Page Flow: Hero > Partners > Timeline (Core Solutions) > How It Works > Why Us > Testimonials > Contact > Footer */}
        <main id="main-content">
          <HeroSection
            onTalkClick={scrollToContact}
            onServicesClick={scrollToServices}
          />
          <PartnersSection />
          <Timeline
            title="Core Solutions"
            periodLabel="2020 — 2026"
            backgroundColor="var(--background)"
            textColor="var(--foreground)"
            mutedTextColor="var(--muted-foreground)"
            activeColor="#7CE88A"
            imageUrl="https://cdn.21st.dev/assets/mirror/b0/b0c41784074f76ac5fb6b447da87780c901135841317a096241371f24bc13ddd.jpg"
            imageAlt="Team at work in a bright studio"
            duration={1.4}
          />
          <ProcessSection />
          <WhyUsSection />
          <TestimonialsSection />
          <ContactSection />
        </main>

        <ShutterGlyphFooter
          brand="Nexus"
          wordmark="NEXUS"
          shutterAt={2}
          company="Nexus BPO"
          since={2020}
          signupLabel="Sign up for BPO insights & updates"
          background="rgb(6, 10, 15)"
          ink="#CFEFD6"
          socials={[
            { label: "LinkedIn", href: "#" },
            { label: "Instagram", href: "#" },
            { label: "X", href: "#" },
          ]}
          legal={[
            { label: "Terms & Conditions", href: "#" },
            { label: "Privacy Policy", href: "#" },
            { label: "Cookies Policy", href: "#" },
          ]}
        />
      </div>
    </>
  );
};

export default App;
