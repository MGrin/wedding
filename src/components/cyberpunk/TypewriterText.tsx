import { useState, useEffect } from "react";

interface TypewriterTextProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  onComplete?: () => void;
}

export function TypewriterText({
  text,
  speed = 30,
  delay = 0,
  className,
  onComplete,
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsStarted(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!isStarted) return;

    setDisplayedText("");
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayedText(text.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [isStarted, text, speed, onComplete]);

  return (
    <span className={className}>
      {displayedText}
      {isStarted && displayedText.length < text.length && (
        <span className="animate-pulse border-l-2 border-current ml-0.5" />
      )}
    </span>
  );
}
