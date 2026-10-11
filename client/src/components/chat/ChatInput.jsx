import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { socket } from '@/store/socketStore';


export default function ChatInput({ content, setContent, onSend, conversationId }) {
  const canSend = content.trim().length > 0;
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const inputRef = useRef(null);

  // Handle typing indicator
  const handleChange = (e) => {
    const value = e.target.value;
    setContent(value);

    // user clear the input box, then stop typing
    if (!value.trim()) {
      clearTimeout(typingTimeoutRef.current);

      if (isTyping && conversationId) {
        socket.emit('typing:stop', conversationId);
        setIsTyping(false);
      }
      return;
    }

    // first char typed, then start typing
    if (!isTyping && conversationId) {
      socket.emit('typing:start', conversationId);
      setIsTyping(true);
    }

    clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      if (conversationId) {
        socket.emit('typing:stop', conversationId);
      }
      setIsTyping(false);
    }, 2000); // 2 seconds of inactivity
  };

  const handleSend = () => {
    if (!canSend) return;

    clearTimeout(typingTimeoutRef.current);

    if (isTyping && conversationId) {
      clearTimeout(typingTimeoutRef.current);

      socket.emit('typing:stop', conversationId);
      setIsTyping(false);
    }

    onSend(content);
    inputRef.current?.focus({ preventScroll: true });
  }

  useEffect(() => {
    return () => {
      clearTimeout(typingTimeoutRef.current);

      if (isTyping && conversationId) {
        socket.emit('typing:stop', conversationId);
      }
    }
  }, [isTyping, conversationId]);



  return (
    <div className="shrink-0 border-t border-border/70 bg-background/90 px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-sm backdrop-blur-xl sm:px-4">
      <div className="flex w-full items-end gap-2 rounded-2xl border border-border bg-secondary/35 p-2">
        <Textarea
          ref={inputRef}
          value={content}
          onChange={handleChange}
          placeholder="Type a message..."
          aria-label="Type a message..."
          rows={1}
          enterKeyHint="send"
          className="max-h-36 min-h-11 flex-1 resize-none overflow-y-auto border-transparent bg-background px-3 py-2.5 text-base shadow-sm focus-visible:border-ring focus-visible:ring-0 md:text-sm"
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
              event.preventDefault();
              void handleSend();
            }
          }}
        />
        <Button
          type="button"
          onClick={() => void handleSend()}
          disabled={!canSend}
          className="size-11 shrink-0 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
          size="icon"
          aria-label="Send message"
          title="Send message"
        >
          <Send className="size-4.5" />
        </Button>
      </div>
    </div>
  );
}
