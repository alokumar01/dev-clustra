"use client"
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { Search, MessageSquareText, X } from 'lucide-react';
import ChatItem from "./ChatItem";
import { cn } from "@/lib/utils";
import { AnimatedShinyText } from "../ui/animated-shiny-text";
import { useEffect, useRef, useState } from "react";
import { searchUser } from "@/app/services/auth.service";
import { useChatStore } from "@/store/chatStore";
import { useDebounce } from "@/lib/useDebounce";
import SearchConversation from "./SearchConversation";

export default function ChatList({ conversations, selectedChat, onSelectChat, user, unreadCount = 0, className }) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const searchRunRef = useRef(0);
  const { setSearchResults } = useChatStore();

  // IMPLEMENT DEBOUNCE FOR SEARCH USER IN CONVERSATION
  const debouncedSearch = useDebounce(query);

  useEffect(() => {
    if (!debouncedSearch.trim()) {
      searchRunRef.current += 1;
      setSearchResults([]);
      setIsSearching(false);
      setSearchError("");
      return;
    }

    let ignore = false;
    const searchRunId = searchRunRef.current + 1;
    searchRunRef.current = searchRunId;

    const fetchUser = async () => {
      try {
        setIsSearching(true);
        setSearchError("");

        const users = await searchUser(debouncedSearch);
        if (!ignore && searchRunId === searchRunRef.current) {
          setSearchResults(users?.data || []);
        }

      } catch (error) {
        console.error(error);
        if (!ignore && searchRunId === searchRunRef.current) {
          setSearchResults([]);
          setSearchError("Could not load search results. Please try again.");
        }
      } finally {
        if (!ignore && searchRunId === searchRunRef.current) {
          setIsSearching(false);
        }
      }
    };

    fetchUser();

    return () => {
      ignore = true;
    };
  }, [debouncedSearch, setSearchResults]);

  return (
    <aside className={cn("flex w-full min-w-0 flex-col border-r border-border/70 bg-background/90 shadow-sm backdrop-blur-xl md:w-100 md:max-w-[400px]", className)}>
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
        {/*  SEARCH USER IN CONVERSATION */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search conversations..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-11 rounded-2xl bg-secondary/55 pl-10 pr-10"
          />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="absolute right-2 top-1/2 cursor-pointer -translate-y-1/2 rounded-full text-muted-foreground hover:bg-background/80 hover:text-foreground"
              onClick={() => {
                searchRunRef.current += 1;
                setQuery("");
                setSearchResults([]);
                setSearchError("");
                setIsSearching(false);
              }}
              aria-label="Clear search"
              title="Clear search"
            >
              <X className="size-4" />
            </Button>
          )}
        </div>
        <SearchConversation
          query={query}
          isLoading={isSearching}
          error={searchError}
          onSelectUser={(searchedUser) => {
            console.log("selected searched user:", searchedUser);
          }}
        />
      </div>
      <span className="p-2"> <hr /> </span>
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
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Generate an invite link and share with someone u want to start your conversation.</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}
