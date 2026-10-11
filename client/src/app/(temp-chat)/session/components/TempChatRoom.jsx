"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { sessionSocket } from "@/store/socketStore";
import { AlertCircle, LoaderCircle, Send, WifiOff } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { TempChatHeader } from "./TempChatHeader";
import TempChatMessage from "./TempChatMessage";
import formatMessageTime from "@/lib/formatDate";
import { clearPendingAction } from "@/lib/pendingAction";


export default function TempChatRoom({ sessionCode, user }) {
  const [content, setContent] = useState("");
  const [messages, setMessages] = useState([]);
  const inputRef = useRef(null);
  const messagesRef = useRef(null);
  const sendingRef = useRef(false);
  const focusInputAfterSendRef = useRef(false);
  const [isSending, setIsSending] = useState(false);
  const participantName = user?.displayName;
  const myParticipantId = user?._id?.toString();
  const [joinedNotices, setJoinedNotices] = useState([]);
  const [leaveNotices, setLeaveNotices] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState(() => {
    if (sessionSocket.connected) return "connected";
    return typeof navigator !== "undefined" && !navigator.onLine ? "offline" : "connecting";
  });
  const [endedReason, setEndedReason] = useState("");
  const [now, setNow] = useState(0);
  const expiresAt = useMemo(
    () => new Date(user?.expiresAt).getTime(),
    [user?.expiresAt],
  );
  const isExpired = now > 0 && Number.isFinite(expiresAt) && expiresAt <= now;
  const isEnded = Boolean(endedReason) || isExpired;
  const shouldStickToBottom = useRef(true);

  useEffect(() => {
    if (!isSending && focusInputAfterSendRef.current) {
      focusInputAfterSendRef.current = false;
      inputRef.current?.focus({ preventScroll: true });
    }
  }, [isSending]);

  const handleSessionEnded = useCallback((reason = "closed") => {
    setEndedReason(reason);
    window.setTimeout(clearPendingAction, 500);
  }, []);

  useEffect(() => {
    const updateNow = () => setNow(Date.now());
    const timer = window.setInterval(updateNow, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleConnect = () => setConnectionStatus("connected");
    const handleDisconnect = () => setConnectionStatus(
      navigator.onLine ? "reconnecting" : "offline",
    );
    const handleConnectError = () => setConnectionStatus(
      sessionSocket.active ? "reconnecting" : "failed",
    );
    const handleReconnectAttempt = () => setConnectionStatus("reconnecting");
    const handleReconnectFailed = () => setConnectionStatus("failed");
    const handleOffline = () => setConnectionStatus("offline");
    const handleOnline = () => {
      if (sessionSocket.connected) {
        setConnectionStatus("connected");
      } else {
        setConnectionStatus("reconnecting");
        sessionSocket.connect();
      }
    };
    const handleClosed = () => handleSessionEnded("closed");
    const handleSocketError = (error) => {
      if (/expired/i.test(error?.message || "")) {
        handleSessionEnded("expired");
      }
    };

    sessionSocket.on("connect", handleConnect);
    sessionSocket.on("disconnect", handleDisconnect);
    sessionSocket.on("connect_error", handleConnectError);
    sessionSocket.io.on("reconnect_attempt", handleReconnectAttempt);
    sessionSocket.io.on("reconnect_failed", handleReconnectFailed);
    sessionSocket.on("session:closed", handleClosed);
    sessionSocket.on("session:error", handleSocketError);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    return () => {
      sessionSocket.off("connect", handleConnect);
      sessionSocket.off("disconnect", handleDisconnect);
      sessionSocket.off("connect_error", handleConnectError);
      sessionSocket.io.off("reconnect_attempt", handleReconnectAttempt);
      sessionSocket.io.off("reconnect_failed", handleReconnectFailed);
      sessionSocket.off("session:closed", handleClosed);
      sessionSocket.off("session:error", handleSocketError);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [handleSessionEnded]);



  // SEND NEW MESSAGE
  useEffect(() => {
    const handleNewMessage = (message) => {
      setMessages((current) => [
        ...current,
        {
          ...message,
          displayName: message.participantName,
          isMe: message.participantId?.toString() === myParticipantId,
        },
      ]);
    };

    sessionSocket.on("message:new", handleNewMessage);

    return () => {
      sessionSocket.off("message:new", handleNewMessage);
    };
  }, [myParticipantId]);

  useEffect(() => {
    const container = messagesRef.current;
    if (container && shouldStickToBottom.current) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages.length, joinedNotices.length, leaveNotices.length]);

  useEffect(() => {
    const handleParticipantJoined = (data) => {
      setJoinedNotices((current) => [...current, {
        displayName: data.participant?.displayName || "Guest",
        joinedAt: data.joinedAt,
      }]);
    };
    const handleParticipantLeft = (data) => {
      setLeaveNotices((current) => [...current, {
        displayName: data.participant?.displayName || "Guest",
        leftAt: data.leftAt,
      }]);
    };
    sessionSocket.on("session:participant-joined", handleParticipantJoined);
    sessionSocket.on("session:participant-left", handleParticipantLeft);
    return () => {
      sessionSocket.off("session:participant-joined", handleParticipantJoined);
      sessionSocket.off("session:participant-left", handleParticipantLeft);
    };
  }, []);

  // SEND MESSAGE EVENT
  function handleSend(event) {
    event?.preventDefault();

    const nextContent = (inputRef.current?.value || content).trim();
    if (!nextContent || isEnded || sendingRef.current) return;
    if (!sessionSocket.connected) {
      setConnectionStatus(navigator.onLine ? "reconnecting" : "offline");
      if (navigator.onLine && !sessionSocket.active) sessionSocket.connect();
      toast.error("Not connected. Your message is still here; try again when reconnected.");
      return;
    }

    sendingRef.current = true;
    setIsSending(true);
    setContent("");
    sessionSocket.timeout(8000).emit("message:send", { content: nextContent }, (error, response) => {
      sendingRef.current = false;
      setIsSending(false);
      if (error || !response?.success) {
        setContent((current) => current || nextContent);
        toast.error(response?.message || "Message was not sent. Try again.");
        return;
      }
      focusInputAfterSendRef.current = true;
    });
  }

  return (
    <div className="mx-auto flex h-[calc(100dvh-4rem)] min-h-80 w-full max-w-7xl flex-col px-0 sm:px-4 lg:px-8 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-300 motion-reduce:animate-none">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden border-border/80 bg-card shadow-sm sm:my-4 sm:rounded-2xl sm:border">
        <TempChatHeader
          user={user}
          sessionCode={sessionCode}
          participantName={participantName}
          expiresAt={expiresAt}
          now={now}
          avatar={user?.avatar}
          isEnded={isEnded}
          endedReason={endedReason}
          onSessionEnded={handleSessionEnded}
        />

        {!isEnded && <ConnectionBanner status={connectionStatus} />}
        {isEnded && (
          <div className="flex items-center gap-2 border-b border-warning/25 bg-warning/10 px-4 py-3 text-sm text-foreground" role="status">
            <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
            <span>{isExpired || endedReason === "expired" ? "This temporary session has expired." : "This temporary session has ended."} You can no longer send messages.</span>
          </div>
        )}

        <div
          ref={messagesRef}
          onScroll={(event) => {
            const element = event.currentTarget;
            shouldStickToBottom.current =
              element.scrollHeight - element.scrollTop - element.clientHeight < 100;
          }}
          className="min-h-0 flex-1 overflow-y-auto bg-secondary/30 px-4 py-5 sm:px-6 lg:px-10"
          aria-label="Temporary chat messages"
          aria-live="polite"
        >
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
            {messages.length === 0 && (
              <div className="m-auto max-w-sm rounded-2xl border border-dashed border-border bg-card/80 px-6 py-5 text-center shadow-sm">
                <p className="font-medium">This chat is temporary</p>
                <p className="mt-1 text-sm text-muted-foreground">Messages are only available while this session is active. Say hello to get started.</p>
              </div>
            )}
            {messages.map((message) => (
              <TempChatMessage key={message.id} message={message} />
            ))}
            {[...joinedNotices, ...leaveNotices]
              .sort((left, right) => new Date(left.joinedAt || left.leftAt) - new Date(right.joinedAt || right.leftAt))
              .map((notice, index) => {
                const timestamp = notice.joinedAt || notice.leftAt;
                const action = notice.joinedAt ? "joined" : "left";
                return (
                  <p key={`${timestamp}-${index}`} className="text-center text-xs text-muted-foreground">
                    {notice.displayName} {action} the chat · {formatMessageTime(timestamp, true)}
                  </p>
                );
              })}
          </div>
        </div>

        <form
          onSubmit={handleSend}
          className="shrink-0 border-t border-border bg-card px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-5"
        >
          <div className="mx-auto flex w-full max-w-5xl items-end gap-2 rounded-xl border border-border bg-secondary/45 p-2">
            <Textarea
              ref={inputRef}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Type your message..."
              aria-label="Type a temporary message"
              rows={1}
              enterKeyHint="send"
              maxLength={2000}
              disabled={isEnded || isSending || connectionStatus !== "connected" || !sessionSocket.connected}
              className="max-h-36 min-h-11 flex-1 resize-none overflow-y-auto rounded-lg border-transparent bg-background px-3 py-2.5 text-base shadow-sm focus-visible:border-primary focus-visible:ring-0 md:text-sm"
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                  handleSend(event);
                }
              }}
            />
            <Button
              type="submit"
              size="icon"
              className="size-11 shrink-0 rounded-lg"
              disabled={!content.trim() || isEnded || isSending || connectionStatus !== "connected" || !sessionSocket.connected}
              aria-label="Send message"
            >
              <Send className="size-4" />
            </Button>
          </div>
          <p className="mx-auto mt-2 w-full max-w-5xl text-xs text-muted-foreground">
            Temporary session · messages disappear when it closes or expires
          </p>
        </form>
      </div>
    </div>
  );
}

function ConnectionBanner({ status }) {
  if (status === "connected") return null;

  const message = {
    connecting: "Connecting to this temporary chat…",
    reconnecting: "Connection interrupted. Reconnecting…",
    offline: "You are offline. Messages cannot be sent.",
    failed: "Could not reconnect to this session. Refresh to try again.",
  }[status];
  const Icon = status === "offline" || status === "failed" ? WifiOff : LoaderCircle;

  return (
    <div className="flex items-center gap-2 border-b border-warning/25 bg-warning/10 px-4 py-2 text-sm text-foreground" role="status" aria-live="polite">
      <Icon className={`size-4 shrink-0 ${status === "connecting" || status === "reconnecting" ? "animate-spin" : ""}`} aria-hidden="true" />
      <span>{message}</span>
      {status === "failed" && (
        <Button type="button" variant="outline" size="sm" className="ml-auto h-8" onClick={() => sessionSocket.connect()}>
          Retry
        </Button>
      )}
    </div>
  );
}
