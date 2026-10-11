'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import Sidebar from '@/components/chat/Sidebar'
import ChatList from '@/components/chat/ChatList'
import ChatScreen from '@/components/chat/ChatScreen'
import { fetchAllConversations } from '@/app/services/conversation.service';
import { useChatStore } from '@/store/chatStore';
import ProfileView from '@/components/profile/ProfileView'
import { useAuthStore } from '@/store/authStore'
import InviteView from '@/components/invite/Invite'
import { useSearchParams, useRouter} from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Boxes, CircleUserRoundIcon, MessageSquare, Moon, PhoneCallIcon, Settings2, Sparkles, Sun, UserRoundPlusIcon, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { logger } from '@/lib/logger'

const mobileNavItems = [
    { id: 'messages', icon: MessageSquare, label: 'Chats' },
    { id: 'groups', icon: Users, label: 'Groups' },
    { id: 'invite', icon: UserRoundPlusIcon, label: 'Invite' },
    { id: 'profile', icon: CircleUserRoundIcon, label: 'Profile' },
]

export default function ChatMain() {

    const conversations = useChatStore((state) => state.conversations); // all conversation object
    const selectedChat = useChatStore((state) => state.selectedChat);
    const setConversations = useChatStore((state) => state.setConversations);
    const setSelectedChat = useChatStore((state) => state.setSelectedChat);
    const [activeIcon, setActiveIcon] = useState('messages');
    const [conversationsLoading, setConversationsLoading] = useState(true);
    const [conversationsError, setConversationsError] = useState("");
    const user = useAuthStore(state => state.user);
    const { resolvedTheme, setTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';

    const unreadCount = conversations.reduce((total, item) => total + (item.unreadCount || 0), 0);
    const displayName = user?.username || 'there';
    const greeting = getGreeting();

    const loadConversations = useCallback(async () => {
        setConversationsLoading(true);
        setConversationsError("");
        try {
            const res = await fetchAllConversations();
            setConversations(res.data);
        } catch (err) {
            logger.warn("chat.conversations.load_failed", {
                area: "chat",
                operation: "fetch_conversations",
                code: err.code,
            });
            setConversationsError("Check your connection and try loading your conversations again.");
        } finally {
            setConversationsLoading(false);
        }
    }, [setConversations]);

    useEffect(() => {
        loadConversations();
    }, [loadConversations]);

    const searchParams = useSearchParams();
    const router = useRouter()
    const conversationIdFromUrl = searchParams.get('conversationId');


    useEffect(() => {
        if(conversations){
            const foundConversation = conversations.find(u => u._id === conversationIdFromUrl)
            if (foundConversation) {
                setSelectedChat(foundConversation)
                router.push("/chat");
            }
        }
    }, [conversations, conversationIdFromUrl, router, setSelectedChat])

    const handleMobileNav = (id) => {
        setActiveIcon(id);
        if (id !== 'messages') {
            setSelectedChat(null);
        }
    }

    return (
        <div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-secondary/35 text-foreground">
            <ApplicationHeader displayName={displayName} />
            <div className="flex min-h-0 flex-1">
                <Sidebar
                    activeIcon={activeIcon}
                    onIconClick={setActiveIcon}
                />
                {activeIcon === 'messages' && (
                    <div className="flex min-h-0 min-w-0 flex-1 pb-19 md:pb-0">
                        <ChatList
                            conversations={conversations}
                            selectedChat={selectedChat}
                            onSelectChat={setSelectedChat}
                            user={user}
                            unreadCount={unreadCount}
                            isLoading={conversationsLoading}
                            loadError={conversationsError}
                            onRetry={loadConversations}
                            className={cn(selectedChat && "hidden md:flex")}
                        />
                        <div className={cn("min-h-0 min-w-0 flex-1", !selectedChat && "hidden md:flex")}>
                            {selectedChat ? (
                                <ChatScreen
                                    selectedChat={selectedChat}
                                    onBack={() => setSelectedChat(null)}
                                />
                            ) : (
                                <WelcomePanel
                                    greeting={greeting}
                                    displayName={displayName}
                                    conversations={conversations.length}
                                    unreadCount={unreadCount}
                                    isDark={isDark}
                                    onToggleTheme={() => setTheme(isDark ? 'light' : 'dark')}
                                />
                            )}
                        </div>
                    </div>
                )}

                {/* when profile selected */}
                {activeIcon === 'profile' && (
                    <div className='min-h-0 min-w-0 flex-1 overflow-y-auto pb-19 md:pb-0'>
                        <ProfileView user={user}/>
                    </div>
                )}

                {/* group selected */}
                {activeIcon === 'groups' && (
                    <PlaceholderPanel
                        title="Groups"
                        description="Group conversations are part of the project model. This area is ready for a focused group workspace view."
                        icon={Users}
                    />
                )}

                {/* calls selected */}
                {activeIcon === 'calls' && (
                    <PlaceholderPanel
                        title="Calls"
                        description="Call signaling exists in the backend modules. This client view can later connect to that flow."
                        icon={PhoneCallIcon}
                    />
                )}

                {/* settings */}
                {activeIcon === 'settings' && (
                    <PlaceholderPanel
                        title="Settings"
                        description="Manage theme preferences and workspace settings from one place as the app grows."
                        icon={Settings2}
                        action={
                            <Button variant="outline" className="rounded-xl" onClick={() => setTheme(isDark ? 'light' : 'dark')}>
                                {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
                                Switch to {isDark ? 'light' : 'dark'} mode
                            </Button>
                        }
                    />
                )}

                {/* invite  */}
                {activeIcon === 'invite' && (
                    <div className='min-h-0 min-w-0 flex-1 overflow-y-auto pb-19 md:pb-0'>
                        <InviteView />
                    </div>
                )}
            </div>

            <MobileNav activeIcon={activeIcon} onIconClick={handleMobileNav} />
        </div>
    )
}

function ApplicationHeader({ displayName }) {
    return (
        <header className="z-10 flex h-14 shrink-0 items-center justify-between border-b border-border/70 bg-background/95 px-4 shadow-sm backdrop-blur sm:px-5">
            <div className="flex min-w-0 items-center gap-2.5">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
                    <Boxes className="size-4" aria-hidden="true" />
                </span>
                <span className="truncate text-sm font-semibold">Dev-Clustra</span>
                <span className="hidden text-muted-foreground sm:inline" aria-hidden="true">/</span>
                <span className="hidden text-sm text-muted-foreground sm:inline">Workspace</span>
            </div>
            <p className="max-w-[45%] truncate text-xs text-muted-foreground sm:text-sm">
                {displayName}
            </p>
        </header>
    )
}

function WelcomePanel({ greeting, displayName, conversations, unreadCount, isDark, onToggleTheme }) {
    return (
        <section className="flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-y-auto p-6">
            <div className="w-full max-w-2xl rounded-[2rem] border border-border bg-background/90 p-8 text-center shadow-sm backdrop-blur">
                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm shadow-blue-600/20">
                    <Boxes className="size-7" />
                </div>
                <Badge variant="outline" className="mt-6 h-7 rounded-full px-3">DevClustra workspace</Badge>
                <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
                    {greeting}, {displayName}
                </h1>
                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
                    Select a conversation to continue messaging, review unread updates, or switch your workspace theme.
                </p>

                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <Button className="rounded-xl bg-blue-600 text-white hover:bg-blue-700">
                        <Sparkles className="size-4" />
                        Start from the list
                    </Button>
                    {/* <Button variant="outline" className="rounded-xl" onClick={onToggleTheme}>
                        {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
                        {isDark ? 'Light mode' : 'Dark mode'}
                    </Button> */}
                </div>
            </div>
        </section>
    )
}

function PlaceholderPanel({ title, description, icon: Icon, action }) {
    return (
        <section className="flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-y-auto p-6 pb-23 md:pb-6">
            <div className="w-full max-w-xl rounded-[2rem] border border-border bg-background/90 p-8 text-center shadow-sm">
                <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600">
                    <Icon className="size-6" />
                </div>
                <h2 className="mt-5 text-2xl font-semibold">{title}</h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
                {action && <div className="mt-6 flex justify-center">{action}</div>}
            </div>
        </section>
    )
}

function MobileNav({ activeIcon, onIconClick }) {
    return (
        <nav className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-4 rounded-2xl border border-border bg-background/95 p-2 shadow-xl shadow-zinc-950/10 backdrop-blur-xl md:hidden" aria-label="Mobile chat navigation">
            {mobileNavItems.map(({ id, icon: Icon, label }) => (
                <Button
                    key={id}
                    variant="ghost"
                    onClick={() => onIconClick(id)}
                    className={cn(
                        "h-12 flex-col gap-1 rounded-xl text-[11px] text-muted-foreground",
                        activeIcon === id && "bg-blue-600 text-white hover:bg-blue-600 hover:text-white"
                    )}
                >
                    <Icon className="size-4" />
                    {label}
                </Button>
            ))}
        </nav>
    )
}

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
}
