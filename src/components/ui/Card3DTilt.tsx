import React, { useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface Card3DTiltProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glare?: boolean;
}

export function Card3DTilt({
  children,
  className,
  maxTilt = 8,
  glare = true,
  ...props
}: Card3DTiltProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      // Calculate tilt angles (rotateX is inverted based on Y, rotateY is based on X)
      const rx = (y - 0.5) * -maxTilt * 2;
      const ry = (x - 0.5) * maxTilt * 2;
      setTilt({ rx, ry });

      if (glare) {
        setGlarePos({ x: x * 100, y: y * 100, opacity: 0.22 });
      }
    },
    [maxTilt, glare]
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTilt({ rx: 0, ry: 0 });
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
      }}
      className="h-full"
    >
      <div
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(${isHovered ? 12 : 0}px)`,
          transition: isHovered
            ? "transform 0.08s ease-out"
            : "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
          transformStyle: "preserve-3d",
        }}
        className={cn(
          "relative h-full rounded-2xl overflow-hidden will-change-transform transition-shadow duration-300",
          isHovered && "shadow-2xl shadow-emerald-950/40",
          className
        )}
        {...props}
      >
        {children}

        {/* Dynamic Specular Glare Highlight */}
        {glare && (
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-20"
            style={{
              opacity: glarePos.opacity,
              background: `radial-gradient(circle 260px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.35), transparent 70%)`,
            }}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}

export default Card3DTilt;
