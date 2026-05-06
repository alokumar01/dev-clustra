'use client';

import { useAuthStore } from "@/store/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function ChatBubble({ message, selectedChat }) {
  const user = useAuthStore((state) => state.user);
  const isMe = message.senderId === user?._id;
  const avatar = isMe ? user?.avatar : selectedChat?.chatWith?.avatar;
  const name = isMe ? "You" : selectedChat?.chatWith?.username;

  return (
    <div className={`flex w-full mb-4 ${isMe ? "justify-end" : "justify-start"}`}>
      <div className={`flex gap-2 max-w-[70%] ${isMe ? "flex-row-reverse" : ""}`}>
        <Avatar className="w-8 h-8">
          <AvatarImage src={avatar} alt="avatar" />
          <AvatarFallback>{name?.[0] || 'U'}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <div className={`flex items-center gap-2 text-xs text-gray-500 ${isMe ? "justify-end" : "justify-start"}`}>
            <span className="font-medium">{name}</span>
            <span>
              {new Date(message.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div
            className={`px-4 py-2 rounded-2xl text-sm mt-1 ${
              isMe
                ? "bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-br-none"
                : "bg-gray-200 text-gray-800 rounded-bl-none"
            }`}
          >
            {message.content}
          </div>
        </div>
      </div>
    </div>
  );
}