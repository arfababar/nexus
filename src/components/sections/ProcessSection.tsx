import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, Compass, Users, Rocket, Activity } from "lucide-react";

export interface ProcessStepItem {
  num: string;
  title: string;
  desc: string;
  tag: string;
  metric: string;
  icon: React.ReactNode;
}

const STEPS: ProcessStepItem[] = [
  {
    num: "01",
    title: "Discover & Audit",
    desc: "We analyze your customer journey, telemetry metrics, and pain points to engineer an exact operational profile.",
    tag: "PHASE 01 // TELEMETRY AUDIT",
    metric: "100% Workflow Mapping",
    icon: <Compass size={20} aria-hidden="true" />,
  },
  {
    num: "02",
    title: "Build Your Squad",
    desc: "We recruit, vet, and train specialized agents mapped to your tech stack, voice, and quality guidelines.",
    tag: "PHASE 02 // SQUAD ARCHITECTURE",
    metric: "Top 1.5% Vetted Talent",
    icon: <Users size={20} aria-hidden="true" />,
  },
  {
    num: "03",
    title: "Launch Operations",
    desc: "Your dedicated team goes live in 2–4 weeks with locked-in SLAs, real-time dashboards, and supervisory oversight.",
    tag: "PHASE 03 // LIVE DEPLOYMENT",
    metric: "2–4 Wk Rapid Go-Live",
    icon: <Rocket size={20} aria-hidden="true" />,
  },
  {
    num: "04",
    title: "Optimize & Scale",
    desc: "Continuous QA auditing, machine intelligence suggestions, and flexible burst capacity keep you ahead of demand.",
    tag: "PHASE 04 // ELASTIC SCALE",
    metric: "99.98% SLA Durability",
    icon: <Activity size={20} aria-hidden="true" />,
  },
];

const RING_RADIUS = 330;

