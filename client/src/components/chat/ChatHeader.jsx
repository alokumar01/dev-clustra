import { Avatar, AvatarFallback, AvatarImage, AvatarBadge } from '../ui/avatar';
import { Button } from '../ui/button';
import { AlertCircle, ArrowLeft, CircleCheck, LoaderCircle, WifiOff } from 'lucide-react';
import  { useChatStore } from '@/store/chatStore';
import { socket, useSocketStore } from '@/store/socketStore';

export default function ChatHeader({ selectedChat, isOnline, onBack }) {
  const connectionStatus = useSocketStore((state) => state.connectionStatus);
  const conversationId = selectedChat?._id?.toString();
  const chatWithId = selectedChat?.chatWith?._id?.toString();
  const typingUserId = useChatStore((state) => state.typingUsers.get(conversationId));

  const isTyping = typingUserId && typingUserId === chatWithId;


  return (
    <header className="flex h-16 shrink-0 items-center border-b border-border/70 bg-background/90 px-3 shadow-sm backdrop-blur-xl sm:px-4">
      <div className="flex w-full items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Button variant="ghost" size="icon" className="rounded-xl md:hidden" onClick={onBack} aria-label="Back to conversations">
            <ArrowLeft className="size-5" />
          </Button>
          <Avatar className="size-10">
            <AvatarImage src={selectedChat?.chatWith?.avatar} alt={`${selectedChat?.chatWith?.username || 'Contact'} avatar`} />
            <AvatarFallback>{getInitials(selectedChat?.chatWith?.username)}</AvatarFallback>
            <AvatarBadge className={isOnline ? 'bg-(--online)' : 'bg-muted-foreground/60'} />
          </Avatar>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold sm:text-base">{selectedChat?.chatWith?.username || 'Unknown user'}</h2>
            <p className="truncate text-xs text-muted-foreground" aria-live="polite">
              {isTyping ? 'Typing…' : isOnline ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
        <ConnectionIndicator status={connectionStatus} />
      </div>
    </header>
  );
}

function ConnectionIndicator({ status }) {
  const details = {
    connecting: {
      label: "Connecting…",
      className: "text-muted-foreground",
      Icon: LoaderCircle,
      iconClassName: "animate-spin",
    },
    connected: {
      label: "Connected",
      className: "text-emerald-600 dark:text-emerald-400",
      Icon: CircleCheck,
    },
    reconnecting: {
      label: "Reconnecting…",
      className: "text-amber-600 dark:text-amber-400",
      Icon: LoaderCircle,
      iconClassName: "animate-spin",
    },
    offline: {
      label: "Offline",
      className: "text-muted-foreground",
      Icon: WifiOff,
    },
    failed: {
      label: "Connection failed",
      className: "text-destructive",
      Icon: AlertCircle,
    },
  }[status] || {
    label: "Offline",
    className: "text-muted-foreground",
    Icon: WifiOff,
  };
  const { Icon } = details;

  return (
    <div className="flex shrink-0 items-center gap-2">
      <span
        role="status"
        aria-live="polite"
        aria-label={`Realtime connection ${details.label}`}
        title={`Realtime connection: ${details.label}`}
        className={`flex items-center gap-1.5 text-xs ${details.className}`}
      >
        <Icon className={`size-4 ${details.iconClassName || ""}`} aria-hidden="true" />
        <span className="hidden sm:inline">{details.label}</span>
      </span>
      {status === "failed" && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 px-2 text-xs"
          onClick={() => {
            useSocketStore.getState().setConnectionStatus("connecting");
            socket.connect();
          }}
        >
          Retry
        </Button>
      )}
    </div>
  );
}

function getInitials(name = '') {
  return name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'U';
}
