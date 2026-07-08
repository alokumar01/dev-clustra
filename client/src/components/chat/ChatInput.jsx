// src/components/chat/ChatInput.jsx
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Smile, Paperclip, Send } from 'lucide-react';

export default function ChatInput({ content, setContent, onSend }) {
  return (
    <div className="p-4 bg-white border-t shadow-sm">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon">
          <Smile size={18} />
        </Button>
        <Input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message..."
          className="flex-1"
          onKeyPress={(e) => e.key === 'Enter' && onSend()}
        />
        <Button variant="ghost" size="icon">
          <Paperclip size={18} />
        </Button>
        <Button
          onClick={onSend}
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-full p-2"
          size="icon"
        >
          <Send size={18} />
        </Button>
      </div>
    </div>
  );
}

