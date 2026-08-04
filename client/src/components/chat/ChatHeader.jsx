import { Avatar, AvatarFallback, AvatarImage, AvatarBadge } from '../ui/avatar';
import { Button } from '../ui/button';
import { ArrowLeft, Info, Phone, Video } from 'lucide-react';
import  { useChatStore } from '@/store/chatStore';

export default function ChatHeader({ selectedChat, isOnline, onBack }) {
  const conversationId = selectedChat?._id?.toString();
  const chatWithId = selectedChat?.chatWith?._id?.toString();
  const typingUserId = useChatStore((state) => state.typingUsers.get(conversationId));

  const isTyping = typingUserId && typingUserId === chatWithId;


  return (
    <header className="border-b border-border/70 bg-background/90 px-3 py-3 shadow-sm backdrop-blur-xl sm:px-4">
      <div className="flex w-full items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Button variant="ghost" size="icon" className="rounded-xl md:hidden" onClick={onBack} aria-label="Back to conversations">
            <ArrowLeft className="size-5" />
          </Button>
          <Avatar className="size-10">
            <AvatarImage src={selectedChat?.chatWith?.avatar} />
            <AvatarFallback>{selectedChat?.chatWith?.username?.[0] || 'U'}</AvatarFallback>
            <AvatarBadge className={isOnline ? 'bg-(--online)' : 'bg-muted-foreground'} />
          </Avatar>
          <div className="min-w-0">
            <h2 className="truncate font-semibold">@{selectedChat?.chatWith?.username || 'Unknown'}</h2>
            <p className="text-sm text-muted-foreground">{isTyping ? 'Typing...' : isOnline ? 'Online' : 'Offline'}</p>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button variant="ghost" size="icon" className="hidden rounded-xl sm:inline-flex" aria-label="Start voice call">
            <Phone className="size-[18px]" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden rounded-xl sm:inline-flex" aria-label="Start video call">
            <Video className="size-[18px]" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-xl" aria-label="Conversation info">
            <Info className="size-[18px]" />
          </Button>
        </div>
      </div>
    </header>
  );
}
