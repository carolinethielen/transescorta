import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatBubble } from '@/components/ChatBubble';
import { ChatInput } from '@/components/ChatInput';
import { PlaceholderImage } from '@/components/PlaceholderImage';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { isUnauthorizedError } from '@/lib/authUtils';
import { apiRequest } from '@/lib/queryClient';
import { Send, Phone, Video, ArrowLeft, MessageCircle } from 'lucide-react';
import { type User, type Message, type ChatRoom } from '@shared/schema';

export default function Chat() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [ws, setWs] = useState<WebSocket | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch chat rooms
  const { data: chatRooms = [], isLoading: roomsLoading } = useQuery<(ChatRoom & { otherUser: User; lastMessage: Message | null; unreadCount: number })[]>({
    queryKey: ['/api/chat/rooms'],
    retry: false,
  });

  // Fetch messages for selected chat
  const { data: messages = [], isLoading: messagesLoading } = useQuery<Message[]>({
    queryKey: ['/api/chat', selectedChat, 'messages'],
    enabled: !!selectedChat,
    retry: false,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ receiverId, content }: { receiverId: string; content: string }) => {
      await apiRequest('POST', '/api/chat/messages', { receiverId, content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat', selectedChat, 'messages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/chat/rooms'] });
      setMessageText('');
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "Du bist nicht mehr angemeldet. Leite weiter...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Fehler",
        description: "Nachricht konnte nicht gesendet werden",
        variant: "destructive",
      });
    },
  });

  // Setup WebSocket connection
  useEffect(() => {
    if (!user) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: 'auth', userId: user.id }));
      setWs(socket);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'new_message') {
        queryClient.invalidateQueries({ queryKey: ['/api/chat', selectedChat, 'messages'] });
        queryClient.invalidateQueries({ queryKey: ['/api/chat/rooms'] });
      }
    };

    socket.onclose = () => {
      setWs(null);
    };

    return () => {
      socket.close();
    };
  }, [user, selectedChat, queryClient]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedChat) return;

    const receiverRoom = chatRooms.find((room: any) => room.otherUser.id === selectedChat);
    if (!receiverRoom) return;

    // Send via WebSocket if connected
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'message',
        receiverId: selectedChat,
        content: messageText.trim(),
      }));
      setMessageText('');
    } else {
      // Fallback to HTTP
      sendMessageMutation.mutate({
        receiverId: selectedChat,
        content: messageText.trim(),
      });
    }
  };

  const selectedChatRoom = chatRooms.find((room: any) => room.otherUser.id === selectedChat);

  if (roomsLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#FF007F] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-background">
      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col h-screen w-screen bg-background">
        {!selectedChat ? (
          // Chat List
          <div className="flex-1 bg-background w-full">
            {/* Header */}
            <div className="p-4 border-b border-border bg-background w-full">
              <h2 className="text-xl font-bold">Nachrichten</h2>
            </div>

            {/* Chat Rooms */}
            <div className="flex-1 bg-background">
              {chatRooms.length === 0 ? (
                <div className="p-8 text-center bg-background">
                  <p className="text-muted-foreground">Noch keine Nachrichten</p>
                </div>
              ) : (
                chatRooms.map((room: any) => (
                  <div
                    key={room.id}
                    className="flex items-center space-x-3 p-3 hover:bg-muted cursor-pointer border-b border-border/50 bg-background"
                    onClick={() => setSelectedChat(room.otherUser.id)}
                  >
                    <div className="relative">
                      {room.otherUser.profileImageUrl ? (
                        <img 
                          src={room.otherUser.profileImageUrl}
                          alt={room.otherUser.firstName || 'User'}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                          👤
                        </div>
                      )}
                      {room.otherUser.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold truncate">
                          {room.otherUser.firstName || 'Anonymer Nutzer'}
                        </h3>
                        {room.lastMessage && (
                          <span className="text-xs text-muted-foreground">
                            {new Date(room.lastMessage.createdAt).toLocaleTimeString('de-DE', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {room.lastMessage?.content || 'Neue Unterhaltung'}
                      </p>
                    </div>
                    
                    {room.unreadCount > 0 && (
                      <div className="w-5 h-5 bg-[#FF007F] rounded-full flex items-center justify-center text-white text-xs">
                        {room.unreadCount}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
        // Active Chat
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="flex items-center space-x-3 p-4 bg-card border-b border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedChat(null)}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            
            {selectedChatRoom?.otherUser.profileImageUrl ? (
              <img 
                src={selectedChatRoom.otherUser.profileImageUrl}
                alt={selectedChatRoom.otherUser.firstName || 'User'}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                👤
              </div>
            )}
            
            <div className="flex-1">
              <h3 className="font-semibold">
                {selectedChatRoom?.otherUser.firstName || 'Anonymer Nutzer'}
              </h3>
              <p className="text-xs text-green-500">
                {selectedChatRoom?.otherUser.isOnline ? 'Online' : 'Offline'}
              </p>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm">
                <Phone className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Video className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            {messagesLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin w-6 h-6 border-2 border-[#FF007F] border-t-transparent rounded-full" />
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message: any) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    currentUserId={user?.id || ''}
                    senderImage={selectedChatRoom?.otherUser.profileImageUrl || undefined}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="p-4 bg-card border-t border-border">
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Nachricht schreiben..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="flex-1 rounded-full"
              />
              <Button 
                type="submit" 
                size="sm"
                className="rounded-full bg-[#FF007F] hover:bg-[#FF007F]/90"
                disabled={!messageText.trim() || sendMessageMutation.isPending}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>
        )}
      </div>

      {/* Desktop Layout - Two Panel */}
      <div className="hidden md:flex h-screen w-screen bg-background">
        {/* Left Panel - Chat List */}
        <div className="w-1/3 border-r border-border flex flex-col bg-background h-full">
          {/* Header */}
          <div className="p-6 border-b border-border bg-background w-full">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#FF007F] to-purple-600 bg-clip-text text-transparent">
              Nachrichten
            </h1>
          </div>

          {/* Chat Rooms */}
          <div className="flex-1 overflow-y-auto bg-background">
            {chatRooms.length === 0 ? (
              <div className="p-8 text-center bg-background">
                <p className="text-muted-foreground">Noch keine Nachrichten</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Starte ein Gespräch, indem du jemanden likest!
                </p>
              </div>
            ) : (
              chatRooms.map((room: any) => (
                <div
                  key={room.id}
                  className={`flex items-center space-x-4 p-4 hover:bg-muted cursor-pointer border-b border-border/50 transition-colors ${
                    selectedChat === room.otherUser.id ? 'bg-[#FF007F]/10 border-l-4 border-l-[#FF007F]' : 'bg-background'
                  }`}
                  onClick={() => setSelectedChat(room.otherUser.id)}
                >
                  <div className="relative">
                    {room.otherUser.profileImageUrl ? (
                      <img 
                        src={room.otherUser.profileImageUrl}
                        alt={room.otherUser.firstName || 'User'}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gradient-to-r from-[#FF007F] to-purple-600 flex items-center justify-center text-white text-lg">
                        {room.otherUser.firstName?.charAt(0) || '👤'}
                      </div>
                    )}
                    {room.otherUser.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-semibold truncate">
                        {room.otherUser.firstName || 'Anonymer Nutzer'}
                      </h3>
                      {room.lastMessage && (
                        <span className="text-xs text-muted-foreground">
                          {new Date(room.lastMessage.createdAt).toLocaleTimeString('de-DE', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground truncate">
                        {room.lastMessage?.content || 'Neue Unterhaltung'}
                      </p>
                      {room.unreadCount > 0 && (
                        <div className="ml-2 w-5 h-5 bg-[#FF007F] rounded-full flex items-center justify-center text-white text-xs">
                          {room.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Panel - Active Chat */}
        <div className="flex-1 flex flex-col bg-background">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between p-6 bg-background border-b border-border">
                <div className="flex items-center space-x-4">
                  {selectedChatRoom?.otherUser.profileImageUrl ? (
                    <img 
                      src={selectedChatRoom.otherUser.profileImageUrl}
                      alt={selectedChatRoom.otherUser.firstName || 'User'}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF007F] to-purple-600 flex items-center justify-center text-white">
                      {selectedChatRoom?.otherUser.firstName?.charAt(0) || '👤'}
                    </div>
                  )}
                  
                  <div>
                    <h3 className="font-semibold text-lg">
                      {selectedChatRoom?.otherUser.firstName || 'Anonymer Nutzer'}
                    </h3>
                    <p className="text-sm text-green-500">
                      {selectedChatRoom?.otherUser.isOnline ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" className="rounded-full">
                    <Phone className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="sm" className="rounded-full">
                    <Video className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-6 bg-background">
                {messagesLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-[#FF007F] border-t-transparent rounded-full" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message: any) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.senderId === user?.id
                              ? 'bg-[#FF007F] text-white'
                              : 'bg-muted text-foreground'
                          }`}
                        >
                          <p>{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(message.createdAt).toLocaleTimeString('de-DE', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </ScrollArea>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-6 bg-background border-t border-border">
                <div className="flex items-center space-x-4">
                  <Input
                    type="text"
                    placeholder="Nachricht schreiben..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="flex-1 rounded-full border-2 border-muted focus:border-[#FF007F] h-12"
                  />
                  <Button 
                    type="submit" 
                    size="lg"
                    className="rounded-full bg-gradient-to-r from-[#FF007F] to-purple-600 hover:from-[#FF007F]/90 hover:to-purple-600/90 h-12 w-12 p-0"
                    disabled={!messageText.trim() || sendMessageMutation.isPending}
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </form>
            </>
          ) : (
            // No Chat Selected
            <div className="flex-1 flex items-center justify-center bg-background">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-[#FF007F] to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Chat auswählen</h3>
                <p className="text-muted-foreground">
                  Wähle einen Chat aus der Liste, um zu beginnen
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
