import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable for fine pointers (mouse), not touch screens
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!isFinePointer || prefersReducedMotion) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setIsVisible(true);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest("button, a, input, textarea, select, [role='button'], .card, .service-card, .diff-card");
      setIsHovered(!!interactive);
    };

    // Smooth physics ring loop
    const render = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }
      rafId = requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseover", onMouseOver, { passive: true });
    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseover", onMouseOver);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden hidden md:block"
      style={{ opacity: isVisible ? 1 : 0, transition: "opacity 0.3s ease" }}
      aria-hidden="true"
    >
      {/* Exact pinpoint center dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 -ml-[3px] -mt-[3px] rounded-full bg-[#7CE88A] shadow-[0_0_8px_#7CE88A] will-change-transform"
      />

      {/* Lagging magnetic glowing ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 rounded-full border border-[#7CE88A]/60 bg-[#7CE88A]/10 backdrop-blur-[1px] will-change-transform transition-[width,height,margin,border-color] duration-200"
        style={{
          width: isHovered ? "46px" : "26px",
          height: isHovered ? "46px" : "26px",
          marginLeft: isHovered ? "-23px" : "-13px",
          marginTop: isHovered ? "-23px" : "-13px",
          borderColor: isHovered ? "rgba(124, 232, 138, 0.9)" : "rgba(124, 232, 138, 0.45)",
          boxShadow: isHovered ? "0 0 16px rgba(124, 232, 138, 0.35)" : "none",
        }}
      />
    </div>
  );
}

export default CustomCursor;
