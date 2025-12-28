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
      {/* Sticky container for the content */}
      <div className="sticky top-0 h-[100dvh] w-full z-10 overflow-hidden pointer-events-none [transform-style:preserve-3d]">
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

      {/* Snap Targets: The first one overlaps the sticky content */}
      {sections.length > 1 &&
        sections.map((_, index) => (
          <div
            key={index}
            className={cn(
              "snap-start snap-always h-[100dvh] w-full flex-shrink-0",
              index === 0 && "-mt-[100dvh]"
            )}
          />
        ))}
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
  // If there's only one section, it's always visible
  if (total === 1) {
    return (
      <motion.section
        style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
        className="absolute inset-0 z-10 flex flex-col items-center justify-start md:justify-center p-4 pt-20 pb-10 md:p-8 overflow-hidden pointer-events-auto"
      >
        <motion.div className="w-full flex flex-col items-center justify-center [transform-style:preserve-3d]">
          {section.content}
        </motion.div>
      </motion.section>
    );
  }

  // For multiple sections, we use the scroll progress
  // We want a "window" of visibility around the snap point
  const step = total > 1 ? 1 / (total - 1) : 1;
  const visibleAt = index * step;

  // Sharper fade in/out to prevent overlapping
  const fadeInStart = visibleAt - step * 0.4;
  const fadeOutEnd = visibleAt + step * 0.4;

  const opacity = useTransform(
    scrollYProgress,
    [fadeInStart, visibleAt, fadeOutEnd],
    [0, 1, 0]
  );

  const scale = useTransform(
    scrollYProgress,
    [fadeInStart, visibleAt, fadeOutEnd],
    [0.5, 1, 2]
  );

  const z = useTransform(
    scrollYProgress,
    [fadeInStart, visibleAt, fadeOutEnd],
    [-2000, 0, 800]
  );

  const blur = useTransform(
    scrollYProgress,
    [visibleAt, fadeOutEnd],
    ["blur(0px)", "blur(20px)"]
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
      className="absolute inset-0 z-10 flex flex-col items-center justify-start md:justify-center p-4 pt-20 pb-10 md:p-8 overflow-y-auto"
    >
      <motion.div
        style={{
          scale,
          z,
          transformStyle: "preserve-3d",
        }}
        className="w-full h-full flex flex-col items-center justify-center"
      >
        {section.content}
      </motion.div>
    </motion.section>
  );
}
