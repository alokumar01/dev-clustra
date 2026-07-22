'use client'

import React, { useEffect, useState } from 'react'
import Sidebar from '@/components/chat/Sidebar'
import ChatList from '@/components/chat/ChatList'
import ChatScreen from '@/components/chat/ChatScreen'
import { FetchAllConversations } from '@/app/services/conversation.service';
import { useChatStore } from '@/store/chatStore';
import ProfileView from '@/components/profile/ProfileView'
import { useAuthStore } from '@/store/authStore'
import InviteView from '@/components/invite/Invite'
import { useSearchParams, useRouter} from 'next/navigation'


export default function ChatMain() {

    const conversations = useChatStore((state) => state.conversations); // all conversation object
    const selectedChat = useChatStore((state) => state.selectedChat);
    const setConversations = useChatStore((state) => state.setConversations);
    const setSelectedChat = useChatStore((state) => state.setSelectedChat);
    const [activeIcon, setActiveIcon] = useState('messages');
    const user = useAuthStore(state => state.user);

    // console.log("all conversation from chat main: ", conversations);

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

    // Testing invite converid with usesearchprams
    const searchParams = useSearchParams();
    const router = useRouter()
    const conversationIdFromUrl = searchParams.get('conversationId');

    useEffect(() => {
        if(conversations){
            const foundConversation = conversations.find(u => u._id === conversationIdFromUrl)
            // console.log("conversation found from invite: ", foundConversation)
            if (foundConversation) {
                setSelectedChat(foundConversation)
                router.push("/chat");
            }
        }
    }, [conversations, conversationIdFromUrl, router])

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
                                {conversationIdFromUrl}
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

            {/* invite  */}
            {activeIcon === 'invite' && (
                <div className='flex-1'>
                    <InviteView />
                </div>
            )}
        </div>
    )
}
