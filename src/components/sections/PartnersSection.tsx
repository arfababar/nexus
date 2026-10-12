import { InfiniteSlider } from "@/components/ui/infinite-slider";

export function PartnersSection() {
  return (
    <section className="relative py-16 px-4 z-10" aria-label="Our partners">
      {/* SVG filter that converts embedded white background rects to transparent while rendering dark/colored logo marks as pure white */}
      <svg width="0" height="0" className="absolute pointer-events-none" aria-hidden="true">
        <defs>
          <filter id="partner-white-logo" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 1
                      0 0 0 0 1
                      0 0 0 0 1
                      -0.7 -0.7 -0.7 2 0"
            />
          </filter>
        </defs>
      </svg>

      <div className="mx-auto max-w-5xl">
        <p className="mb-6 text-center text-xs font-mono uppercase tracking-widest text-[#7CE88A]/80">
          Our Partners
        </p>
        <div className="overflow-hidden rounded-3xl bg-white/5 border border-white/10 backdrop-blur [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <InfiniteSlider gap={48} reverse className="w-full py-8 items-center">
            <img
              src="https://motion-primitives.com/apple_music_logo.svg"
              alt="Apple Music logo"
              className="h-12 w-auto brightness-0 invert opacity-60 hover:opacity-100 transition-opacity"
              style={{ filter: "url(#partner-white-logo)" }}
            />
            <img
              src="https://motion-primitives.com/chrome_logo.svg"
              alt="Chrome logo"
              className="h-10 w-auto brightness-0 invert opacity-60 hover:opacity-100 transition-opacity"
            />
            <img
              src="https://motion-primitives.com/strava_logo.svg"
              alt="Strava logo"
              className="h-12 w-auto brightness-0 invert opacity-60 hover:opacity-100 transition-opacity"
              style={{ filter: "url(#partner-white-logo)" }}
            />
            <img
              src="https://motion-primitives.com/nintendo_logo.svg"
              alt="Nintendo logo"
              className="h-12 w-auto brightness-0 invert opacity-60 hover:opacity-100 transition-opacity"
              style={{ filter: "url(#partner-white-logo)" }}
            />
            <img
              src="https://motion-primitives.com/jquery_logo.svg"
              alt="Jquery logo"
              className="h-10 w-auto brightness-0 invert opacity-60 hover:opacity-100 transition-opacity"
            />
            <img
              src="https://motion-primitives.com/prada_logo.svg"
              alt="Prada logo"
              className="h-12 w-auto brightness-0 invert opacity-60 hover:opacity-100 transition-opacity"
              style={{ filter: "url(#partner-white-logo)" }}
            />
          </InfiniteSlider>
        </div>
      </div>
    </section>
  );
}

export default PartnersSection;

