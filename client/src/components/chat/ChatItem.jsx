'use client'

import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Badge } from "../ui/badge"
import { cn } from "@/lib/utils";

function getInitials(name) {
  const words = (name || "Unknown user").trim().split(/\s+/).filter(Boolean);
  return words.slice(0, 2).map((word) => word[0]).join("").toUpperCase() || "U";
}

function formatConversationTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

export default function ChatItem({ item, isActive, isOnline, onClick }) {
  const username = item.chatWith?.username || "Unknown user";
  const preview = typeof item.lastMessage?.content === "string"
    ? item.lastMessage.content
    : item.lastMessage?.messageType === "image"
      ? "Image"
      : "No messages yet";
  const lastMessageTime = formatConversationTime(item.lastMessageAt);
  const unreadCount = Number(item.unreadCount) || 0;

  return (
    <button
      type="button"
      aria-current={isActive ? "page" : undefined}
      aria-label={`${username}${isOnline ? ", online" : ""}${unreadCount ? `, ${unreadCount} unread messages` : ""}${preview ? `, ${preview}` : ""}`}
      className={cn(
        "flex min-h-[76px] w-full min-w-0 items-center gap-3 rounded-2xl border border-transparent p-3 text-left transition-colors hover:bg-secondary/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isActive && "border-blue-600/15 bg-blue-600/[0.08] hover:bg-blue-600/[0.12]"
      )}
      onClick={() => onClick(item)}
    >
      <Avatar className="size-11">
        <AvatarImage src={item.chatWith?.avatar} alt={username} />
        <AvatarFallback>{getInitials(username)}</AvatarFallback>
        {isOnline && <AvatarBadge className="bg-(--online)" />}
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center justify-between gap-2">
          <h4 className={cn("truncate text-sm font-semibold", isActive && "text-blue-700 dark:text-blue-300")}>{username}</h4>
          <span className="shrink-0 text-[11px] text-muted-foreground">{lastMessageTime}</span>
        </div>
        <div className="mt-1 flex min-w-0 items-center justify-between gap-2">
          <p className="min-w-0 flex-1 truncate text-xs text-muted-foreground">{preview}</p>
          {unreadCount > 0 && (
            <Badge aria-label={`${unreadCount} unread`} className="h-5 min-w-5 shrink-0 justify-center rounded-full bg-blue-600 px-1.5 text-[11px] font-semibold text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </button>
  );
}
