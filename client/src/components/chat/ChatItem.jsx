'use client'

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

export default function ChatItem({ item, isActive, onClick }) {
  const lastMessageTime = item.lastMessageAt
    ? new Date(item.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-colors hover:bg-secondary/70 cursor-pointer",
        isActive && "bg-blue-600 text-white hover:bg-blue-600"
      )}
      onClick={() => onClick(item)}
    >
      <Avatar>
        <AvatarImage src={item.chatWith?.avatar} />
        <AvatarFallback>{item.chatWith?.username?.[0] || 'U'}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium truncate">{item.chatWith?.username || 'Unknown'}</h4>
        <p className={cn("truncate text-sm text-muted-foreground", isActive && "text-white/75")}>{item.lastMessage?.content || 'No messages yet'}</p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className={cn("text-xs text-muted-foreground", isActive && "text-white/70")}>
          {lastMessageTime}
        </span>
        {item.unreadCount > 0 && (
          <Badge className={cn("h-5 rounded-full bg-blue-600 px-2 text-xs text-white", isActive && "bg-white text-blue-600")}>{item.unreadCount}</Badge>
        )}
      </div>
    </button>
  );
}
