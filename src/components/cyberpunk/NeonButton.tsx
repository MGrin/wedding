import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "../../lib/utils";
import { GlitchText } from "./GlitchText";
import type { ReactNode } from "react";
import { useAudio } from "./SoundContext";

interface NeonButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: "pink" | "cyan";
  children: ReactNode;
}

export function NeonButton({
  children,
  className,
  variant = "pink",
  onClick,
  ...props
}: NeonButtonProps) {
  const { playClick } = useAudio();
  const color = variant === "pink" ? "#ff00ff" : "#00ffff";
  const shadowColor =
    variant === "pink" ? "rgba(255, 0, 255, 0.5)" : "rgba(0, 255, 255, 0.5)";

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    playClick();
    if (onClick) onClick(e);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05, boxShadow: `0 0 20px ${shadowColor}` }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className={cn(
        "relative px-8 py-3 font-mono text-lg uppercase tracking-widest border-2 transition-colors duration-300 cursor-pointer",
        variant === "pink"
          ? "border-[#ff00ff] text-[#ff00ff] hover:bg-[#ff00ff] hover:text-black"
          : "border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff] hover:text-black",
        className
      )}
      style={{
        textShadow: `0 0 5px ${color}`,
      }}
      {...props}
    >
      <span className="relative z-10">
        {typeof children === "string" ? (
          <GlitchText text={children} />
        ) : (
          children
        )}
      </span>
      <div className="absolute inset-0 opacity-20 bg-current" />
    </motion.button>
  );
}
