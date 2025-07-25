import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatImproved } from '@/components/ChatImproved';
import { PlaceholderImage } from '@/components/PlaceholderImage';
import { useAuth } from '@/hooks/useAuth';
import { MessageCircle, Clock } from 'lucide-react';
import { type User, type Message, type ChatRoom } from '@shared/schema';

export default function ChatNew() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const { user } = useAuth();
  
  // Get chat ID from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const chatId = urlParams.get('user');
    if (chatId) {
      setSelectedChat(chatId);
    }
  }, []);

  // Fetch chat rooms
  const { data: chatRooms = [], isLoading: roomsLoading } = useQuery<(ChatRoom & { otherUser: User; lastMessage: Message | null; unreadCount: number })[]>({
    queryKey: ['/api/chat/rooms'],
    retry: false,
  });

  const ChatRoomItem = ({ room }: { room: ChatRoom & { otherUser: User; lastMessage: Message | null; unreadCount: number } }) => (
    <div
      onClick={() => setSelectedChat(room.otherUser.id)}
      className={`p-4 cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 ${
        selectedChat === room.otherUser.id ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-[#FF007F]' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
            <AvatarImage src={room.otherUser.profileImageUrl || undefined} />
            <AvatarFallback className="bg-gradient-to-br from-pink-200 to-purple-200">
              {room.otherUser.firstName?.charAt(0) || '?'}
            </AvatarFallback>
          </Avatar>
          
          {room.unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 bg-[#FF007F] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg">
              {room.unreadCount > 99 ? '99+' : room.unreadCount}
            </div>
          )}
          
          {/* Online indicator */}
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {room.otherUser.firstName} {room.otherUser.lastName}
            </h3>
            {room.lastMessage && (
              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(room.lastMessage.createdAt).toLocaleTimeString('de-DE', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            )}
          </div>
          
          {room.lastMessage && (
            <p className={`text-sm truncate ${room.unreadCount > 0 ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
              {room.lastMessage.messageType === 'image' ? '📸 Bild gesendet' : 
               room.lastMessage.messageType === 'private_album' ? '🔒 Privates Album geteilt' :
               room.lastMessage.content}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  if (roomsLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-[#FF007F] border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Lade Chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Chat List Sidebar */}
      <div className={`w-full md:w-96 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
        {/* Header */}
        <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Nachrichten</h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {chatRooms.length} Chat{chatRooms.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
        
        {/* Chat List */}
        <ScrollArea className="flex-1 bg-gray-50 dark:bg-gray-900">
          {chatRooms.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900 dark:to-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-10 h-10 text-[#FF007F]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Noch keine Chats
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                Starte eine Unterhaltung, indem du ein Escort-Profil besuchst und auf "Message" klickst
              </p>
            </div>
          ) : (
            <div>
              {chatRooms.map((room) => (
                <ChatRoomItem key={room.id} room={room} />
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 ${selectedChat ? 'block' : 'hidden md:block'}`}>
        {selectedChat ? (
          <ChatImproved 
            selectedChatId={selectedChat} 
            onBack={() => setSelectedChat(null)}
          />
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center max-w-md">
              <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900 dark:to-purple-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-12 h-12 text-[#FF007F]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Wähle einen Chat aus
              </h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                Wähle einen Chat aus der Liste links, um deine Unterhaltung fortzusetzen oder eine neue zu beginnen
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}