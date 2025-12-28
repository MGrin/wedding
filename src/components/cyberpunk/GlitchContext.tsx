import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

interface GlitchContextType {
  isGlitchMode: boolean;
  toggleGlitchMode: () => void;
}

const GlitchContext = createContext<GlitchContextType | undefined>(undefined);

export function GlitchProvider({ children }: { children: ReactNode }) {
  const [isGlitchMode, setIsGlitchMode] = useState(false);

  const toggleGlitchMode = () => {
    setIsGlitchMode((prev) => !prev);
  };

  return (
    <GlitchContext.Provider value={{ isGlitchMode, toggleGlitchMode }}>
      {children}
    </GlitchContext.Provider>
  );
}

export function useGlitch() {
  const context = useContext(GlitchContext);
  if (context === undefined) {
    throw new Error("useGlitch must be used within a GlitchProvider");
  }
  return context;
}

export function useGlitchState() {
  const { isGlitchMode } = useGlitch();
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    if (isGlitchMode) {
      setIsGlitching(true);
      return;
    } else {
      // Reset immediately when mode is turned off
      setIsGlitching(false);
    }

    const interval = setInterval(() => {
      if (Math.random() > 0.9) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 500);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isGlitchMode]);

  return isGlitching;
}
