import { motion } from "framer-motion";
import { useGlitch, useGlitchState } from "./GlitchContext";

interface GlitchTextProps {
  text: string;
  className?: string;
  forceGlitch?: boolean;
}

export function GlitchText({
  text,
  className = "",
  forceGlitch,
}: GlitchTextProps) {
  const { isGlitchMode } = useGlitch();
  const globalGlitching = useGlitchState();
  const isGlitching = forceGlitch !== undefined ? forceGlitch : globalGlitching;

  const glitchVariants = {
    glitch: {
      x: [0, -2, 2, -1, 1, 0],
      y: [0, 1, -1, 0],
      transition: {
        duration: 0.1,
        repeat: isGlitchMode ? Infinity : 0,
        repeatType: "mirror" as const,
      },
    },
    idle: {
      x: 0,
      y: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <span className={`relative inline-block ${className}`}>
      <motion.span
        className="relative z-10"
        animate={isGlitching ? "glitch" : "idle"}
        variants={glitchVariants}
      >
        {text}
      </motion.span>

      {isGlitching && (
        <>
          <motion.span
            animate={
              isGlitchMode ? { x: [-2, -4, -1, -3, -2], y: [1, 2, 0, 1] } : {}
            }
            transition={
              isGlitchMode ? { duration: 0.15, repeat: Infinity } : {}
            }
            className="absolute top-0 left-0 -z-10 text-[#ff00ff] opacity-70 translate-x-[-2px] translate-y-[1px] mix-blend-screen"
          >
            {text}
          </motion.span>
          <motion.span
            animate={
              isGlitchMode ? { x: [2, 4, 1, 3, 2], y: [-1, -2, 0, -1] } : {}
            }
            transition={
              isGlitchMode ? { duration: 0.15, repeat: Infinity } : {}
            }
            className="absolute top-0 left-0 -z-10 text-[#00ffff] opacity-70 translate-x-[2px] translate-y-[-1px] mix-blend-screen"
          >
            {text}
          </motion.span>
        </>
      )}
    </span>
  );
}
