"use client"
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Search } from 'lucide-react';
import ChatItem from "./ChatItem";

export default function ChatList({ conversations, selectedChat, onSelectChat }) {
  const tabs = ['All', 'Unread'];

  return (
    <div className="w-full md:w-[320px] bg-white shadow-sm flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <h1 className="text-xl font-semibold">Messages</h1>
      </div>
      {/* Search */}
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input placeholder="Search conversations..." className="pl-10" />
        </div>
      </div>
      {/* Tabs */}
      <div className="flex gap-0 px-3">
        {tabs.map((tab) => (
          <Button
            key={tab}
            variant="ghost"
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500"
          >
            {tab}
          </Button>
        ))}
      </div>
      {/* Conversations */}
      <ScrollArea className="flex-1">
        {conversations.map((item) => (
          <ChatItem
            key={item._id}
            item={item}
            isActive={item._id === selectedChat?._id}
            onClick={onSelectChat}
          />
        ))}
      </ScrollArea>
    </div>
  );
}