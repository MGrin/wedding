import React, { useState, useRef, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { GlitchText } from "./GlitchText";
import { WEDDING_DATE } from "../../types";
import { TRANSLATIONS, type Language } from "../../i18n";
import { useGlitch } from "./GlitchContext";
import { useAudio } from "./SoundContext";
import { Zap, ZapOff, Volume2, VolumeX } from "lucide-react";

interface StickyMenuProps {
  language: Language | null;
  onLanguageChange: (lang: Language) => void;
}

export function StickyMenu({ language, onLanguageChange }: StickyMenuProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const t = language ? TRANSLATIONS[language] : TRANSLATIONS.en;
  const { isGlitchMode, toggleGlitchMode } = useGlitch();
  const { playMenu, playLanguage, playClick, playGlitch, isMuted, toggleMute } =
    useAudio();

  const landingSections = useMemo(
    () => [
      { id: "invitation", label: t.invitation },
      { id: "location-and-dates", label: t.locationAndDates },
      { id: "schedule", label: t.thePlan },
      { id: "guests", label: t.guestList },
      { id: "contacts", label: t.contacts },
    ],
    [t]
  );

  const pagesList = useMemo(
    () => [{ id: "guestList", label: t.guestList, path: "/guests" }],
    [t]
  );

  const [isOpen, setIsOpen] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  const [isHoveringCountdown, setIsHoveringCountdown] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const daysRemaining = useMemo(() => {
    const diff = WEDDING_DATE.getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, []);

  const formattedDate = useMemo(() => {
    return WEDDING_DATE.toLocaleDateString(
      language === "ru" ? "ru-RU" : "en-GB",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    ).replace(/\//g, ".");
  }, [language]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 200 + Math.random() * 300);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handlePointerEnter = (e: React.PointerEvent) => {
    // Ignore touch events for hover logic to prevent double-triggering on mobile
    if (e.pointerType === "touch") return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (!isOpen) playMenu();
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 300);
  };

  const toggleMenu = () => {
    if (!isOpen) playMenu();
    setIsOpen((prev) => !prev);
  };

  const handleBack = (e: React.MouseEvent) => {
    e.stopPropagation();
    playClick();
    navigate(-1);
    setIsOpen(false);
  };

  const handleNavigate = (e: React.MouseEvent, path: string, hash?: string) => {
    e.stopPropagation();
    // Removed playClick() here to avoid overlap with playTransition() which triggers on path/hash change
    if (location.pathname === path && hash) {
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      navigate(`${path}#${hash}`);
    } else {
      navigate(hash ? `${path}#${hash}` : path);
    }
    setIsOpen(false);
  };

  return (
    <header
      className="cyberpunk-menu fixed top-0 left-0 w-full z-[60] pointer-events-auto"
      role="banner"
      aria-label="Primary"
      onMouseLeave={handleMouseLeave}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav
          className="flex items-center justify-between h-16"
          role="navigation"
          aria-label="Main Navigation"
        >
          <div className="flex items-center gap-6">
            {/* Burger Icon / Trigger */}
            <div
              className="relative group cursor-pointer"
              onPointerEnter={handlePointerEnter}
              onClick={toggleMenu}
            >
              <div className="w-12 h-12 flex flex-col items-center justify-center gap-1.5 border border-[#00ffff]/30 bg-black/40 backdrop-blur-md rounded-sm transition-all duration-300 group-hover:border-[#ff00ff] group-hover:shadow-[0_0_15px_rgba(255,0,255,0.3)] overflow-hidden">
                <motion.span
                  animate={
                    isOpen
                      ? {
                          rotate: 45,
                          y: 8,
                          x: isGlitching ? [0, -2, 2, 0] : 0,
                        }
                      : {
                          rotate: 0,
                          y: 0,
                          x: isGlitching ? [0, 1, -1, 0] : 0,
                        }
                  }
                  transition={{
                    x: isGlitching
                      ? { repeat: Infinity, duration: 0.1 }
                      : { duration: 0.2 },
                  }}
                  className="w-6 h-0.5 bg-[#00ffff] shadow-[0_0_8px_rgba(0,255,255,0.8)] relative"
                >
                  {isGlitching && (
                    <motion.span
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ repeat: Infinity, duration: 0.05 }}
                      className="absolute inset-0 bg-[#ff00ff] blur-[2px]"
                    />
                  )}
                </motion.span>
                <motion.span
                  animate={
                    isOpen
                      ? { opacity: 0, x: -20 }
                      : {
                          opacity: 1,
                          x: isGlitching ? [0, -3, 3, 0] : 0,
                        }
                  }
                  transition={{
                    x: isGlitching
                      ? { repeat: Infinity, duration: 0.1 }
                      : { duration: 0.2 },
                  }}
                  className="w-6 h-0.5 bg-[#ff00ff] shadow-[0_0_8px_rgba(255,0,255,0.8)]"
                />
                <motion.span
                  animate={
                    isOpen
                      ? {
                          rotate: -45,
                          y: -8,
                          x: isGlitching ? [0, 2, -2, 0] : 0,
                        }
                      : {
                          rotate: 0,
                          y: 0,
                          x: isGlitching ? [0, -1, 1, 0] : 0,
                        }
                  }
                  transition={{
                    x: isGlitching
                      ? { repeat: Infinity, duration: 0.1, delay: 0.05 }
                      : { duration: 0.2 },
                  }}
                  className="w-6 h-0.5 bg-[#00ffff] shadow-[0_0_8px_rgba(0,255,255,0.8)] relative"
                >
                  {isGlitching && (
                    <motion.span
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.05,
                        delay: 0.03,
                      }}
                      className="absolute inset-0 bg-[#ff00ff] blur-[2px]"
                    />
                  )}
                </motion.span>
              </div>

              {/* Menu Dropdown */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full left-0 mt-2 w-64 bg-black/90 border-2 border-[#ff00ff]/50 backdrop-blur-xl p-4 shadow-[0_0_30px_rgba(255,0,255,0.2)] clip-path-cyber"
                    onPointerEnter={handlePointerEnter}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="space-y-6">
                      {/* Landing Sections */}
                      <div>
                        <p className="text-[10px] tracking-[0.3em] text-[#00ffff] uppercase mb-3 border-b border-[#00ffff]/20 pb-1">
                          <GlitchText text={t.mainProtocol} />
                        </p>
                        <div className="space-y-1">
                          {landingSections.map((section) => {
                            const isActive =
                              location.pathname === "/" &&
                              location.hash === `#${section.id}`;
                            return (
                              <button
                                key={section.id}
                                onClick={(e) =>
                                  handleNavigate(e, "/", section.id)
                                }
                                className={`w-full text-left px-3 py-2 text-sm font-bold tracking-wider transition-all duration-200 flex items-center gap-2 group/item cursor-pointer ${
                                  isActive
                                    ? "text-[#ff00ff] bg-[#ff00ff]/10 shadow-[inset_0_0_8px_rgba(255,0,255,0.2)]"
                                    : "text-gray-300 hover:text-[#ff00ff] hover:bg-[#ff00ff]/10"
                                }`}
                              >
                                <span
                                  className={`w-1 h-1 bg-[#ff00ff] transition-opacity ${
                                    isActive
                                      ? "opacity-100 shadow-[0_0_5px_#ff00ff]"
                                      : "opacity-0 group-hover/item:opacity-100"
                                  }`}
                                />
                                <GlitchText text={section.label} />
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Full Pages */}
                      <div>
                        <p className="text-[10px] tracking-[0.3em] text-[#ff00ff] uppercase mb-3 border-b border-[#ff00ff]/20 pb-1">
                          <GlitchText text={t.externalIntel} />
                        </p>
                        <div className="space-y-1">
                          {pagesList.map((page) => {
                            const isActive = location.pathname === page.path;
                            return (
                              <button
                                key={page.id}
                                onClick={(e) => handleNavigate(e, page.path)}
                                className={`w-full text-left px-3 py-2 text-sm font-bold tracking-wider transition-all duration-200 flex items-center gap-2 group/item cursor-pointer ${
                                  isActive
                                    ? "text-[#00ffff] bg-[#00ffff]/10 shadow-[inset_0_0_8px_rgba(0,255,255,0.2)]"
                                    : "text-gray-300 hover:text-[#00ffff] hover:bg-[#00ffff]/10"
                                }`}
                              >
                                <span
                                  className={`w-1 h-1 bg-[#00ffff] transition-opacity ${
                                    isActive
                                      ? "opacity-100 shadow-[0_0_5px_#00ffff]"
                                      : "opacity-0 group-hover/item:opacity-100"
                                  }`}
                                />
                                <GlitchText text={page.label} />
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Glitch Mode Toggle */}
                      <div className="pt-2 border-t border-[#00ffff]/20">
                        <button
                          onClick={() => {
                            playGlitch();
                            toggleGlitchMode();
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 group cursor-pointer ${
                            isGlitchMode
                              ? "text-[#ff00ff] bg-[#ff00ff]/10 shadow-[0_0_15px_rgba(255,0,255,0.1)]"
                              : "text-[#00ffff]/60 hover:text-[#00ffff] hover:bg-[#00ffff]/5"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {isGlitchMode ? (
                              <Zap size={12} className="animate-pulse" />
                            ) : (
                              <ZapOff size={12} className="opacity-50" />
                            )}
                            <GlitchText
                              text={
                                isGlitchMode
                                  ? "GLITCH_MODE: ON"
                                  : "GLITCH_MODE: OFF"
                              }
                            />
                          </div>
                          <div
                            className={`w-8 h-4 border transition-colors duration-300 relative ${
                              isGlitchMode
                                ? "border-[#ff00ff]"
                                : "border-[#00ffff]/30"
                            }`}
                          >
                            <motion.div
                              animate={{ x: isGlitchMode ? 16 : 0 }}
                              className={`absolute top-0.5 left-0.5 w-2.5 h-2.5 transition-colors duration-300 ${
                                isGlitchMode
                                  ? "bg-[#ff00ff]"
                                  : "bg-[#00ffff]/30"
                              }`}
                            />
                          </div>
                        </button>
                      </div>

                      {/* Audio Toggle */}
                      <div className="pt-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMute();
                            if (isMuted) playClick(); // Play sound if we just unmuted
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 group cursor-pointer ${
                            !isMuted
                              ? "text-[#00ffff] hover:bg-[#00ffff]/5"
                              : "text-gray-500 hover:text-gray-400 hover:bg-white/5"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {isMuted ? (
                              <VolumeX size={12} className="opacity-50" />
                            ) : (
                              <Volume2 size={12} />
                            )}
                            <GlitchText
                              text={isMuted ? "AUDIO: MUTED" : "AUDIO: ON"}
                            />
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute bottom-2 right-2 text-[8px] text-[#ff00ff]/30 font-mono">
                      <GlitchText text="v2.0.26_SYS" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Back to Landing Button (only if not on landing page) */}
            <AnimatePresence>
              {location.pathname !== "/" && (
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onClick={handleBack}
                  className="w-12 h-12 flex items-center justify-center border border-[#ff00ff]/30 bg-black/40 backdrop-blur-md rounded-sm transition-all duration-300 hover:border-[#00ffff] hover:shadow-[0_0_15px_rgba(0,255,255,0.3)] group/back overflow-hidden cursor-pointer"
                >
                  <motion.div
                    animate={
                      isGlitching
                        ? {
                            x: [0, -2, 2, 0],
                            filter: [
                              "hue-rotate(0deg)",
                              "hue-rotate(90deg)",
                              "hue-rotate(0deg)",
                            ],
                          }
                        : {}
                    }
                    transition={{ repeat: Infinity, duration: 0.1 }}
                    className="text-[#ff00ff] group-hover/back:text-[#00ffff] transition-colors"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                  </motion.div>
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 md:gap-4 text-[8px] md:text-[10px] tracking-[0.1em] md:tracking-[0.2em] text-gray-500 uppercase font-mono">
              <span className="animate-pulse hidden sm:inline">
                <GlitchText text={`● ${t.systemOnline}`} />
              </span>
              <span
                className="transition-colors hover:text-[#00ffff] whitespace-nowrap"
                onMouseEnter={() => setIsHoveringCountdown(true)}
                onMouseLeave={() => setIsHoveringCountdown(false)}
              >
                <GlitchText
                  text={
                    isHoveringCountdown
                      ? `${t.date}: ${formattedDate}`
                      : `${t.tMinus}: ${daysRemaining} ${t.days}`
                  }
                />
              </span>
            </div>

            <div className="flex items-center gap-1 border-l border-gray-800 pl-3 ml-1 pointer-events-auto">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playLanguage();
                  onLanguageChange("ru");
                }}
                className={`text-[10px] font-bold transition-colors cursor-pointer ${
                  language === "ru"
                    ? "text-[#ff00ff]"
                    : "text-gray-500 hover:text-[#00ffff]"
                }`}
              >
                <GlitchText text="RU" />
              </button>
              <span className="text-gray-800 text-[10px]">/</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playLanguage();
                  onLanguageChange("en");
                }}
                className={`text-[10px] font-bold transition-colors cursor-pointer ${
                  language === "en"
                    ? "text-[#ff00ff]"
                    : "text-gray-500 hover:text-[#00ffff]"
                }`}
              >
                <GlitchText text="EN" />
              </button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default StickyMenu;
