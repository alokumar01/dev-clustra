// src/components/chat/ChatHeader.jsx
import { Avatar, AvatarFallback, AvatarImage, AvatarBadge } from '../ui/avatar';
import { Button } from '../ui/button';
import { Phone, Video, Info } from 'lucide-react';

export default function ChatHeader({ selectedChat, isOnline }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white border-b shadow-sm">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={selectedChat?.chatWith?.avatar} />
          <AvatarFallback>{selectedChat?.chatWith?.username?.[0] || 'U'}</AvatarFallback>
          <AvatarBadge className={isOnline ? 'bg-green-500' : 'bg-gray-400'} />
        </Avatar>
        <div>
          <h2 className="font-semibold">{selectedChat?.chatWith?.username || 'Unknown'}</h2>
          <p className="text-sm text-gray-500">{isOnline ? 'Online' : 'Offline'}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" size="icon">
          <Phone size={18} />
        </Button>
        <Button variant="ghost" size="icon">
          <Video size={18} />
        </Button>
        <Button variant="ghost" size="icon">
          <Info size={18} />
        </Button>
      </div>
    </div>
  );
}
