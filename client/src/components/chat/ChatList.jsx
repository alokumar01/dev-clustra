"use client"
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { AlertCircle, MessageSquareText, Search, X } from 'lucide-react';
import ChatItem from "./ChatItem";
import { cn } from "@/lib/utils";
import { AnimatedShinyText } from "../ui/animated-shiny-text";
import { useEffect, useRef, useState } from "react";
import { searchUser } from "@/app/services/auth.service";
import { useChatStore } from "@/store/chatStore";
import { useDebounce } from "@/lib/useDebounce";
import SearchConversation from "./SearchConversation";
import { logger } from "@/lib/logger";
import { Skeleton } from "../ui/skeleton";

export default function ChatList({ conversations, selectedChat, onSelectChat, user, unreadCount = 0, isLoading = false, loadError = "", onRetry, className }) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const searchRunRef = useRef(0);
  const setSearchResults = useChatStore((state) => state.setSearchResults);
  const onlineUsers = useChatStore((state) => state.onlineUsers);
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const filteredConversations = normalizedQuery
    ? conversations.filter((conversation) => {
        const name = conversation.chatWith?.username || "";
        const message = conversation.lastMessage?.content || "";
        return `${name} ${message}`.toLocaleLowerCase().includes(normalizedQuery);
      })
    : conversations;

  // IMPLEMENT DEBOUNCE FOR SEARCH USER IN CONVERSATION
  const debouncedSearch = useDebounce(query);

  useEffect(() => {
    const searchTerm = debouncedSearch.trim();
    if (searchTerm.length < 3) {
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

        const users = await searchUser(searchTerm);
        if (!ignore && searchRunId === searchRunRef.current) {
          setSearchResults(users?.data || []);
        }

      } catch (error) {
        logger.warn("chat.user_search.failed", {
          area: "chat",
          operation: "user_search",
          status: error.response?.status,
          code: error.code,
        });
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
    <aside className={cn("flex h-full w-full min-h-0 min-w-0 flex-col border-r border-border/70 bg-background/90 shadow-sm backdrop-blur-xl md:w-80 md:shrink-0 xl:w-90", className)}>
      <div className="shrink-0 border-b border-border/70 p-4">
        <div className="flex min-w-0 items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-muted-foreground">Welcome, <AnimatedShinyText>@{user?.username || 'there'}</AnimatedShinyText></p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">Messages</h1>
          </div>
          {unreadCount > 0 && (
            <Badge className="rounded-full bg-blue-600 text-white">{unreadCount} unread</Badge>
          )}
        </div>
      </div>
      <div className="shrink-0 p-3 sm:p-4">
        <label htmlFor="conversation-search" className="sr-only">Search conversations or people</label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            id="conversation-search"
            type="search"
            placeholder="Search conversations or people"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-11 rounded-xl bg-secondary/55 pl-10 pr-10"
          />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full text-muted-foreground"
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
      </div>
      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-3 px-3 pb-4">
          {query.trim().length > 0 && query.trim().length < 3 && (
            <p className="px-3 py-2 text-xs text-muted-foreground">
              Type at least 3 characters to search for people.
            </p>
          )}
          {query.trim().length >= 3 && (
            <SearchConversation
              query={query}
              isLoading={isSearching}
              error={searchError}
            />
          )}

          <section aria-label="Conversations">
            <h2 className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {normalizedQuery ? `Conversations (${filteredConversations.length})` : "Conversations"}
            </h2>

            {isLoading ? (
              <div className="space-y-1" aria-label="Loading conversations" role="status">
                {[0, 1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex min-h-19 items-center gap-3 rounded-2xl p-3">
                    <Skeleton className="size-11 shrink-0 rounded-full" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <Skeleton className="h-3 w-2/3" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  </div>
                ))}
                <span className="sr-only">Loading conversations</span>
              </div>
            ) : loadError ? (
              <div className="m-2 rounded-2xl border border-destructive/20 bg-destructive/5 p-4">
                <AlertCircle className="size-5 text-destructive" aria-hidden="true" />
                <h3 className="mt-2 text-sm font-semibold">Couldn’t load conversations</h3>
                <p className="mt-1 text-sm leading-5 text-muted-foreground">{loadError}</p>
                <Button type="button" variant="outline" size="sm" className="mt-3" onClick={onRetry}>
                  Try again
                </Button>
              </div>
            ) : conversations.length === 0 ? (
              <div className="m-2 rounded-2xl border border-dashed border-border p-5 text-center">
                <MessageSquareText className="mx-auto size-7 text-muted-foreground" aria-hidden="true" />
                <h3 className="mt-3 text-sm font-semibold">No conversations yet</h3>
                <p className="mt-1 text-sm leading-5 text-muted-foreground">
                  Search for someone above or invite a teammate to start a chat.
                </p>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="m-2 rounded-2xl border border-dashed border-border p-5 text-center">
                <h3 className="text-sm font-semibold">No matching conversations</h3>
                <p className="mt-1 text-sm leading-5 text-muted-foreground">Try another name or message.</p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredConversations.map((item) => (
                  <ChatItem
                    key={item._id}
                    item={item}
                    isActive={item._id === selectedChat?._id}
                    isOnline={onlineUsers.has(item.chatWith?._id?.toString())}
                    onClick={onSelectChat}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </ScrollArea>
    </aside>
  );
}
