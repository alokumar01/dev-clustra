

import formatMessageTime from '@/lib/formatDate';
import React from 'react'
import { cn } from "@/lib/utils"
import { Bubble, BubbleContent } from '@/components/ui/bubble';
import { Avatar } from '@/components/ui/avatar';


export default function TempChatMessage({ message }) {
    console.log("Message in temp chat message: ", message);
    const isMe = message.isMe;
    const time = formatMessageTime(message.createdAt, true);

    return (
        <div className={cn("flex w-full items-end gap-2", isMe ? "justify-end" : "justify-start")}>
            {!isMe ? (
                <Avatar className="mb-5 size-8">
                    {/* <AvatarFallback className="bg-white text-xs text-zinc-700 ring-1 ring-zinc-200 dark:bg-zinc-900 dark:text-zinc-200 dark:ring-white/10">
                        {getInitial(message.displayName)}
                    </AvatarFallback> */}
                </Avatar>
            ) : null}

            <div className={cn("flex min-w-0 max-w-[86%] flex-col sm:max-w-[72%]", isMe ? "items-end" : "items-start")}>
                {!isMe ? (
                    <span className="mb-1 px-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        {message.displayName}
                    </span>
                ) : null}
                <Bubble align={isMe ? "end" : "start"} variant={isMe ? "default" : "outline"} className="max-w-full">
                    <BubbleContent
                        className={cn(
                            "max-w-full rounded-2xl px-3.5 py-2.5 text-[0.95rem] leading-6 shadow-sm",
                            isMe
                                ? "rounded-br-md border-blue-600 bg-blue-600 text-white dark:border-white dark:bg-white dark:text-zinc-950"
                                : "rounded-bl-md border-zinc-200 bg-white text-zinc-950 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100"
                        )}
                    >
                        <p className="whitespace-pre-wrap wrap-break-word">{message.content}</p>
                    </BubbleContent>
                </Bubble>
                <span className="mt-1 px-1 text-[11px] text-zinc-500 dark:text-zinc-500">
                    {time}
                </span>
            </div>
        </div>
    )




}
