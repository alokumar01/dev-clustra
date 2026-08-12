import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Smile, Paperclip, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { socket } from '@/store/socketStore';


export default function ChatInput({ content, setContent, onSend, conversationId }) {
  const canSend = content.trim().length > 0;
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

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

    onSend();
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
    <div className="border-t border-border/70 bg-background/90 px-3 py-3 shadow-sm backdrop-blur-xl sm:px-4">
      <div className="flex w-full items-center gap-2 rounded-2xl border border-border bg-secondary/35 p-2">
        {/* <Button variant="ghost" size="icon" className="hidden rounded-xl sm:inline-flex" aria-label="Emoji">
          <Smile className="size-[18px]" />
        </Button> */}
        <Input
          value={content}
          onChange={handleChange}
          placeholder="Type a message..."
          className="h-11 flex-1 border-transparent bg-background shadow-sm focus-visible:border-ring"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        {/* <Button variant="ghost" size="icon" className="hidden rounded-xl sm:inline-flex" aria-label="Attach file">
          <Paperclip className="size-[18px]" />
        </Button> */}
        <Button
          onClick={handleSend}
          disabled={!canSend}
          className="rounded-xl bg-blue-600 text-white hover:bg-blue-700"
          size="icon"
          aria-label="Send message"
        >
          <Send className="size-4.5" />
        </Button>
      </div>
    </div>
  );
}



// User

// H

// ↓

// typing:start

// ↓

// Timer starts

// ↓

// e

// ↓

// Cancel timer

// ↓

// New timer

// ↓

// l

// ↓

// Cancel timer

// ↓

// New timer

// ↓

// Stops typing

// ↓

// 2 sec

// ↓

// typing:stop
