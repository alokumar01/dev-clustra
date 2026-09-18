"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sessionSocket } from "@/store/socketStore";
import { Send } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { TempChatHeader } from "./TempChatHeader";
import TempChatMessage from "./TempChatMessage";
import formatMessageTime from "@/lib/formatDate";


export default function TempChatRoom({ sessionCode, user }) {
  console.log("FULL USER DETAILS IN TEMP CHAT ROOM: ", user);
  const [content, setContent] = useState("");
  const [messages, setMessages] = useState([]);
  const inputRef = useRef(null);
  const participantName = user?.displayName;
  const myParticipantId = user?._id?.toString();
  const expiresAt = useMemo(
    () => formatExpiry(user?.expiresAt),
    [user?.expiresAt],
  );
  const [joinedNotices, setJoinedNotices] = useState([]);
  const [leaveNotices, setLeaveNotices] = useState([]);


  // PARTICIPANT JOINED THE SESSION
  useEffect(() => {
    const handleParticipantJoined = ({ participant, joinedAt }) => {
      setJoinedNotices((current) => [...current, {
        displayName: participant?.displayName || "Guest",
        joinedAt,
      }]);
    };

    sessionSocket.on("session:participant-joined", handleParticipantJoined);

    return () => {
      sessionSocket.off("session:participant-joined", handleParticipantJoined);
    }
  }, [])

  // PARTICIAPNT LEFT SESSION,  SERVER -> CLIENT LISTEN
  useEffect(() => {
    const handleParticipantLeft = ({ participant, leftAt }) => {
      setLeaveNotices((current) => [...current, {
        displayName: participant?.displayName || "Guest",
        leftAt,
      }]);
    };

    sessionSocket.on("session:participant-left", handleParticipantLeft);

    return () => {
      sessionSocket.off("session:participant-left", handleParticipantLeft);
    };
  }, []);


  // SEND NEW MESSAGE
  useEffect(() => {
    const handleNewMessage = (message) => {
      setMessages((current) => [
        ...current,
        {
          ...message,
          displayName: message.participantName,
          isMe: message.participantId === myParticipantId,
        },
      ]);
    };

    sessionSocket.on("message:new", handleNewMessage);

    return () => {
      sessionSocket.off("message:new", handleNewMessage);
    };
  }, [myParticipantId]);

  // SEND MESSAGE EVENT
  function handleSend(event) {
    event?.preventDefault();

    const nextContent = content.trim();
    if (!nextContent) return;

    sessionSocket.emit(
      "message:send",
      {
        content: nextContent,
      },
      (response) => {
        // console.log("[MESSAGE SEND] ACK FROM SERVER :", response);
      },
    );
    setContent("");
    inputRef.current?.focus();
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl flex-col px-0 sm:px-4 lg:px-8">
      <div className="flex flex-1 flex-col overflow-hidden border-zinc-200 bg-white shadow-sm sm:my-4 sm:rounded-lg sm:border dark:border-white/10 dark:bg-zinc-950">
        <TempChatHeader
          user={user}
          sessionCode={sessionCode}
          participantName={participantName}
          expiresAt={expiresAt}
          avatar={user?.avatar}
        />

        {/* SESSION LEAVE INFORM */}
        {leaveNotices.map((notice, index) => (
          <div
            key={`${notice.leftAt}-${index}`}
            className="flex justify-center py-2"
          >
            <span className="text-xs text-zinc-400">
              {notice.displayName} left the chat ·{" "}
              { formatMessageTime(notice.leftAt, true) }
            </span>
          </div>
        ))}

        {/* SESSION JOINED INFORM */}
        {joinedNotices.map((notice, index) => (
          <div
            key={`${notice.joinedAt} - ${index}`}
            className="flex justify-center py-2"
          >
            <span>
              {notice.displayName} joined the chat ·{" "}
              { formatMessageTime(notice.joinedAt, true) }
            </span>
          </div>
        ))}

        <div className="flex-1 overflow-y-auto bg-[#f8fafd] px-4 py-5 sm:px-6 lg:px-10 dark:bg-[#09090b]">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
            {/* <ScrollBar>

            </ScrollBar> */}
            {messages.map((message) => (
              <TempChatMessage key={message.id} message={message} />
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSend}
          className="border-t border-zinc-200 bg-white px-3 py-3 sm:px-5 dark:border-white/10 dark:bg-zinc-950"
        >
          <div className="mx-auto flex w-full max-w-5xl items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-2 dark:border-white/10 dark:bg-zinc-900">
            <Input
              ref={inputRef}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Type your message..."
              className="h-11 flex-1 rounded-md border-transparent bg-white shadow-sm focus-visible:border-blue-500 dark:bg-zinc-950"
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  handleSend(event);
                }
              }}
            />
            <Button
              type="submit"
              size="icon"
              className="size-11 rounded-md bg-blue-600 text-white hover:bg-blue-700 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
              disabled={!content.trim()}
              aria-label="Send message"
            >
              <Send className="size-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function formatExpiry(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return `Session Auto Ends at ${date.toLocaleTimeString([], {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })}`;
}
