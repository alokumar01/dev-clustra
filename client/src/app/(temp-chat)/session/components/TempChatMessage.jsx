

import formatMessageTime from '@/lib/formatDate';
import React from 'react'
import { cn } from "@/lib/utils"
import { Bubble, BubbleContent } from '@/components/ui/bubble';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';


export default function TempChatMessage({ message }) {
    const isMe = message.isMe;
    const time = formatMessageTime(message.createdAt, true);

    return (
        <div className={cn("flex w-full items-end gap-2", isMe ? "justify-end" : "justify-start")}>
            {!isMe ? (
                <Avatar className="mb-5 size-8">
                    <AvatarFallback className="text-xs">
                        {getInitial(message.displayName)}
                    </AvatarFallback>
                </Avatar>
            ) : null}

            <div className={cn("flex min-w-0 max-w-[86%] flex-col sm:max-w-[72%]", isMe ? "items-end" : "items-start")}>
                {!isMe ? (
                    <span className="mb-1 px-1 text-xs font-medium text-muted-foreground">
                        {message.displayName}
                    </span>
                ) : null}
                <Bubble align={isMe ? "end" : "start"} variant={isMe ? "default" : "outline"} className="max-w-full">
                    <BubbleContent
                        className={cn(
                            "max-w-full rounded-2xl px-3.5 py-2.5 text-[0.95rem] leading-6 shadow-sm",
                            isMe
                                ? "rounded-br-md border-primary bg-primary text-primary-foreground"
                                : "rounded-bl-md border-border bg-card text-card-foreground"
                        )}
                    >
                        <p className="whitespace-pre-wrap wrap-break-word">{message.content}</p>
                    </BubbleContent>
                </Bubble>
                <span className="mt-1 px-1 text-[11px] text-muted-foreground">
                    {time}
                </span>
            </div>
        </div>
    )




}

function getInitial(name) {
    return name?.trim()?.[0]?.toUpperCase() || "G";
}
