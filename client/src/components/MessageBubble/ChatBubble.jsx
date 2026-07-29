'use client';

import { useAuthStore } from "@/store/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Check, CheckCheck } from "lucide-react";
import { Bubble, BubbleContent } from "../ui/bubble";
import { cn } from "@/lib/utils";

export default function ChatBubble({ message, selectedChat }) {
  const user = useAuthStore((state) => state.user);

  const isMe = message.senderId === user?._id;
  const senderName = selectedChat?.chatWith?.username || "Contact";
  const time = formatMessageTime(message.createdAt);
  const status = getMessageStatus(message);

  return (
    <div className={cn("flex w-full items-end gap-2 px-1", isMe ? "justify-end" : "justify-start")}>
      {!isMe && (
        <Avatar className="mb-5 size-8">
          <AvatarImage src={selectedChat?.chatWith?.avatar} alt={`${senderName} avatar`} />
          <AvatarFallback className="text-xs">{getInitial(senderName)}</AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "flex min-w-0 max-w-[86%] flex-col sm:max-w-[72%] lg:max-w-[64%]",
          isMe ? "items-end" : "items-start"
        )}
      >
        <Bubble
          align={isMe ? "end" : "start"}
          variant={isMe ? "default" : "outline"}
          className="max-w-full"
        >
          <BubbleContent
            className={cn(
              "max-w-full rounded-2xl px-3.5 py-2.5 text-[0.95rem] leading-6 shadow-sm",
              isMe
                ? "rounded-br-md border-blue-600 bg-blue-600 text-white shadow-blue-600/10"
                : "rounded-bl-md border-border bg-background text-foreground shadow-zinc-950/5 dark:bg-card"
            )}
          >
            <p className="whitespace-pre-wrap wrap-break-word">{message.content}</p>
          </BubbleContent>
        </Bubble>

        <div
          className={cn(
            "mt-1 flex h-4 items-center gap-1 text-[11px] leading-none text-muted-foreground",
            isMe ? "justify-end pr-1" : "justify-start pl-1"
          )}
        >
          <span>{time}</span>

          {isMe && (
            <span
              className={cn(
                "inline-flex items-center",
                status.type === "read" && "text-blue-600 dark:text-blue-400"
              )}
              title={status.label}
              aria-label={status.label}
            >
              {status.type === "sent" ? (
                <Check className="size-3.5" />
              ) : (
                <CheckCheck className="size-3.5" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function formatMessageTime(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}

function getMessageStatus(message) {
  if (message.readAt) {
    return { type: "read", label: "Read" };
  }

  if (message.deliveredAt) {
    return { type: "delivered", label: "Delivered" };
  }

  return { type: "sent", label: "Sent" };
}

function getInitial(name) {
  return name?.trim()?.[0]?.toUpperCase() || "U";
}
