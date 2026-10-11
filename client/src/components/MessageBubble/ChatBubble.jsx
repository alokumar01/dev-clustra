'use client';

import { useAuthStore } from "@/store/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { AlertCircle, Check, CheckCheck, LoaderCircle } from "lucide-react";
import { Bubble, BubbleContent } from "../ui/bubble";
import { cn } from "@/lib/utils";
import formatMessageTime from "@/lib/formatDate";

export default function ChatBubble({
  message,
  selectedChat,
  showAvatar = true,
  showMeta = true,
  onRetry,
}) {
  const user = useAuthStore((state) => state.user);
  const isMe = message.senderId?.toString() === user?._id?.toString();
  const senderName = selectedChat?.chatWith?.username || "Contact";
  const time = formatMessageTime(message.createdAt, true);
  const status = getMessageStatus(message);

  return (
    <div className={cn("flex w-full items-end gap-2 px-1", isMe ? "justify-end" : "justify-start")}>
      {!isMe && showAvatar && (
        <Avatar className="mb-1 size-7">
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
              "max-w-full px-3.5 py-2.5 text-sm leading-6 sm:text-[0.95rem]",
              isMe
                ? "rounded-2xl rounded-br-md border-blue-600 bg-blue-600 text-white"
                : "rounded-2xl rounded-bl-md border-border bg-background text-foreground dark:bg-card"
            )}
          >
            <p className="whitespace-pre-wrap wrap-break-word">{message.content}</p>
          </BubbleContent>
        </Bubble>

        {showMeta && <div
          className={cn(
            "mt-1 flex h-4 items-center gap-1 text-[11px] leading-none text-muted-foreground",
            isMe ? "justify-end pr-1" : "justify-start pl-1"
          )}
        >
          <span>{time}</span>

          {isMe && (
            message.sendStatus === "failed" ? (
              <span className="inline-flex items-center gap-1 text-destructive">
                <AlertCircle className="size-3.5" aria-hidden="true" />
                <span>Not sent</span>
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="h-auto p-0 text-xs text-destructive underline underline-offset-2"
                  onClick={() => onRetry?.(message)}
                >
                  Retry
                </Button>
              </span>
            ) : message.sendStatus === "sending" ? (
              <span className="inline-flex items-center gap-1" aria-label="Sending">
                <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" />
                <span>Sending</span>
              </span>
            ) : (
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
            )
          )}
        </div>}
      </div>
    </div>
  );
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
