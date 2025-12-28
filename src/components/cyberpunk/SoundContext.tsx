import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import useSound from "use-sound";

interface SoundContextType {
  playClick: () => void;
  playTransition: () => void;
  playGlitch: () => void;
  playMenu: () => void;
  playLanguage: () => void;
  isMuted: boolean;
  toggleMute: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

// Cyberpunk-style sound URLs
const SOUNDS = {
  CLICK: "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3",
  TRANSITION:
    "https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3",
  GLITCH: "https://assets.mixkit.co/active_storage/sfx/2558/2558-preview.mp3",
  MENU: "https://assets.mixkit.co/active_storage/sfx/2567/2567-preview.mp3",
  LANGUAGE: "https://assets.mixkit.co/active_storage/sfx/2569/2569-preview.mp3",
  BACKGROUND: "https://cdn.pixabay.com/audio/2022/02/22/audio_d0c6af1110.mp3",
};

export function SoundProvider({ children }: { children: ReactNode }) {
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const [playClick] = useSound(SOUNDS.CLICK, {
    volume: isMuted ? 0 : 0.6,
    interrupt: true,
    preload: true,
  });
  const [playTransition] = useSound(SOUNDS.TRANSITION, {
    volume: isMuted ? 0 : 0.6,
    interrupt: true,
    preload: true,
  });
  const [playGlitch] = useSound(SOUNDS.GLITCH, {
    volume: isMuted ? 0 : 0.5,
    interrupt: true,
    preload: true,
  });
  const [playMenu] = useSound(SOUNDS.MENU, {
    volume: isMuted ? 0 : 0.7,
    interrupt: true,
    preload: true,
  });
  const [playLanguage] = useSound(SOUNDS.LANGUAGE, {
    volume: isMuted ? 0 : 0.6,
    interrupt: true,
    preload: true,
  });

  const [playBackground, { stop: stopBackground }] = useSound(
    SOUNDS.BACKGROUND,
    {
      volume: isMuted ? 0 : 0.1,
      loop: true,
      interrupt: false,
      preload: true,
    }
  );

  // Wrap play functions to ensure they only play after interaction
  const safePlay = (playFn: () => void) => {
    if (hasInteracted && !isMuted) {
      playFn();
    }
  };

  // Handle background music and initial interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        if (!isMuted) {
          playBackground();
        }
      }
    };

    const events = [
      "click",
      "keydown",
      "touchstart",
      "mousedown",
      "pointerdown",
      "wheel",
    ];
    events.forEach((event) =>
      window.addEventListener(event, handleFirstInteraction)
    );

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, handleFirstInteraction)
      );
    };
  }, [hasInteracted, isMuted, playBackground]);

  // Sync background music with mute state after interaction
  useEffect(() => {
    if (hasInteracted) {
      if (isMuted) {
        stopBackground();
      } else {
        playBackground();
      }
    }
  }, [isMuted, hasInteracted, playBackground, stopBackground]);

  const toggleMute = () => setIsMuted((prev) => !prev);

  return (
    <SoundContext.Provider
      value={{
        playClick: () => safePlay(playClick),
        playTransition: () => safePlay(playTransition),
        playGlitch: () => safePlay(playGlitch),
        playMenu: () => safePlay(playMenu),
        playLanguage: () => safePlay(playLanguage),
        isMuted,
        toggleMute,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within a SoundProvider");
  }
  return context;
}
