// src/components/chat/ChatMessages.jsx

import { useChatStore } from "@/store/chatStore";

import { useEffect, useRef } from "react";
import { useState } from "react";
import { AlertCircle, ArrowDown } from "lucide-react";
import ChatBubble from "../MessageBubble/ChatBubble";
import TypingIndicator from "../MessageBubble/TypingIndicator";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";

// abhi ye component sirf messages ko render karta hai
// scroll ko manage karta hai
// jab user top pe pahuchta hai tab parent ko bolta hai older messages fetch karo

export default function ChatMessages({
  messages,
  selectedChat,
  onLoadOlder,
  isLoadingMore,
  hasMore,
  isLoading,
  error,
  onRetry,
  olderMessagesError,
  onRetryOlder,
  onRetryMessage,
}) {
  const containerRef = useRef(null);
  const previousMessageCountRef = useRef(0);
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const conversationId = selectedChat?._id?.toString();
  const chatWithId = selectedChat?.chatWith?._id?.toString();
  const typingUserId = useChatStore((state) => state.typingUsers.get(conversationId));
  const isTyping = Boolean(typingUserId && typingUserId === chatWithId);
  // user niche hai ya old messages padh raha hai
  const isUserScrolledUp = useRef(false);
  // pagination ke pehle current scrollHeight store karenge
  const previousScrollHeight = useRef(0);
  // ye batayega ki pagination chal rahi hai ya nahi
  const isPaginating = useRef(false);
  // first time chat open hua ya nahi
  const initialScrollDone = useRef(false);

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
      if (!isUserScrolledUp.current && newMessagesCount > 0) {
        setNewMessagesCount(0);
      }

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
  }, [hasMore, isLoadingMore, newMessagesCount, onLoadOlder]);

  // initial scroll bottom + new message scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const addedMessages = Math.max(0, messages.length - previousMessageCountRef.current);
    previousMessageCountRef.current = messages.length;

    // pagination hui hai to bottom mat jao
    if (isPaginating.current) return;

    // first time chat open hui
    if (!initialScrollDone.current) {
      container.scrollTop = container.scrollHeight;
      initialScrollDone.current = true;
      return;
    }

    if (isUserScrolledUp.current) {
      if (addedMessages > 0) {
        setNewMessagesCount((count) => count + addedMessages);
      }
      return;
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.length, selectedChat?._id, isTyping]);

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
    <div className="relative min-h-0 flex-1">
      <div
        ref={containerRef}
        className="absolute inset-0 overflow-y-auto bg-secondary/35 px-3 py-4 sm:px-4"
      >
      <div className="flex w-full flex-col gap-3">
        {isLoading && (
          <div className="mt-auto flex flex-col justify-end gap-4" role="status" aria-label="Loading messages">
            <span className="sr-only">Loading messages</span>
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className={`flex ${item % 2 ? "justify-end" : "justify-start"}`}>
                <Skeleton className={`h-12 w-2/3 max-w-80 rounded-2xl ${item % 2 ? "ml-auto" : ""}`} />
              </div>
            ))}
          </div>
        )}
        {!isLoading && error && (
          <div className="m-auto w-full max-w-sm rounded-2xl border border-destructive/20 bg-background p-5 text-center" role="alert">
            <AlertCircle className="mx-auto size-7 text-destructive" aria-hidden="true" />
            <h2 className="mt-3 text-sm font-semibold">Messages unavailable</h2>
            <p className="mt-1 text-sm leading-5 text-muted-foreground">{error}</p>
            <Button type="button" variant="outline" className="mt-4" onClick={onRetry}>Try again</Button>
          </div>
        )}
        {!isLoading && !error && olderMessagesError && (
          <div className="mx-auto flex items-center gap-3 rounded-xl border border-destructive/20 bg-background px-3 py-2 text-sm" role="alert">
            <span className="text-muted-foreground">{olderMessagesError}</span>
            <Button type="button" variant="outline" size="sm" onClick={onRetryOlder}>Retry</Button>
          </div>
        )}
        {isLoadingMore && (
          <div className="flex justify-center py-3" role="status" aria-label="Loading older messages">
            <Skeleton className="h-8 w-36 rounded-full" />
          </div>
        )}
        {!isLoading && !error && messages.length === 0 && (
          <div className="flex min-h-[45vh] items-center justify-center">
            <div className="rounded-2xl border border-dashed border-border bg-background/70 px-6 py-5 text-center">
              <h2 className="font-semibold">No messages yet</h2>
              <p className="mt-1 text-sm text-muted-foreground">Send the first message to start this conversation.</p>
            </div>
          </div>
        )}
        {!isLoading && !error && messages.map((message, index) => {
          const previous = messages[index - 1];
          const next = messages[index + 1];
          const messageSenderId = message.senderId?.toString();
          const startsGroup = !isSameSenderGroup(previous, message);
          const endsGroup = !isSameSenderGroup(message, next);
          const showDate = !previous || getDateKey(previous.createdAt) !== getDateKey(message.createdAt);
          const date = new Date(message.createdAt);

          return (
            <div key={message._id} className={startsGroup ? "mt-2" : "-mt-2"}>
              {showDate && (
                <div className="mb-4 mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                  <Separator className="flex-1" />
                  <time dateTime={Number.isNaN(date.getTime()) ? undefined : date.toISOString()}>
                    {Number.isNaN(date.getTime()) ? "Earlier" : date.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}
                  </time>
                  <Separator className="flex-1" />
                </div>
              )}
              <ChatBubble
                message={message}
                selectedChat={selectedChat}
                showAvatar={startsGroup}
                showMeta={endsGroup}
                onRetry={onRetryMessage}
              />
              {endsGroup && index < messages.length - 1 && messageSenderId !== messages[index + 1].senderId?.toString() && (
                <div className="h-2" aria-hidden="true" />
              )}
            </div>
          );
        })}

        {!isLoading && !error && (
          <div>
          {isTyping && (
            <>
              <Avatar className="size-7">
                <AvatarImage src={selectedChat?.chatWith?.avatar} alt={`${selectedChat?.chatWith?.username} avatar`} />
                <TypingIndicator />
              </Avatar>
            </>
          )}
          </div>
        )}
      </div>
      </div>
      {newMessagesCount > 0 && (
        <Button
          type="button"
          variant="secondary"
          className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full border border-border bg-background shadow-md"
          aria-label={`${newMessagesCount} new message${newMessagesCount === 1 ? "" : "s"}, scroll to latest`}
          onClick={() => {
            const container = containerRef.current;
            if (!container) return;

            container.scrollTop = container.scrollHeight;
            setNewMessagesCount(0);
            isUserScrolledUp.current = false;
          }}
        >
          <ArrowDown className="size-4" aria-hidden="true" />
          {newMessagesCount} new message{newMessagesCount === 1 ? "" : "s"}
        </Button>
      )}
    </div>
  );
}

function getDateKey(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "invalid" : date.toDateString();
}

function isSameSenderGroup(left, right) {
  if (!left || !right || left.senderId?.toString() !== right.senderId?.toString()) return false;

  const leftDate = new Date(left.createdAt);
  const rightDate = new Date(right.createdAt);
  return !Number.isNaN(leftDate.getTime()) &&
    !Number.isNaN(rightDate.getTime()) &&
    leftDate.toDateString() === rightDate.toDateString() &&
    Math.abs(rightDate.getTime() - leftDate.getTime()) < 5 * 60 * 1000;
}
