
import { AlertCircle, MessageCircle, Search, UserRoundSearch } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Spinner } from '../ui/spinner';

const normalizeResults = (results) => {
  if (Array.isArray(results)) return results;
  if (Array.isArray(results?.data)) return results.data;
  return [];
};

const getInitials = (name = '') => {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return 'U';

  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
};

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const HighlightedText = ({ text = '', query = '' }) => {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) return text;

  const parts = text.split(new RegExp(`(${escapeRegExp(trimmedQuery)})`, 'ig'));

  return parts.map((part, index) => {
    const isMatch = part.toLowerCase() === trimmedQuery.toLowerCase();

    return isMatch ? (
      <mark key={`${part}-${index}`} className="rounded bg-primary/15 px-0.5 text-foreground">
        {part}
      </mark>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    );
  });
};

const SearchConversation = ({
  query = '',
  isLoading = false,
  error = '',
  onSelectUser,
}) => {
  const searchResults = useChatStore((state) => state.searchResults);
  const isUserOnline = useChatStore((state) => state.isUserOnline);
  const results = normalizeResults(searchResults);
  const trimmedQuery = query.trim();

  if (!trimmedQuery) return null;

  if (isLoading) {
    return (
      <section className="mt-3 overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
        <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Searching people</p>
          <Spinner className="size-4 text-primary" />
        </div>
        <div className="space-y-1 p-2">
          {[0, 1, 2].map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-xl p-3">
              <div className="size-11 shrink-0 rounded-full bg-muted" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-3 w-28 rounded-full bg-muted" />
                <div className="h-2.5 w-40 rounded-full bg-muted/80" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mt-3 rounded-2xl border border-destructive/25 bg-destructive/5 p-4">
        <div className="flex gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertCircle className="size-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-destructive">Search failed</h2>
            <p className="mt-1 text-sm leading-5 text-muted-foreground">
              {error || 'Something went wrong while finding users.'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (!results.length) {
    return (
      <section className="mt-3 rounded-2xl border border-dashed border-border bg-background/80 p-6 text-center">
        <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-secondary text-muted-foreground">
          <UserRoundSearch className="size-5" />
        </div>
        <h2 className="mt-4 text-sm font-semibold">No users found</h2>
        <p className="mx-auto mt-1 max-w-62.5 text-sm leading-5 text-muted-foreground">
          No one matches &quot;{trimmedQuery}&quot;. Check the spelling or try another username.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-3 overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-border/70 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <p className="truncate text-xs font-semibold uppercase text-muted-foreground">
            Results for &quot;{trimmedQuery}&quot;
          </p>
        </div>
        <Badge variant="outline" className="h-6 rounded-full px-2 text-xs">
          {results.length}
        </Badge>
      </div>

      <div className="max-h-85 overflow-y-auto p-2">
        {results.map((user) => {
          const username = user?.username || 'Unknown user';
          const userId = user?._id || username;
          const online = user?._id ? isUserOnline(user._id) : false;

          return (
            <Button
              key={userId}
              type="button"
              variant="ghost"
              className=" cursor-pointer h-auto w-full justify-start rounded-xl p-3 text-left hover:bg-secondary/75 focus-visible:ring-2 focus-visible:ring-primary/45"
              onClick={() => onSelectUser?.(user)}
              aria-label={`Select ${username}`}
            >
              <Avatar className="size-12">
                <AvatarImage src={user?.avatar} alt={username} />
                <AvatarFallback>{getInitials(username)}</AvatarFallback>
                {online && <AvatarBadge className="bg-(--online)" />}
              </Avatar>

              <span className="min-w-0 flex-1">
                <span className="flex min-w-0 items-center gap-2">
                  <span className="truncate text-sm font-semibold text-foreground">
                    <HighlightedText text={username} query={trimmedQuery} />
                  </span>
                  {online && (
                    <span className="shrink-0 rounded-full bg-[var(--online)]/10 px-2 py-0.5 text-[11px] font-medium text-[var(--online)]">
                      Online
                    </span>
                  )}
                </span>
                <span className="mt-1 block truncate text-sm font-normal text-muted-foreground">
                  {user?.bio || 'Tap to start a conversation'}
                </span>
              </span>

              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MessageCircle className="size-4" />
              </span>
            </Button>
          );
        })}
      </div>
    </section>
  );
};

export default SearchConversation;
