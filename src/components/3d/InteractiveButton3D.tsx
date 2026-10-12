import React, { useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface InteractiveButton3DProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function InteractiveButton3D({
  children,
  variant = "primary",
  className,
  onClick,
  ...props
}: InteractiveButton3DProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [lightPos, setLightPos] = useState({ x: 50, y: 50 });
  const [isPressed, setIsPressed] = useState(false);
  const [bursts, setBursts] = useState<Array<{ id: number; x: number; y: number }>>([]);

  // Magnetic cursor follow & specular light sweep
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;

    // Specular light coordinates (in %)
    const lightX = (relX / rect.width) * 100;
    const lightY = (relY / rect.height) * 100;
    setLightPos({ x: lightX, y: lightY });

    // Magnetic pull offset (up to ±8px)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const pullX = ((relX - centerX) / centerX) * 8;
    const pullY = ((relY - centerY) / centerY) * 6;
    setOffset({ x: pullX, y: pullY });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setOffset({ x: 0, y: 0 });
    setLightPos({ x: 50, y: 50 });
    setIsPressed(false);
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Particle ripple burst on click
      const newBurst = { id: Date.now(), x, y };
      setBursts((prev) => [...prev, newBurst]);
      setTimeout(() => {
        setBursts((prev) => prev.filter((b) => b.id !== newBurst.id));
      }, 700);

      onClick?.(e);
    },
    [onClick]
  );

  const isPrimary = variant === "primary";

  return (
    <button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onClick={handleClick}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${isPressed ? 0.96 : 1})`,
        transition: isPressed
          ? "transform 0.08s ease"
          : "transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      className={cn(
        "relative group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-sans font-semibold text-sm cursor-pointer select-none overflow-hidden outline-none will-change-transform shadow-lg",
        isPrimary
          ? "bg-[#7CE88A] text-[#060A0F] shadow-[#7CE88A]/25 hover:shadow-[#7CE88A]/45 hover:bg-[#8efaa0]"
          : "bg-white/[0.04] text-white border border-white/15 hover:border-[#7CE88A]/60 hover:bg-white/[0.08] shadow-black/40",
        className
      )}
      {...props}
    >
      {/* 3D Specular Light Sweep following pointer */}
      <span
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: isPrimary
            ? `radial-gradient(circle 90px at ${lightPos.x}% ${lightPos.y}%, rgba(255, 255, 255, 0.55), transparent 70%)`
            : `radial-gradient(circle 90px at ${lightPos.x}% ${lightPos.y}%, rgba(124, 232, 138, 0.35), transparent 70%)`,
        }}
        aria-hidden="true"
      />

      {/* Beveled Rim Highlight */}
      <span
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-[1px]",
          isPrimary ? "bg-white/60" : "bg-white/25"
        )}
        aria-hidden="true"
      />

      {/* Click Ripple Bursts */}
      {bursts.map((burst) => (
        <span
          key={burst.id}
          className="pointer-events-none absolute w-4 h-4 rounded-full bg-white/40 animate-ping"
          style={{
            left: burst.x - 8,
            top: burst.y - 8,
          }}
          aria-hidden="true"
        />
      ))}

      {/* Button Content */}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
}

export default InteractiveButton3D;
