"use client"
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { Search, MessageSquareText } from 'lucide-react';
import ChatItem from "./ChatItem";
import { cn } from "@/lib/utils";
import { AnimatedShinyText } from "../ui/animated-shiny-text";

export default function ChatList({ conversations, selectedChat, onSelectChat, user, unreadCount = 0, className }) {
  const tabs = ['All', 'Unread'];

  return (
    <aside className={cn("flex w-full min-w-0 flex-col border-r border-border/70 bg-background/90 shadow-sm backdrop-blur-xl md:w-[400px] md:max-w-[400px]", className)}>
      <div className="border-b border-border/70 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground font-semibold">Welcome, <AnimatedShinyText> @{user?.username || 'there'} </AnimatedShinyText></p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">Messages</h1>
          </div>
          {unreadCount > 0 && (
            <Badge className="rounded-full bg-blue-600 text-white">{unreadCount} unread</Badge>
          )}
        </div>
      </div>
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search conversations..." className="h-11 rounded-2xl bg-secondary/55 pl-10" />
        </div>
      </div>
      <div className="mx-4 mb-3 grid grid-cols-2 rounded-2xl bg-secondary/70 p-1">
        {tabs.map((tab) => (
          <Button
            key={tab}
            variant="ghost"
            className="h-9 rounded-xl text-sm text-muted-foreground first:bg-background first:text-foreground first:shadow-sm cursor-pointer"
          >
            {tab}
          </Button>
        ))}
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-1 px-3 pb-4">
          {conversations.length > 0 ? conversations.map((item) => (
            <ChatItem
              key={item._id}
              item={item}
              isActive={item._id === selectedChat?._id}
              onClick={onSelectChat}
            />
          )) : (
            <div className="mt-10 rounded-2xl border border-dashed border-border p-6 text-center">
              <MessageSquareText className="mx-auto size-8 text-muted-foreground" />
              <h2 className="mt-4 font-semibold">No conversations yet</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Generate an invite link to start your first conversation.</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}
