'use client'

import { Avatar, AvatarFallback, AvatarImage, AvatarBadge } from "../ui/avatar"
import { Badge } from "../ui/badge";

export default function ChatItem({ item, isActive, onClick }) {
  return (
    <div
      className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
        isActive
          ? 'bg-orange-50 border-l-4 border-orange-500'
          : 'hover:bg-gray-50'
      }`}
      onClick={() => onClick(item)}
    >
      <Avatar>
        <AvatarImage src={item.chatWith?.avatar} />
        <AvatarFallback>{item.chatWith?.username?.[0] || 'U'}</AvatarFallback>
        {/* <AvatarBadge className="bg-green-500" /> */}
      </Avatar>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium truncate">{item.chatWith?.username || 'Unknown'}</h4>
        <p className="text-sm text-gray-500 truncate">{item.lastMessage?.content || 'No messages yet'}</p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="text-xs text-gray-400">
          {new Date(item.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
        {item.unreadCount > 0 && (
          <Badge className="bg-orange-500 text-white text-xs">{item.unreadCount}</Badge>
        )}
      </div>
    </div>
  );
}


