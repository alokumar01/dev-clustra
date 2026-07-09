'use client';

import { useAuthStore } from "@/store/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Check, CheckCheck } from "lucide-react";

export default function ChatBubble({ message, selectedChat }) {
  const user = useAuthStore((state) => state.user);

  const isMe = message.senderId === user?._id;
  const avatar = isMe ? user?.avatar : selectedChat?.chatWith?.avatar;
  // const name = isMe ? "You" : selectedChat?.chatWith?.username;

  return (
    <div className={`flex w-full mb-4 ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex gap-2 max-w-[70%] ${
          isMe ? "flex-row-reverse" : ""
        }`}
      >
        {/* Avatar */}
        <Avatar className="w-8 h-8 shrink-0">
          <AvatarImage src={avatar} alt="avatar" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>

        {/* Bubble */}
        <div
          className={`px-4 py-2 rounded-2xl ${
            isMe
              ? "bg-gradient-to-r from-green-400 to-green-600 text-white rounded-br-none"
              : "bg-gray-200 text-gray-800 rounded-bl-none"
          }`}
        >
          {/* Message */}
          <p className="text-sm break-words">{message.content}</p>

          {/* Footer */}
          <div
            className={`flex items-center gap-1 mt-1 text-[11px] ${
              isMe
                ? "justify-end text-white/80"
                : "justify-end text-gray-500"
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
                  <span className="text-sky-400"><CheckCheck size={14} /></span>
                ) : message.deliveredAt ? (
                  /* DELIVERED */
                  <span><CheckCheck size={14} /></span>
                ) : (
                  /* SENT */
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
