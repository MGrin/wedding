import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Shield,
  User,
  Globe,
  Languages,
  Info,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { TypewriterText } from "./TypewriterText";
import { GlitchText } from "./GlitchText";
import type { Guest } from "../../types";
import { TRANSLATIONS, type Language } from "../../i18n";
import { useGlitchState } from "./GlitchContext";
import { useAudio } from "./SoundContext";

interface GuestDossierProps {
  guest: Guest | null;
  isOpen: boolean;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  language: Language;
}

export function GuestDossier({
  guest,
  isOpen,
  onClose,
  onNext,
  onPrev,
  language,
}: GuestDossierProps) {
  const t = TRANSLATIONS[language];
  const isGlitching = useGlitchState();
  const { playClick } = useAudio();

  if (!guest) return null;

  const handleClose = () => {
    playClick();
    onClose();
  };

  const handleNext = () => {
    playClick();
    if (onNext) onNext();
  };

  const handlePrev = () => {
    playClick();
    if (onPrev) onPrev();
  };

  const title = language === "ru" ? guest.titleRu || guest.title : guest.title;
  const names = language === "ru" ? guest.namesRu || guest.names : guest.names;
  const children =
    language === "ru" ? guest.childrenRu || guest.children : guest.children;
  const country =
    language === "ru" ? guest.countryRu || guest.country : guest.country;
  const details =
    language === "ru" ? guest.detailsRu || guest.details : guest.details;
  const languages = guest.languages.map((l) => (t.langNames as any)[l] || l);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />

          {/* Dossier Window */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-black/60 border-2 border-[#00ffff] shadow-[0_0_50px_rgba(0,255,255,0.2)] overflow-hidden flex flex-col max-h-[90vh] backdrop-blur-xl"
          >
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 bg-[#00ffff]/15 backdrop-blur-lg border-b-2 border-[#00ffff] p-4 md:p-6 flex justify-between items-center z-30">
              <div className="flex items-center gap-3">
                <Shield
                  className="text-[#ff00ff] animate-pulse flex-shrink-0"
                  size={24}
                />
                <div>
                  <h2 className="text-[#00ffff] font-black text-xl md:text-2xl tracking-tighter uppercase hidden md:block">
                    <GlitchText text={t.guestDatabase} />
                  </h2>
                  <p className="text-[#ff00ff] text-[10px] font-mono tracking-[0.3em]">
                    <span className="hidden md:inline">
                      <GlitchText text="CLASSIFIED // " />
                    </span>
                    <GlitchText text={`ID: ${guest.id}`} />
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center border border-[#00ffff]/30 rounded-sm overflow-hidden mr-2">
                  <button
                    onClick={handlePrev}
                    className="text-[#00ffff] hover:bg-[#00ffff]/20 transition-colors p-2 border-r border-[#00ffff]/30 cursor-pointer"
                    title="Previous Dossier"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={handleNext}
                    className="text-[#00ffff] hover:bg-[#00ffff]/20 transition-colors p-2 cursor-pointer"
                    title="Next Dossier"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>

                <button
                  onClick={handleClose}
                  className="text-[#00ffff] hover:text-[#ff00ff] transition-colors p-2 hover:bg-[#ff00ff]/10 rounded-sm cursor-pointer"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Decorative scanline */}
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[#00ffff] opacity-50 animate-scan" />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 pt-28 md:pt-32 space-y-8 custom-scrollbar relative">
              {/* Watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] overflow-hidden">
                <div className="rotate-[-35deg] text-[12rem] font-black whitespace-nowrap select-none">
                  <GlitchText text="TOP SECRET" />
                </div>
              </div>

              {/* Top Section: Image and Title */}
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start relative z-10">
                {/* Subject Title */}
                <div className="flex-1 pt-2">
                  <h3 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-none">
                    <TypewriterText text={title.toUpperCase()} speed={50} />
                  </h3>
                  <div className="mt-4 h-[2px] w-24 bg-gradient-to-r from-[#00ffff] to-transparent" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                {/* Names */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[#ff00ff]">
                    <User size={16} />
                    <span className="text-xs font-mono uppercase tracking-widest">
                      <GlitchText text={t.names} />
                    </span>
                  </div>
                  <div className="pl-6 border-l border-[#ff00ff]/30 space-y-2">
                    {names.map((name, i) => (
                      <p key={i} className="text-gray-300 font-bold">
                        <TypewriterText text={name} delay={500 + i * 200} />
                      </p>
                    ))}
                  </div>
                </div>

                {/* Origin */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[#00ffff]">
                    <Globe size={16} />
                    <span className="text-xs font-mono uppercase tracking-widest">
                      <GlitchText text={t.origin} />
                    </span>
                  </div>
                  <div className="pl-6 border-l border-[#00ffff]/30">
                    <p className="text-gray-300 font-bold">
                      <TypewriterText text={country} delay={1000} />
                    </p>
                  </div>
                </div>

                {/* Languages */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[#00ffff]">
                    <Languages size={16} />
                    <span className="text-xs font-mono uppercase tracking-widest">
                      <GlitchText text={t.lang} />
                    </span>
                  </div>
                  <div className="pl-6 border-l border-[#00ffff]/30">
                    <p className="text-gray-300 font-bold">
                      <TypewriterText
                        text={languages.join(", ")}
                        delay={1200}
                      />
                    </p>
                  </div>
                </div>

                {/* Children */}
                {children.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[#ff00ff]">
                      <Shield size={16} />
                      <span className="text-xs font-mono uppercase tracking-widest">
                        <GlitchText text={t.children} />
                      </span>
                    </div>
                    <div className="pl-6 border-l border-[#ff00ff]/30 space-y-2">
                      {children.map((child, i) => (
                        <p key={i} className="text-gray-300 font-bold">
                          <TypewriterText text={child} delay={1400 + i * 200} />
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Details */}
              {details && (
                <div className="space-y-4 pt-4 border-t border-[#00ffff]/20 relative z-10">
                  <div className="flex items-center gap-2 text-[#00ffff]">
                    <Info size={16} />
                    <span className="text-xs font-mono uppercase tracking-widest">
                      <GlitchText text={t.additionalIntel} />
                    </span>
                  </div>
                  <div className="pl-6 border-l border-[#00ffff]/30">
                    <p className="text-gray-400 text-sm leading-relaxed italic">
                      <TypewriterText text={details} delay={1800} speed={20} />
                    </p>
                  </div>
                </div>
              )}

              {/* Footer Hex Data */}
              <div className="pt-8 flex justify-between items-end opacity-20 font-mono text-[8px] text-[#00ffff] relative z-10">
                <div className="space-y-1">
                  <p>
                    <GlitchText text="0x4A 0x6F 0x69 0x6E 0x20 0x55 0x73" />
                  </p>
                  <p>
                    <GlitchText text="0x31 0x36 0x2E 0x30 0x35 0x2E 0x32 0x36" />
                  </p>
                </div>
                <div className="text-right">
                  <p>
                    <GlitchText text="ENCRYPTION: AES-256-GCM" />
                  </p>
                  <p>
                    <GlitchText text="STATUS: VERIFIED" />
                  </p>
                </div>
              </div>
            </div>

            {/* Scanning Overlay */}
            <motion.div
              initial={{ top: "-100%" }}
              animate={{ top: "100%" }}
              transition={{ duration: 2, ease: "linear", repeat: 0 }}
              className="absolute left-0 right-0 h-20 bg-gradient-to-b from-transparent via-[#00ffff]/20 to-transparent pointer-events-none z-50"
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
