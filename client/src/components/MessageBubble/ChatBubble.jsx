'use client';

import { useAuthStore } from "@/store/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Check, CheckCheck } from "lucide-react";

export default function ChatBubble({ message, selectedChat }) {
  const user = useAuthStore((state) => state.user);

  const isMe = message.senderId === user?._id;
  // const avatar = isMe ? user?.avatar : selectedChat?.chatWith?.avatar;
  // const fallback = isMe ? user?.username?.[0] : selectedChat?.chatWith?.username?.[0];
  // const name = isMe ? "You" : selectedChat?.chatWith?.username;

  return (
    <div className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex min-w-0 max-w-[88%] gap-2 sm:max-w-[72%] lg:max-w-[66%] ${
          isMe ? "flex-row-reverse" : ""
        }`}
      >
        {/* <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src={avatar} alt="avatar" />
          <AvatarFallback>{ "U"}</AvatarFallback>
        </Avatar> */}

        <div
          className={`min-w-0 rounded-2xl px-4 py-2 shadow-sm ${
            isMe
              ? "rounded-br-md bg-primary text-primary-foreground"
              : "rounded-bl-md border border-border bg-background text-foreground"
          }`}
        >
          <p className="break-words text-sm leading-6">{message.content}</p>

          <div
            className={`flex items-center gap-1 mt-1 text-[11px] ${
              isMe
                ? "justify-end text-primary-foreground/80"
                : "justify-end text-muted-foreground"
            }`}
          >
            <span>
              {new Date(message.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>

            {isMe && (
              <>
                {/* READ */}
                {message.readAt ? (
                  <span className="text-primary-foreground"><CheckCheck size={14} /></span>
                ) : message.deliveredAt ? (
                  <span><CheckCheck size={14} /></span>
                ) : (
                  <span><Check size={14} /></span>
                )}
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
