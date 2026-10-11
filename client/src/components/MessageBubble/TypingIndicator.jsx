"use client";

import Lottie from "lottie-react";
import typingDotsAnimation from "../../../public/chat-typing-dots.json";

export default function TypingIndicator() {
  return (
    <div className="flex items-end justify-start gap-2 px-1">
      <Lottie
        aria-label="Typing"
        animationData={typingDotsAnimation}
        loop
        autoplay
        className="h-7 w-10"
      />
    </div>
  );
}
