import {
  motion,
  useScroll,
  useTransform,
  MotionValue,
  useMotionValueEvent,
} from "framer-motion";
import { useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";
import type { ReactNode } from "react";
import type { Section } from "../types";
import { useAudio } from "./cyberpunk/SoundContext";

interface SectionPageProps {
  sections: Section[];
  scrollProgress: MotionValue<number>;
}

export function SectionPage({ sections, scrollProgress }: SectionPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isScrollingRef = useRef(false);
  const mountedPathnameRef = useRef(location.pathname);
  const isFirstMountRef = useRef(true);
  const currentSearchRef = useRef(location.search);
  const lastSectionIndexRef = useRef(0);

  // Keep search ref in sync
  useEffect(() => {
    currentSearchRef.current = location.search;
  }, [location.search]);

  const { scrollYProgress } = useScroll({
    container: containerRef,
  });

  // Handle initial hash and hash changes
  useEffect(() => {
    // Ignore hash changes if we've navigated to a different page (prevents jump on exit)
    if (location.pathname !== mountedPathnameRef.current) return;

    if (isScrollingRef.current) {
      isScrollingRef.current = false;
      return;
    }

    const targetId = location.hash.replace("#", "");
    if (targetId && containerRef.current) {
      const index = sections.findIndex((s) => s.id === targetId);
      if (index !== -1) {
        lastSectionIndexRef.current = index;

        if (isScrollingRef.current) {
          isScrollingRef.current = false;
          return;
        }

        containerRef.current.scrollTo({
          top: index * containerRef.current.clientHeight,
          behavior: isFirstMountRef.current ? "auto" : "smooth",
        });
      }
    } else if (!location.hash && containerRef.current) {
      // If no hash, and we are on the landing page, default to first section hash
      if (sections.length > 0 && sections[0]) {
        navigate(
          {
            hash: `#${sections[0].id}`,
            search: currentSearchRef.current,
          },
          { replace: true }
        );
      }
      containerRef.current.scrollTop = 0;
    }
    isFirstMountRef.current = false;
  }, [location.hash, location.pathname, sections, navigate]);

  // Sync internal scroll progress and update hash
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Only update if this page is still the active one
    if (location.pathname !== mountedPathnameRef.current) return;

    scrollProgress.set(latest);

    // Update hash based on scroll position
    if (sections.length > 1) {
      const index = Math.round(latest * (sections.length - 1));
      const currentSection = sections[index];

      if (currentSection && index !== lastSectionIndexRef.current) {
        const currentHash = `#${currentSection.id}`;

        lastSectionIndexRef.current = index;

        if (window.location.hash !== currentHash) {
          isScrollingRef.current = true;
          navigate(
            {
              hash: currentHash,
              search: currentSearchRef.current,
            },
            { replace: true }
          );
        }
      }
    }
  });
  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full h-full pointer-events-auto overscroll-contain [transform-style:preserve-3d]",
        sections.length > 1
          ? "overflow-y-auto overflow-x-hidden snap-y snap-mandatory"
          : "overflow-hidden"
      )}
    >
      <div className="grid grid-cols-1 grid-rows-1 w-full [transform-style:preserve-3d]">
        {/* Sticky container for the content */}
        <div className="sticky top-0 h-[100dvh] w-full z-10 overflow-hidden pointer-events-none [transform-style:preserve-3d] row-start-1 col-start-1">
          {sections.map((section, index) => (
            <SectionRenderer
              key={section.id}
              section={section}
              index={index}
              total={sections.length}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>

        {/* Snap Targets */}
        <div className="row-start-1 col-start-1 flex flex-col pointer-events-none">
          {sections.length > 1 &&
            sections.map((_, index) => (
              <div
                key={index}
                className="snap-start snap-always h-[100dvh] w-full flex-shrink-0"
              />
            ))}
        </div>
      </div>
    </div>
  );
}

function SectionRenderer({
  section,
  index,
  total,
  scrollYProgress,
}: {
  section: Section;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  // For multiple sections, we use the scroll progress
  // We want a "window" of visibility around the snap point
  const step = total > 1 ? 1 / (total - 1) : 1;
  const visibleAt = index * step;

  // Add a larger plateau around the focus point to handle sub-pixel scroll issues on mobile
  // This is especially important for sections with internal scrolling
  const plateau = total > 1 ? step * 0.35 : 1;
  const focusStart = index === 0 ? -0.1 : visibleAt - plateau;
  const focusEnd = index === total - 1 ? 1.1 : visibleAt + plateau;

  // Sharper fade in/out to prevent overlapping
  const fadeInStart = visibleAt - step * 0.5;
  const fadeOutEnd = visibleAt + step * 0.5;

  const opacity = useTransform(
    scrollYProgress,
    [fadeInStart, focusStart, focusEnd, fadeOutEnd],
    [0, 1, 1, 0]
  );

  const scale = useTransform(
    scrollYProgress,
    [fadeInStart, focusStart, focusEnd, fadeOutEnd],
    [0.5, 1, 1, 2]
  );

  const z = useTransform(
    scrollYProgress,
    [fadeInStart, focusStart, focusEnd, fadeOutEnd],
    [-2000, 0, 0, 500]
  );

  const blur = useTransform(
    scrollYProgress,
    [fadeInStart, focusStart, focusEnd, fadeOutEnd],
    ["blur(10px)", "blur(0px)", "blur(0px)", "blur(15px)"]
  );

  const pointerEvents = useTransform(opacity, (v) =>
    v > 0.5 ? "auto" : "none"
  );

  return (
    <motion.section
      style={{
        opacity,
        filter: blur,
        perspective: "1000px",
        pointerEvents,
        transformStyle: "preserve-3d",
      }}
      className="absolute inset-0 z-10 flex flex-col items-center justify-start md:justify-center p-4 pt-20 pb-10 md:pt-24 md:pb-12 md:px-8 overflow-hidden"
    >
      <motion.div
        style={{
          scale,
          z,
          transformStyle: "preserve-3d",
        }}
        className="w-full flex-1 flex flex-col items-center justify-center"
      >
        {section.content}
      </motion.div>
    </motion.section>
  );
}
