import { CyberpunkBackground } from "./components/cyberpunk/CyberpunkBackground";
import { GlitchText } from "./components/cyberpunk/GlitchText";
import { NeonButton } from "./components/cyberpunk/NeonButton";
import StickyMenu from "./components/cyberpunk/StickyMenu";
import { SectionPage } from "./components/SectionPage";
import { GUESTS } from "./data/guests";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { useMemo, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import type { PageId, Section } from "./types";
import "./index.css";
import { TRANSLATIONS, type Language } from "./i18n";
import { Calendar, Send, Ghost, Dna, Zap, Heart } from "lucide-react";
import { GuestDossier } from "./components/cyberpunk/GuestDossier";
import {
  useGlitchState,
  useGlitch,
} from "./components/cyberpunk/GlitchContext";
import { useAudio } from "./components/cyberpunk/SoundContext";

const PATH_TO_PAGE: Record<string, PageId> = {
  "/": "landing",
  "/guests": "guestList",
};

const PAGE_TO_PATH: Record<PageId, string> = {
  landing: "/",
  guestList: "/guests",
};

export function App() {
  const [language, setLanguage] = useState<Language | null>(() => {
    return localStorage.getItem("wedding_lang") as Language | null;
  });

  const isGlitching = useGlitchState();
  const { isGlitchMode } = useGlitch();
  const { playTransition, playLanguage, playClick } = useAudio();
  const [heartGlitching, setHeartGlitching] = useState(false);

  useEffect(() => {
    if (isGlitchMode) {
      setHeartGlitching(false); // Global glitching will cover it
      return;
    }

    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        setHeartGlitching(true);
        setTimeout(() => setHeartGlitching(false), 2000);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [isGlitchMode]);

  const isHeartGlitching = isGlitching || heartGlitching;

  const funnyIcons = [Ghost, Dna, Zap];
  const FunnyIcon =
    funnyIcons[Math.floor(Date.now() / 1000) % funnyIcons.length] || Ghost;

  const t = language ? TRANSLATIONS[language] : TRANSLATIONS.en;

  const handleLanguageSelect = (lang: Language) => {
    playLanguage();
    localStorage.setItem("wedding_lang", lang);
    setLanguage(lang);
  };

  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const scrollProgress = useMotionValue(0);
  const isFirstMount = useRef(true);

  const selectedGuestId = searchParams.get("id");
  const selectedGuest = useMemo(() => {
    if (!selectedGuestId) return null;
    return GUESTS.find((g) => g.id.toString() === selectedGuestId) || null;
  }, [selectedGuestId]);

  const handleGuestSelect = useMemo(
    () => (id: number | null) => {
      setSearchParams(
        (prev) => {
          const newParams = new URLSearchParams(prev);
          if (id === null) {
            newParams.delete("id");
          } else {
            newParams.set("id", id.toString());
          }
          return newParams;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const handleNextGuest = () => {
    if (!selectedGuest) return;
    const currentIndex = GUESTS.findIndex((g) => g.id === selectedGuest.id);
    const nextIndex = (currentIndex + 1) % GUESTS.length;
    const nextGuest = GUESTS[nextIndex];
    if (nextGuest) handleGuestSelect(nextGuest.id);
  };

  const handlePrevGuest = () => {
    if (!selectedGuest) return;
    const currentIndex = GUESTS.findIndex((g) => g.id === selectedGuest.id);
    const prevIndex = (currentIndex - 1 + GUESTS.length) % GUESTS.length;
    const prevGuest = GUESTS[prevIndex];
    if (prevGuest) handleGuestSelect(prevGuest.id);
  };

  const currentPage = PATH_TO_PAGE[location.pathname] || "landing";
  const [direction, setDirection] = useState(1);
  const prevPageRef = useRef(currentPage);

  useEffect(() => {
    if (prevPageRef.current !== currentPage) {
      const newDirection = currentPage === "landing" ? 1 : -1;
      if (direction !== newDirection) {
        setDirection(newDirection);
      }
      prevPageRef.current = currentPage;
    }
  }, [currentPage, direction]);

  // Play sound on page change
  useEffect(() => {
    playTransition();
  }, [location.pathname, playTransition]);

  // Reset scroll progress when page changes
  useEffect(() => {
    scrollProgress.set(0);
  }, [location.pathname, scrollProgress]);

  // Mark first mount as complete after initial render
  useEffect(() => {
    const timer = setTimeout(() => {
      isFirstMount.current = false;
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const navigateTo = (pageId: PageId) => {
    navigate(PAGE_TO_PATH[pageId]);
  };

  const pages = useMemo(() => {
    const totalAdults = GUESTS.reduce(
      (acc, guest) => acc + guest.names.length,
      0
    );
    const totalChildren = GUESTS.reduce(
      (acc, guest) => acc + guest.children.length,
      0
    );
    const totalGuests = totalAdults + totalChildren;

    const countries = Array.from(
      new Set(
        GUESTS.map((g) =>
          language === "ru" ? g.countryRu || g.country : g.country
        )
      )
    ).sort();
    const languages = Array.from(
      new Set(
        GUESTS.flatMap((g) =>
          g.languages.map((l) => (t.langNames as any)[l] || l)
        )
      )
    ).sort();

    const landingSections: Section[] = [
      {
        id: "invitation",
        title: t.invitation,
        content: (
          <div className="relative h-full w-full flex flex-col items-center md:justify-center">
            {/* Names Section */}
            <div className="h-[58dvh] md:h-auto w-full flex flex-col items-center justify-center pt-12 md:pt-0">
              <div className="max-w-6xl w-full text-center px-4">
                <h1 className="text-3xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-[-0.1em] flex flex-col md:grid md:grid-cols-[1fr_auto_1fr] items-center justify-center gap-4 md:gap-8 w-full">
                  <div className="md:text-right">
                    <GlitchText
                      text={language === "ru" ? "НИКИТА" : "NIKITA"}
                      forceGlitch={isHeartGlitching}
                    />
                  </div>
                  <span className="relative inline-block w-12 h-12 md:w-32 md:h-32 justify-self-center group">
                    <motion.div
                      animate={
                        isHeartGlitching
                          ? {
                              x: [0, -5, 5, -2, 2, 0],
                              y: [0, 2, -2, 0],
                              scale: [1, 1.2, 0.9, 1.1, 1],
                              filter: [
                                "hue-rotate(0deg)",
                                "hue-rotate(90deg)",
                                "hue-rotate(180deg)",
                                "hue-rotate(0deg)",
                              ],
                            }
                          : {
                              x: 0,
                              y: 0,
                              scale: 1,
                              filter: "hue-rotate(0deg)",
                            }
                      }
                      transition={{
                        duration: 0.2,
                        repeat: isHeartGlitching ? Infinity : 0,
                        repeatType: "mirror",
                      }}
                      className="w-full h-full flex items-center justify-center relative z-10"
                    >
                      {isHeartGlitching ? (
                        <FunnyIcon className="w-full h-full text-[#ff00ff] drop-shadow-[0_0_15px_rgba(255,0,255,0.8)]" />
                      ) : (
                        <Heart
                          fill="#ff00ff"
                          className="w-full h-full text-[#ff00ff] drop-shadow-[0_0_25px_rgba(255,0,255,1)] animate-pulse"
                        />
                      )}
                    </motion.div>

                    {isHeartGlitching && (
                      <>
                        <motion.div
                          animate={{ x: [-2, -6, -1], y: [1, 3, 0] }}
                          transition={{ duration: 0.1, repeat: Infinity }}
                          className="absolute inset-0 -z-10 text-[#ff00ff] opacity-50 mix-blend-screen flex items-center justify-center"
                        >
                          <FunnyIcon className="w-full h-full" />
                        </motion.div>
                        <motion.div
                          animate={{ x: [2, 6, 1], y: [-1, -3, 0] }}
                          transition={{ duration: 0.1, repeat: Infinity }}
                          className="absolute inset-0 -z-10 text-[#00ffff] opacity-50 mix-blend-screen flex items-center justify-center"
                        >
                          <FunnyIcon className="w-full h-full" />
                        </motion.div>
                      </>
                    )}

                    {/* Graffiti drips */}
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                      <div className="w-0.5 h-3 bg-[#ff00ff] rounded-full animate-[bounce_2s_infinite]" />
                      <div className="w-0.5 h-5 bg-[#ff00ff] rounded-full animate-[bounce_2.5s_infinite]" />
                      <div className="w-0.5 h-2 bg-[#ff00ff] rounded-full animate-[bounce_1.8s_infinite]" />
                    </div>
                  </span>
                  <div className="md:text-left">
                    <GlitchText
                      text={language === "ru" ? "ВАЛЕРИЯ" : "VALERIIA"}
                      forceGlitch={isHeartGlitching}
                    />
                  </div>
                </h1>
              </div>
            </div>

            {/* Location & Date Section */}
            <div className="flex-1 md:flex-none w-full flex flex-col items-center justify-start px-4 space-y-4 md:space-y-6 md:mt-12">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-[#ff00ff] to-transparent opacity-50" />
              <p className="text-[#00ffff] text-base md:text-3xl lg:text-4xl font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase text-center">
                <GlitchText
                  text={t.weddingProtocol}
                  forceGlitch={isHeartGlitching}
                />
              </p>
            </div>

            <div className="absolute bottom-4 md:bottom-12 left-1/2 -translate-x-1/2 text-center space-y-4">
              <p className="text-[10px] tracking-[0.3em] text-[#ff00ff] animate-bounce font-bold">
                <GlitchText
                  text={t.scrollToInitialize}
                  forceGlitch={isHeartGlitching}
                />
              </p>
              <div className="w-px h-12 bg-gradient-to-b from-[#ff00ff] to-transparent mx-auto" />
            </div>
          </div>
        ),
      },
      {
        id: "location-and-dates",
        title: t.locationAndDates,
        content: (
          <div className="mt-4 md:mt-0 space-y-3 md:space-y-8 bg-black/80 p-4 md:p-12 border-2 border-[#00ffff] backdrop-blur-2xl max-w-5xl w-full relative overflow-hidden max-h-[85vh] md:max-h-none overflow-y-auto">
            <div className="absolute top-0 right-0 p-4 opacity-10 md:opacity-20">
              <div className="text-[30px] md:text-[60px] font-black text-[#00ffff] leading-none select-none">
                <GlitchText text="LOC_DATA" />
              </div>
            </div>

            <div className="relative z-10 space-y-4 md:space-y-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-4 border-b border-[#00ffff]/30 pb-3 md:pb-6">
                <h2 className="text-2xl md:text-6xl font-black text-[#ff00ff] tracking-tighter">
                  <GlitchText text={t.locationAndDates} />
                </h2>
                <div className="text-right">
                  <p className="text-[#00ffff] font-bold text-base md:text-xl">
                    <GlitchText text="16.05.2026" />
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                {/* Official Part */}
                <div className="flex flex-col group">
                  <div className="flex items-center gap-2 mb-2 md:mb-4">
                    <div className="w-1.5 h-1.5 bg-[#ff00ff] shadow-[0_0_10px_#ff00ff]" />
                    <h3 className="text-lg md:text-xl font-bold text-[#00ffff] uppercase tracking-wider">
                      <GlitchText text={t.officialPart} />
                    </h3>
                  </div>
                  <div className="pl-4 border-l border-[#ff00ff]/30 flex flex-col flex-grow">
                    <div className="space-y-1 md:space-y-2 mb-4 md:mb-6">
                      <p className="text-gray-300 font-medium text-sm md:text-base">
                        <GlitchText text={t.officialPartDesc} />
                      </p>
                    </div>
                    <div className="mt-auto">
                      <a
                        href="https://www.google.com/maps/place/%D0%90%D0%BD%D1%82%D0%B0%D0%BB%D1%8C%D1%8F,+%D0%90%D0%BD%D1%82%D0%B0%D0%BB%D0%B8%D1%8F,+%D0%A2%D1%83%D1%80%D1%86%D0%B8%D1%8F/@36.8979091,30.6357048,12z/data=!3m1!4b1!4m6!3m5!1s0x14c39aaeddadadc1:0x95c69f73f9e32e33!8m2!3d36.8968908!4d30.7133233!16zL20vMDFfaGhw?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoKLDEwMDc5MjA3M0gBUAM%3D"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[9px] md:text-[10px] text-[#ff00ff] hover:text-[#00ffff] transition-colors uppercase font-bold tracking-widest cursor-pointer"
                      >
                        <span className="w-3 h-px bg-current" />
                        <GlitchText text={t.googleMaps} />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Banquet */}
                <div className="flex flex-col group">
                  <div className="flex items-center gap-2 mb-2 md:mb-4">
                    <div className="w-1.5 h-1.5 bg-[#ff00ff] shadow-[0_0_10px_#ff00ff]" />
                    <h3 className="text-lg md:text-xl font-bold text-[#00ffff] uppercase tracking-wider">
                      <GlitchText text={t.banquet} />
                    </h3>
                  </div>
                  <div className="pl-4 border-l border-[#ff00ff]/30 flex flex-col flex-grow">
                    <div className="space-y-1 md:space-y-2 mb-4 md:mb-6">
                      <p className="text-gray-300 font-medium text-sm md:text-base">
                        <GlitchText text={t.banquetDesc} />
                      </p>
                    </div>
                    <div className="mt-auto">
                      <a
                        href="https://www.google.com/maps/place/%D0%9A%D0%B5%D0%BC%D0%B5%D1%80,+%D0%90%D0%BD%D1%82%D0%B0%D0%BB%D1%8C%D1%8F,+%D0%92%D0%B8%D0%BB%D0%B0%D1%8F%D1%82+%D0%90%D0%BD%D1%82%D0%B0%D0%BB%D1%8C%D1%8F,+%D0%A2%D1%83%D1%80%D1%86%D0%B8%D1%8F/@36.6023912,30.5241005,14z/data=!3m1!4b1!4m6!3m5!1s0x14c3b7a4820a22e7:0x973532648469d291!8m2!3d36.602792!4d30.559762!16zL20vMDZyamtt?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoKLDEwMDc5MjA3M0gBUAM%3D"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[9px] md:text-[10px] text-[#ff00ff] hover:text-[#00ffff] transition-colors uppercase font-bold tracking-widest cursor-pointer"
                      >
                        <span className="w-3 h-px bg-current" />
                        <GlitchText text={t.googleMaps} />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Hotel */}
                <div className="flex flex-col group">
                  <div className="flex items-center gap-2 mb-2 md:mb-4">
                    <div className="w-1.5 h-1.5 bg-[#ff00ff] shadow-[0_0_10px_#ff00ff]" />
                    <h3 className="text-lg md:text-xl font-bold text-[#00ffff] uppercase tracking-wider">
                      <GlitchText text={t.hotel} />
                    </h3>
                  </div>
                  <div className="pl-4 border-l border-[#ff00ff]/30 flex flex-col flex-grow">
                    <div className="space-y-1 md:space-y-2 mb-4 md:mb-6">
                      <p className="text-gray-300 font-medium text-sm md:text-base">
                        <GlitchText text={t.hotelDesc} />
                      </p>
                      <p className="text-[9px] md:text-[10px] text-gray-500 leading-relaxed italic">
                        <GlitchText text={t.hotelNote} />
                      </p>
                    </div>
                    <div className="mt-auto">
                      <a
                        href="https://www.google.com/maps/place/Mirada+Del+Mar+Hotel/@36.6737492,30.5608879,17z/data=!3m1!4b1!4m9!3m8!1s0x14c3b8e6fa4731f7:0x5856208c10f4404a!5m2!4m1!1i2!8m2!3d36.6737493!4d30.5657588!16s%2Fg%2F1ptz8zwk8?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoKLDEwMDc5MjA3M0gBUAM%3D"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[9px] md:text-[10px] text-[#ff00ff] hover:text-[#00ffff] transition-colors uppercase font-bold tracking-widest cursor-pointer"
                      >
                        <span className="w-3 h-px bg-current" />
                        <GlitchText text={t.googleMaps} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "schedule",
        title: t.thePlan,
        content: (
          <div className="mt-4 md:mt-0 space-y-3 md:space-y-8 bg-black/80 p-4 md:p-12 border-2 border-[#ff00ff] backdrop-blur-2xl max-w-5xl w-full relative overflow-hidden max-h-[85vh] md:max-h-none overflow-y-auto">
            <div className="absolute top-0 right-0 p-4 opacity-10 md:opacity-20">
              <div className="text-[30px] md:text-[60px] font-black text-[#ff00ff] leading-none select-none">
                <GlitchText text="PLAN_INTEL" />
              </div>
            </div>

            <div className="relative z-10 space-y-4 md:space-y-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-4 border-b border-[#ff00ff]/30 pb-3 md:pb-6">
                <h2 className="text-2xl md:text-6xl font-black text-[#00ffff] tracking-tighter">
                  <GlitchText text={t.thePlan.toUpperCase()} />
                </h2>
                <div className="text-right">
                  <p className="text-[#ff00ff] font-bold text-base md:text-xl">
                    <GlitchText text="14.05 — 21.05" />
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                {/* Before the Wedding */}
                <div className="flex flex-col group relative">
                  <div className="absolute -top-1 right-0 bg-[#00ffff]/10 border border-[#00ffff]/30 px-2 py-0.5 text-[9px] font-mono text-[#00ffff] tracking-widest">
                    <GlitchText text={t.beforeTheWeddingDate} />
                  </div>
                  <div className="flex items-center gap-2 mb-2 md:mb-4">
                    <div className="w-1.5 h-1.5 bg-[#00ffff] shadow-[0_0_10px_#00ffff]" />
                    <h3 className="text-lg md:text-xl font-bold text-[#ff00ff] uppercase tracking-wider">
                      <GlitchText text={t.beforeTheWeddingTitle} />
                    </h3>
                  </div>
                  <div className="pl-4 border-l border-[#00ffff]/30 flex flex-col flex-grow">
                    <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
                      <GlitchText text={t.beforeTheWeddingDesc} />
                    </p>
                  </div>
                </div>

                {/* The Wedding */}
                <div className="flex flex-col group relative">
                  <div className="absolute -top-1 right-0 bg-[#ff00ff]/10 border border-[#ff00ff]/30 px-2 py-0.5 text-[9px] font-mono text-[#ff00ff] tracking-widest">
                    <GlitchText text={t.theWeddingDate} />
                  </div>
                  <div className="flex items-center gap-2 mb-2 md:mb-4">
                    <div className="w-1.5 h-1.5 bg-[#00ffff] shadow-[0_0_10px_#00ffff]" />
                    <h3 className="text-lg md:text-xl font-bold text-[#ff00ff] uppercase tracking-wider">
                      <GlitchText text={t.theWeddingTitle} />
                    </h3>
                  </div>
                  <div className="pl-4 border-l border-[#00ffff]/30 flex flex-col flex-grow">
                    <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
                      <GlitchText text={t.theWeddingDesc} />
                    </p>
                  </div>
                </div>

                {/* After the Wedding */}
                <div className="flex flex-col group relative">
                  <div className="absolute -top-1 right-0 bg-[#00ffff]/10 border border-[#00ffff]/30 px-2 py-0.5 text-[9px] font-mono text-[#00ffff] tracking-widest">
                    <GlitchText text={t.afterTheWeddingDate} />
                  </div>
                  <div className="flex items-center gap-2 mb-2 md:mb-4">
                    <div className="w-1.5 h-1.5 bg-[#00ffff] shadow-[0_0_10px_#00ffff]" />
                    <h3 className="text-lg md:text-xl font-bold text-[#ff00ff] uppercase tracking-wider">
                      <GlitchText text={t.afterTheWeddingTitle} />
                    </h3>
                  </div>
                  <div className="pl-4 border-l border-[#00ffff]/30 flex flex-col flex-grow">
                    <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
                      <GlitchText text={t.afterTheWeddingDesc} />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "guests",
        title: t.guestList,
        content: (
          <div className="space-y-6 md:space-y-10 bg-black/80 p-6 md:p-12 border-2 border-[#00ffff] backdrop-blur-2xl max-w-4xl w-full max-h-[85vh] md:max-h-none overflow-y-auto">
            <div className="border-b border-[#00ffff]/30 pb-4 md:pb-6">
              <h2 className="text-3xl md:text-5xl font-black text-[#ff00ff] tracking-tighter">
                <GlitchText text={t.guestStats.toUpperCase()} />
              </h2>
              <p className="text-[#00ffff] font-mono text-xs md:text-sm mt-2 tracking-[0.2em]">
                <GlitchText text={t.authorizedAccess.toUpperCase()} />
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
              <div className="bg-[#00ffff]/5 border border-[#00ffff]/20 p-4 space-y-1">
                <p className="text-[10px] text-[#00ffff]/60 font-mono uppercase tracking-widest">
                  <GlitchText text={t.guests} />
                </p>
                <p className="text-3xl md:text-4xl font-black text-white">
                  <GlitchText text={totalGuests.toString()} />
                </p>
                <p className="text-[10px] text-gray-500 font-mono">
                  <GlitchText
                    text={`${totalAdults} ${t.adults} / ${totalChildren} ${t.children}`}
                  />
                </p>
              </div>

              <div className="bg-[#ff00ff]/5 border border-[#ff00ff]/20 p-4 space-y-2">
                <p className="text-[10px] text-[#ff00ff]/60 font-mono uppercase tracking-widest">
                  <GlitchText text={t.countries} />
                </p>
                <div className="flex flex-wrap gap-2">
                  {countries.map((c) => (
                    <span
                      key={c}
                      className="text-[10px] md:text-xs bg-[#ff00ff]/10 border border-[#ff00ff]/30 px-2 py-0.5 text-gray-300"
                    >
                      <GlitchText text={c} />
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-[#00ffff]/5 border border-[#00ffff]/20 p-4 space-y-2">
                <p className="text-[10px] text-[#00ffff]/60 font-mono uppercase tracking-widest">
                  <GlitchText text={t.languages} />
                </p>
                <div className="flex flex-wrap gap-2">
                  {languages.map((l) => (
                    <span
                      key={l}
                      className="text-[10px] md:text-xs bg-[#00ffff]/10 border border-[#00ffff]/30 px-2 py-0.5 text-gray-300"
                    >
                      <GlitchText text={l} />
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <NeonButton
                variant="cyan"
                onClick={() => navigateTo("guestList")}
                className="w-full md:w-auto py-2 md:py-3"
              >
                {t.viewFullIntel}
              </NeonButton>
            </div>
          </div>
        ),
      },
      {
        id: "contacts",
        title: t.contacts,
        content: (
          <div className="space-y-6 md:space-y-10 bg-black/80 p-6 md:p-12 border-2 border-[#ff00ff] backdrop-blur-2xl max-w-4xl w-full max-h-[85vh] md:max-h-none overflow-y-auto">
            <div className="border-b border-[#ff00ff]/30 pb-4 md:pb-6">
              <h2 className="text-3xl md:text-5xl font-black text-[#00ffff] tracking-tighter">
                <GlitchText text={t.contacts.toUpperCase()} />
              </h2>
              <p className="text-[#ff00ff] font-mono text-xs md:text-sm mt-2 tracking-[0.2em]">
                <GlitchText text={t.secureChannels.toUpperCase()} />
              </p>
            </div>

            <div className="flex flex-col items-center justify-center py-8 md:py-12 space-y-8">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-[#00ffff]/10 border-2 border-[#00ffff] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,255,255,0.3)]">
                <Send size={40} className="text-[#00ffff] md:w-12 md:h-12" />
              </div>

              <div className="text-center space-y-4">
                <h3 className="text-xl md:text-3xl font-bold text-white tracking-wider">
                  <GlitchText text={t.groupChat} />
                </h3>
                <p className="text-gray-400 text-sm md:text-base max-w-md mx-auto">
                  <GlitchText text={t.secureChannels} />
                </p>
              </div>

              <a
                href="https://t.me/+PAjZkp9o5Z8yOWU0"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-[#ff00ff] font-pj rounded-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 hover:bg-[#ff00ff]/80 shadow-[0_0_20px_rgba(255,0,255,0.4)] cursor-pointer"
              >
                <span className="relative flex items-center gap-2">
                  <Send size={18} />
                  <GlitchText text={t.joinChat} />
                </span>
              </a>
            </div>

            <div className="pt-6 border-t border-[#ff00ff]/20 text-center">
              <div className="text-[10px] font-mono text-[#ff00ff]/40">
                <GlitchText text="ENCRYPTED_CONNECTION_ESTABLISHED" />
                <br />
                <GlitchText text="STATUS: ACTIVE" />
              </div>
            </div>
          </div>
        ),
      },
    ];

    const guestListSections: Section[] = [
      {
        id: "guests",
        title: t.guestList,
        content: (
          <div className="bg-black/80 border-2 border-[#00ffff] backdrop-blur-2xl max-w-6xl w-full max-h-[85vh] overflow-y-auto custom-scrollbar relative pointer-events-auto">
            <div className="sticky top-0 bg-black/40 backdrop-blur-xl z-20 px-6 md:px-12 pt-6 md:pt-12 pb-6 border-b border-[#00ffff]/30">
              <h2 className="text-4xl font-bold text-[#ff00ff]">
                <GlitchText text={t.guestDatabase} />
              </h2>
              <p className="text-[#00ffff] text-xs tracking-[0.3em] mt-2">
                <GlitchText
                  text={`${t.authorizedAccess} - ${totalGuests} ${t.guests} (${totalAdults} ${t.adults} / ${totalChildren} ${t.children})`}
                />
              </p>
            </div>
            <div className="p-6 md:p-12 pt-8 md:pt-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {GUESTS.map((guest) => {
                  const title =
                    language === "ru"
                      ? guest.titleRu || guest.title
                      : guest.title;
                  const names =
                    language === "ru"
                      ? guest.namesRu || guest.names
                      : guest.names;
                  const children =
                    language === "ru"
                      ? guest.childrenRu || guest.children
                      : guest.children;
                  const country =
                    language === "ru"
                      ? guest.countryRu || guest.country
                      : guest.country;
                  const languages = guest.languages.map(
                    (l) => (t.langNames as any)[l] || l
                  );

                  return (
                    <div
                      key={guest.id}
                      onClick={() => {
                        playClick();
                        handleGuestSelect(guest.id);
                      }}
                      className="border border-[#ff00ff]/30 p-4 bg-black/40 hover:border-[#ff00ff] transition-all duration-300 group cursor-pointer relative overflow-hidden hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,0,255,0.1)] z-10"
                    >
                      <div className="absolute inset-0 bg-[#ff00ff]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="flex justify-between items-start mb-2 relative z-10">
                        <h3 className="text-xl font-bold text-[#00ffff] group-hover:text-[#ff00ff] transition-colors">
                          {title}
                        </h3>
                        <span className="text-[10px] font-mono text-[#ff00ff]/50">
                          ID: {guest.id}
                        </span>
                      </div>
                      {names.length > 0 && (
                        <p className="text-xs text-gray-400 mb-1 relative z-10">
                          <span className="text-[#ff00ff]/70 uppercase">
                            {t.names}:
                          </span>{" "}
                          {names.join(", ")}
                        </p>
                      )}
                      {children.length > 0 && (
                        <p className="text-xs text-gray-400 mb-2 relative z-10">
                          <span className="text-[#00ffff]/70 uppercase">
                            {t.children}:
                          </span>{" "}
                          {children.join(", ")}
                        </p>
                      )}
                      <div className="flex gap-4 text-[10px] mb-3 font-mono relative z-10">
                        <div className="flex items-center gap-1">
                          <span className="text-[#00ffff]/50 uppercase">
                            {t.lang}:
                          </span>
                          <span className="text-gray-300">
                            {languages.join(", ")}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[#00ffff]/50 uppercase">
                            {t.origin}:
                          </span>
                          <span className="text-gray-300">{country}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ),
      },
    ];

    return {
      landing: landingSections,
      guestList: guestListSections,
    };
  }, [t, language, handleGuestSelect]);

  const pageVariants = {
    initial: (d: number) => ({
      x: `${d * 30}%`,
      rotateY: d * 15,
      opacity: 0,
    }),
    animate: {
      x: 0,
      rotateY: 0,
      scale: 1,
      z: 0,
      opacity: 1,
    },
    exit: (d: number) => ({
      x: `${-d * 30}%`,
      rotateY: -d * 15,
      opacity: 0,
    }),
  };

  const firstMountVariants = {
    initial: {
      scale: 0.2,
      z: -2000,
      opacity: 0,
    },
    animate: {
      x: 0,
      rotateY: 0,
      scale: 1,
      z: 0,
      opacity: 1,
    },
  };

  return (
    <div className="relative min-h-screen text-white overflow-hidden font-mono selection:bg-[#ff00ff] selection:text-white">
      <CyberpunkBackground scrollProgress={scrollProgress} />
      <StickyMenu language={language} onLanguageChange={handleLanguageSelect} />

      <AnimatePresence mode="wait">
        {!language && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4"
          >
            <div className="p-8 border-2 border-[#ff00ff] bg-black/80 max-w-md w-full text-center space-y-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff00ff] to-transparent animate-pulse" />
              <div className="flex flex-col gap-4">
                <NeonButton
                  variant="pink"
                  onClick={() => handleLanguageSelect("ru")}
                >
                  Русский
                </NeonButton>
                <NeonButton
                  variant="cyan"
                  onClick={() => handleLanguageSelect("en")}
                >
                  English
                </NeonButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="popLayout" custom={direction}>
        <motion.div
          key={currentPage}
          custom={direction}
          variants={isFirstMount.current ? firstMountVariants : pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{
            duration: isFirstMount.current ? 1.5 : 0.6,
            ease: [0.2, 0, 0.2, 1],
          }}
          style={{
            transformOrigin: isFirstMount.current
              ? "center center"
              : "center center 2500px",
            transformStyle: "preserve-3d",
          }}
          className="absolute inset-0 w-full h-full z-20"
        >
          <SectionPage
            sections={pages[currentPage]}
            scrollProgress={scrollProgress}
          />
        </motion.div>
      </AnimatePresence>

      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <GuestDossier
        guest={selectedGuest}
        isOpen={!!selectedGuest}
        onClose={() => handleGuestSelect(null)}
        onNext={handleNextGuest}
        onPrev={handlePrevGuest}
        language={language || "en"}
      />
    </div>
  );
}

export default App;
