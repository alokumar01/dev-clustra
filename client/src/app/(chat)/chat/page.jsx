'use client'

import React, { useEffect, useState } from 'react'
import Sidebar from '@/components/chat/Sidebar'
import ChatList from '@/components/chat/ChatList'
import ChatScreen from '@/components/chat/ChatScreen'
import { FetchAllConversations } from '@/app/services/conversation.service';
import { useChatStore } from '@/store/chatStore';

export default function MainView() {
    const conversations = useChatStore((state) => state.conversations);
    const selectedChat = useChatStore((state) => state.selectedChat);
    const setConversations = useChatStore((state) => state.setConversations);
    const setSelectedChat = useChatStore((state) => state.setSelectedChat);
    const [activeIcon, setActiveIcon] = useState('messages');

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const res = await FetchAllConversations();
                setConversations(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchChats();
    }, [setConversations])

    return (
        <div className="flex h-screen min-h-screen bg-gray-50">
            <Sidebar activeIcon={activeIcon} onIconClick={setActiveIcon} />
            <div className="flex flex-1 md:flex">
                <ChatList
                    conversations={conversations}
                    selectedChat={selectedChat}
                    onSelectChat={setSelectedChat}
                />
                <div className="flex-1 hidden md:block">
                    {selectedChat ? (
                        <ChatScreen 
                            selectedChat={selectedChat}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400"> 
                            Select a chat 
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}