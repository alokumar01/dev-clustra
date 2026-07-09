// src/components/chat/ChatMessages.jsx

import { useEffect, useRef } from "react";
import ChatBubble from "../MessageBubble/ChatBubble";

// abhi ye component sirf messages ko render karta hai
// scroll ko manage karta hai
// jab user top pe pahuchta hai tab parent ko bolta hai older messages fetch karo

export default function ChatMessages({
  messages,
  selectedChat,
  onLoadOlder,
  isLoadingMore,
  hasMore
}) {
  const containerRef = useRef(null);
  // user niche hai ya old messages padh raha hai
  const isUserScrolledUp = useRef(false);
  // pagination ke pehle current scrollHeight store karenge
  const previousScrollHeight = useRef(0);
  // ye batayega ki pagination chal rahi hai ya nahi
  const isPaginating = useRef(false);
  // first time chat open hua ya nahi
  const initialScrollDone = useRef(false);

  // reset refs jab conversation change ho
  useEffect(() => {
    initialScrollDone.current = false;
    isPaginating.current = false;
    previousScrollHeight.current = 0;
    isUserScrolledUp.current = false;
  }, [selectedChat?._id]);

  // scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const distanceFromBottom =
        container.scrollHeight -
        container.scrollTop -
        container.clientHeight;

      // user niche hai ya nahi
      isUserScrolledUp.current = distanceFromBottom > 120;

      // first render pe pagination nahi chalani
      if (!initialScrollDone.current) return;

      // user top pe pahuch gaya
      if (container.scrollTop <= 20 && !isPaginating.current && hasMore && !isLoadingMore) {
        // current height save karo
        previousScrollHeight.current = container.scrollHeight;
        // bata do ki pagination chal rahi hai
        isPaginating.current = true;

        // parent api call karega
        onLoadOlder();
      }
    };

    container.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [onLoadOlder]);

  // initial scroll bottom + new message scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // pagination hui hai to bottom mat jao
    if (isPaginating.current) return;

    // first time chat open hui
    if (!initialScrollDone.current) {
      container.scrollTop = container.scrollHeight;
      initialScrollDone.current = true;
      return;
    }

    // agar user old messages nahi padh raha to new message pe bottom chale jao
    if (!isUserScrolledUp.current) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages.length, selectedChat?._id]);

  // pagination ke baad wahi position restore karo
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!isPaginating.current) return;

    const difference =
      container.scrollHeight - previousScrollHeight.current;

    container.scrollTop += difference;

    previousScrollHeight.current = 0;
    isPaginating.current = false;
  }, [messages.length]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50"
    >
      <div className="space-y-4">
        {isLoadingMore && (
            <div className="flex justify-center py-3">
                <div className="h-5 w-5 rounded-full border-2 border-gray-300 border-t-blue-500 animate-spin" />
            </div>
        )}
        {messages.map((message) => (
          <ChatBubble
            key={message._id}
            message={message}
            selectedChat={selectedChat}
          />
        ))}
      </div>
    </div>
  );
}