export function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Unbounded integer step so 03 -> 04 -> 01 rotates smoothly in one direction
  const [rotationStep, setRotationStep] = useState(0);
  const activeIndex = ((rotationStep % 4) + 4) % 4;

  const [isMobileDeck, setIsMobileDeck] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragDeltaX, setDragDeltaX] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 30 });

  const dragStartRef = useRef<{ x: number; y: number; pointerId: number } | null>(null);

  // Detect <700px mobile viewport and prefers-reduced-motion
  useEffect(() => {
    const checkViewport = () => {
      setIsMobileDeck(window.innerWidth < 700);
    };
    checkViewport();
    window.addEventListener("resize", checkViewport);

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMq = () => setReducedMotion(mq.matches);
    onMq();
    mq.addEventListener("change", onMq);

    return () => {
      window.removeEventListener("resize", checkViewport);
      mq.removeEventListener("change", onMq);
    };
  }, []);

  // Reveal observer for section header
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

  const goNext = useCallback(() => {
    setRotationStep((prev) => prev + 1);
  }, []);

  const goPrev = useCallback(() => {
    setRotationStep((prev) => prev - 1);
  }, []);

  const goToIndex = useCallback(
    (targetIdx: number) => {
      setRotationStep((prev) => {
        const current = ((prev % 4) + 4) % 4;
        let diff = targetIdx - current;
        if (diff > 2) diff -= 4;
        if (diff < -2) diff += 4;
        return prev + diff;
      });
    },
    []
  );

  // Slow auto-advance (pauses on hover, drag, focus, or reduced-motion)
  useEffect(() => {
    if (reducedMotion || isPaused || isDragging) return;
    const timer = window.setInterval(() => {
      setRotationStep((prev) => prev + 1);
    }, 4800);
    return () => window.clearInterval(timer);
  }, [reducedMotion, isPaused, isDragging]);

  // Keyboard arrow navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goNext();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goPrev();
    }
  };

  // Pointer parallax + drag/swipe gesture
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Do not hijack clicks on explicit control buttons
    if ((e.target as HTMLElement).closest("button")) return;
    dragStartRef.current = { x: e.clientX, y: e.clientY, pointerId: e.pointerId };
    setIsDragging(true);
    setDragDeltaX(0);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if ( stageRef.current && !reducedMotion && !isMobileDeck ) {
      const rect = stageRef.current.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1;
      const ny = ((e.clientY - rect.top) / Math.max(1, rect.height)) * 2 - 1;
      setTilt({
        x: Math.max(-1, Math.min(1, -ny)) * 4.5,
        y: Math.max(-1, Math.min(1, nx)) * 5.5,
        glareX: Math.round(((nx + 1) / 2) * 100),
        glareY: Math.round(((ny + 1) / 2) * 100),
      });
    }

    if (isDragging && dragStartRef.current) {
      const dx = e.clientX - dragStartRef.current.x;
      setDragDeltaX(dx);
    }
  };

  const finishDrag = () => {
    if (!isDragging) return;
    if (dragDeltaX < -42) {
      goNext();
    } else if (dragDeltaX > 42) {
      goPrev();
    }
    dragStartRef.current = null;
    setIsDragging(false);
    setDragDeltaX(0);
  };

  const handlePointerLeave = () => {
    setIsPaused(false);
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 30 });
    if (isDragging) finishDrag();
  };

  // Ring rotation angle in degrees
  const dragAngleOffset = isDragging ? (dragDeltaX / 320) * 45 : 0;
  const ringRotateY = -rotationStep * 90 + dragAngleOffset + tilt.y;
  const ringRotateX = -5 + tilt.x;

  return (
    <section
      id="process"
      ref={sectionRef}
      className="process-section relative z-10"
      aria-labelledby="process-heading"
    >
      <div className="section">
        <div className="reveal flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <span className="section-label">
              <span className="section-label__line" />
              Engagement Framework
            </span>
            <h2 id="process-heading" className="section-heading">
              From Blueprint to <em>Full Scale</em>
            </h2>
            <p className="section-subheading">
              A battle-tested 4-step deployment cycle that launches your outsourced
              operations with zero downtime.
            </p>
          </div>

          {/* Step Indicator (01–04) + Progress Line + Prev/Next Controls */}
          {!reducedMotion && (
            <div
              className="process-controls"
              role="group"
              aria-label="Engagement framework step controls"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onFocusCapture={() => setIsPaused(true)}
              onBlurCapture={() => setIsPaused(false)}
            >
              <div className="process-indicator-row">
                <div className="process-step-pills" role="tablist" aria-label="Select deployment step">
                  {STEPS.map((s, idx) => {
                    const isActive = idx === activeIndex;
                    return (
                      <button
                        key={s.num}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        aria-label={`Step ${s.num}: ${s.title}`}
                        className={`process-pill${isActive ? " is-active" : ""}`}
                        onClick={() => goToIndex(idx)}
                      >
                        <span className="process-pill__num">{s.num}</span>
                        <span className="process-pill__label hidden sm:inline">
                          {s.title.split(" ")[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="process-nav-btns">
                  <button
                    type="button"
                    className="process-nav-btn"
                    aria-label="Previous step"
                    onClick={goPrev}
                  >
                    <ChevronLeft size={18} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="process-nav-btn"
                    aria-label="Next step"
                    onClick={goNext}
                  >
                    <ChevronRight size={18} aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="process-progress-track" aria-hidden="true">
                <div
                  className="process-progress-fill"
                  style={{ width: `${((activeIndex + 1) / STEPS.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* B5: Reduced Motion Fallback -> Simple Readable Grid */}
        {reducedMotion ? (
          <div className="process-reduced-grid mt-12">
            {STEPS.map((step) => (
              <article key={step.num} className="process-card-static">
                <div className="process-card3d__header">
                  <span className="process-card3d__tag">{step.tag}</span>
                  <span className="process-card3d__icon">{step.icon}</span>
                </div>
                <div className="process-card3d__num" aria-hidden="true">
                  {step.num}
                </div>
                <h3 className="process-card3d__title">{step.title}</h3>
                <p className="process-card3d__desc">{step.desc}</p>
                <div className="process-card3d__footer">
                  <span className="process-card3d__metric-dot" />
                  <span>{step.metric}</span>
                </div>
              </article>
            ))}
          </div>
        ) : isMobileDeck ? (
          /* B4: Mobile (<700px) Stacked 3D Z-Deck with Swipe to Cycle */
          <div
            ref={stageRef}
            className="process-mobile-deck-clip"
            tabIndex={0}
            role="region"
            aria-roledescription="carousel"
            aria-label="4-step deployment framework deck"
            onKeyDown={handleKeyDown}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={finishDrag}
            onPointerCancel={finishDrag}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={handlePointerLeave}
            onFocusCapture={() => setIsPaused(true)}
            onBlurCapture={() => setIsPaused(false)}
          >
            <div className="process-mobile-deck-scene">
              {STEPS.map((step, i) => {
                const rel = ((i - activeIndex) % 4 + 4) % 4; // 0 = front, 1 = next, 2 = mid, 3 = back
                const isFront = rel === 0;
                const zOffset = -rel * 55;
                const yOffset = rel * 18;
                const scale = 1 - rel * 0.055;
                const swipeX = isFront && isDragging ? dragDeltaX * 0.65 : 0;
                const swipeRotZ = isFront && isDragging ? dragDeltaX * 0.03 : 0;

                return (
                  <article
                    key={step.num}
                    className={`process-card3d process-card3d--deck${
                      isFront ? " is-front" : " is-back"
                    }`}
                    style={{
                      transform: `translate3d(${swipeX}px, ${yOffset}px, ${zOffset}px) scale(${scale}) rotateZ(${swipeRotZ}deg)`,
                      opacity: rel === 0 ? 1 : rel === 1 ? 0.72 : rel === 2 ? 0.42 : 0.18,
                      zIndex: 10 - rel,
                      transition: isDragging
                        ? "none"
                        : "transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.55s ease, border-color 0.4s ease",
                    }}
                    aria-hidden={!isFront}
                  >
                    <div className="process-card3d__header">
                      <span className="process-card3d__tag">{step.tag}</span>
                      <span className="process-card3d__icon">{step.icon}</span>
                    </div>

                    <div className="process-card3d__num-row">
                      <span className="process-card3d__num">{step.num}</span>
                      <span className="process-card3d__step-count">
                        STEP {step.num} / 04
                      </span>
                    </div>

                    <h3 className="process-card3d__title">{step.title}</h3>
                    <p className="process-card3d__desc">{step.desc}</p>

                    <div className="process-card3d__footer">
                      <span className="process-card3d__metric-dot" />
                      <span>{step.metric}</span>
                      <button
                        type="button"
                        className="process-card3d__cycle-btn ml-auto"
                        onClick={goNext}
                        aria-label={`Next step after ${step.title}`}
                      >
                        Next Step →
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
            <p className="process-deck-hint">
              Swipe card or tap controls to cycle deployment phases
            </p>
          </div>
        ) : (
          /* B1, B2, B3, B6: Desktop 3D Ring Carousel (perspective: 1400px, preserve-3d, rotateY(i * 90deg) translateZ(radius)) */
          <div
            ref={stageRef}
            className="process-stage-clip"
            tabIndex={0}
            role="region"
            aria-roledescription="carousel"
            aria-label="3D orbital ring of 4 deployment steps"
            onKeyDown={handleKeyDown}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={finishDrag}
            onPointerCancel={finishDrag}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={handlePointerLeave}
            onFocusCapture={() => setIsPaused(true)}
            onBlurCapture={() => setIsPaused(false)}
          >
            <div className="process-perspective-viewport">
              <div
                className="process-ring-pivot"
                style={{
                  transform: `translateZ(${-RING_RADIUS}px) rotateX(${ringRotateX}deg) rotateY(${ringRotateY}deg)`,
                  transition: isDragging
                    ? "none"
                    : "transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                {/* B3: Thin 3D Connector Orbit Rings & Center Core at different Z/Y depths */}
                <div
                  className="process-orbit-ring process-orbit-ring--outer"
                  aria-hidden="true"
                />
                <div
                  className="process-orbit-ring process-orbit-ring--inner"
                  aria-hidden="true"
                />
                <div
                  className="process-orbit-crosshair"
                  aria-hidden="true"
                />

                {STEPS.map((step, i) => {
                  const itemAngle = i * 90;
                  // Shortest angular distance from front (0 deg)
                  const rawDiff = (((itemAngle + ringRotateY) % 360) + 540) % 360 - 180;
                  const absDiff = Math.abs(rawDiff);
                  const isFront = i === activeIndex;
                  const isBack = absDiff > 135;

                  // Partial billboarding so side cards at ±90deg on the ring face ~48deg toward the viewer
                  // keeping text crisp and readable on every card angle while preserving true 3D ring perspective
                  const counterRotateY = -rawDiff * 0.52;
                  const cardScale = isFront ? 1.04 : isBack ? 0.82 : 0.91;

                  return (
                    <div
                      key={step.num}
                      className="process-ring-slot"
                      style={{
                        transform: `rotateY(${itemAngle}deg) translateZ(${RING_RADIUS}px)`,
                      }}
                    >
                      {/* B3: Floating 3D Number Glyph suspended at deeper Z depth above/behind each card */}
                      <div
                        className={`process-floating-glyph${
                          isFront ? " is-front" : ""
                        }`}
                        style={{
                          transform: `rotateY(${counterRotateY}deg) translate3d(0, -148px, ${
                            isFront ? 46 : -24
                          }px)`,
                        }}
                        aria-hidden="true"
                      >
                        {step.num}
                      </div>

                      {/* Card Button / Surface */}
                      <article
                        className={`process-card3d${
                          isFront
                            ? " is-front"
                            : isBack
                              ? " is-far-back"
                              : " is-side"
                        }`}
                        style={{
                          transform: `rotateY(${counterRotateY}deg) scale(${cardScale})`,
                          transition: isDragging
                            ? "none"
                            : "transform 0.8s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.45s ease, border-color 0.45s ease, background-color 0.45s ease",
                        }}
                        onClick={() => {
                          if (!isDragging && i !== activeIndex) {
                            goToIndex(i);
                          }
                        }}
                      >
                        {/* B3: Dynamic Glare Highlight on Front Card */}
                        {isFront && (
                          <div
                            className="process-card3d__glare"
                            style={{
                              background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(124, 232, 138, 0.16) 0%, rgba(34, 211, 238, 0.06) 38%, transparent 70%)`,
                            }}
                            aria-hidden="true"
                          />
                        )}

                        <div className="process-card3d__header">
                          <span className="process-card3d__tag">{step.tag}</span>
                          <span className="process-card3d__icon">{step.icon}</span>
                        </div>

                        <div className="process-card3d__num-row">
                          <span className="process-card3d__num">{step.num}</span>
                          <span className="process-card3d__step-count">
                            STEP {step.num} / 04
                          </span>
                        </div>

                        <h3 className="process-card3d__title">{step.title}</h3>
                        <p className="process-card3d__desc">{step.desc}</p>

                        <div className="process-card3d__footer">
                          <span className="process-card3d__metric-dot" />
                          <span>{step.metric}</span>
                          {!isFront && (
                            <button
                              type="button"
                              className="process-card3d__focus-btn ml-auto"
                              onClick={(e) => {
                                e.stopPropagation();
                                goToIndex(i);
                              }}
                              aria-label={`Rotate ring to step ${step.num}: ${step.title}`}
                            >
                              Focus
                            </button>
                          )}
                        </div>
                      </article>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default ProcessSection;
