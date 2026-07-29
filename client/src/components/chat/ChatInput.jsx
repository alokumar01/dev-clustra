import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Smile, Paperclip, Send } from 'lucide-react';

export default function ChatInput({ content, setContent, onSend }) {
  const canSend = content.trim().length > 0;

  return (
    <div className="border-t border-border/70 bg-background/90 px-3 py-3 shadow-sm backdrop-blur-xl sm:px-4">
      <div className="flex w-full items-center gap-2 rounded-2xl border border-border bg-secondary/35 p-2">
        <Button variant="ghost" size="icon" className="hidden rounded-xl sm:inline-flex" aria-label="Emoji">
          <Smile className="size-[18px]" />
        </Button>
        <Input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message..."
          className="h-11 flex-1 border-transparent bg-background shadow-sm focus-visible:border-ring"
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && onSend()}
        />
        <Button variant="ghost" size="icon" className="hidden rounded-xl sm:inline-flex" aria-label="Attach file">
          <Paperclip className="size-[18px]" />
        </Button>
        <Button
          onClick={onSend}
          disabled={!canSend}
          className="rounded-xl bg-blue-600 text-white hover:bg-blue-700"
          size="icon"
          aria-label="Send message"
        >
          <Send className="size-[18px]" />
        </Button>
      </div>
    </div>
  );
}
