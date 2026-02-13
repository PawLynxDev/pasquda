"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const loadingMessages = [
  "Examining your font choices with great disappointment...",
  "Counting the number of stock photos... oh no.",
  "Checking if your site was built in 2003... brb.",
  "Our AI is composing the perfect insult...",
  "Looking for your design skills... still looking...",
  "Pasquda has seen things. Terrible things. Like your hero section.",
  "Generating your Report Card of Shame...",
  "Analyzing your color palette... are you colorblind? Serious question.",
  "Rating your whitespace usage on a scale of 'too much' to 'help'...",
  "Scanning for originality... scan complete. No results found.",
  "Your website is loading faster than our roast. That's the only win you'll get.",
  "Consulting with our team of design critics (it's just one angry AI)...",
  "Writing a roast so good you'll want to frame it. Or cry. Probably both.",
  "Almost done. The roast is... well-done.",
];

export function LoadingScreen() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex min-h-[60vh] flex-col items-center justify-center px-4">
      {/* Background glow */}
      <div className="pointer-events-none absolute h-48 w-48 rounded-full bg-pasquda-pink/10 blur-[100px] sm:h-64 sm:w-64" />

      {/* Animated mascot */}
      <Image
        src="/pasquda_logo_dark.png"
        alt="Pasquda analyzing..."
        width={140}
        height={140}
        className="relative h-28 w-28 animate-float sm:h-36 sm:w-36"
      />

      {/* Rotating message */}
      <p
        key={messageIndex}
        className="relative mt-6 max-w-sm text-center text-base text-pasquda-gray animate-fade-in sm:mt-8 sm:max-w-md sm:text-lg"
      >
        {loadingMessages[messageIndex]}
      </p>

      {/* Progress bar */}
      <div className="relative mt-8 h-1.5 w-60 overflow-hidden rounded-full bg-white/[0.06] sm:mt-10 sm:w-72">
        <div className="h-full rounded-full bg-gradient-to-r from-pasquda-pink to-pasquda-pink-light animate-progress" />
      </div>

      <p className="relative mt-4 text-xs text-pasquda-gray/30 sm:text-sm">
        This usually takes 10-15 seconds
      </p>
    </div>
  );
}
