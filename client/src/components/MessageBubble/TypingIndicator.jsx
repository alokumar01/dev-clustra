"use client";

import Lottie from "lottie-react";
import typingDotsAnimation from "../../../public/chat-typing-dots.json";

export default function TypingIndicator() {
  return (
    <div className="flex items-end justify-start gap-2 px-1">
      <div className="flex h-9 w-16 items-center justify-center rounded-2xl rounded-bl-md border border-border bg-background px-3 shadow-sm dark:bg-card">
        <Lottie
          aria-label="Typing"
          animationData={typingDotsAnimation}
          loop
          autoplay
          className="h-7 w-10"
        />
      </div>
    </div>
  );
}
