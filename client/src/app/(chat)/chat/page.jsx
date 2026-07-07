'use client'

import React, { useEffect, useState } from 'react'
import Sidebar from '@/components/chat/Sidebar'
import ChatList from '@/components/chat/ChatList'
import ChatScreen from '@/components/chat/ChatScreen'
import { FetchAllConversations } from '@/app/services/conversation.service';
import { useChatStore } from '@/store/chatStore';
import ProfileView from '@/components/profile/ProfileView'
import { useAuthStore } from '@/store/authStore'

export default function MainView() {
    const conversations = useChatStore((state) => state.conversations);
    const selectedChat = useChatStore((state) => state.selectedChat);
    const setConversations = useChatStore((state) => state.setConversations);
    const setSelectedChat = useChatStore((state) => state.setSelectedChat);
    const [activeIcon, setActiveIcon] = useState('messages');
    const user = useAuthStore(state => state.user);

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
            <Sidebar 
                activeIcon={activeIcon} 
                onIconClick={setActiveIcon} 
            />
            {activeIcon === 'messages' && (
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
                                Good Morning, Alok
                                Select your favourities and start chat...
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* when profile selected */}
            {activeIcon === 'profile' && (
                <div className='flex-1'> 
                    <ProfileView user={user}/>
                </div>
            )}

            {/* group selected */}
            {activeIcon === 'groups' && (
                <div className='flex-1 flex items-center justify-center'>
                    Group Page coming soon
                </div>
            )}

            {/* calls selected */}
            {activeIcon === 'calls' && (
                <div> Calls coming soon </div>
            )}

            {/* settings */}
            {activeIcon === 'settings' && (
                <div> Settings coming soon </div>
            )}

        </div>
    )
}