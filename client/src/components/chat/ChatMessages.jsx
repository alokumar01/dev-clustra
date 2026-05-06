// src/components/chat/ChatMessages.jsx
import { useEffect, useRef } from 'react';
import ChatBubble from '../MessageBubble/ChatBubble';

export default function ChatMessages({ messages, selectedChat }) {
  const containerRef = useRef(null);
  const isUserScrolledUp = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
      isUserScrolledUp.current = distanceFromBottom > 120;
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (isUserScrolledUp.current) return;

    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
  }, [messages.length, selectedChat?._id]);

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50">
      <div className="space-y-4">
        {messages.map((message) => (
          <ChatBubble key={message._id} message={message} selectedChat={selectedChat} />
        ))}
      </div>
    </div>
  );
}