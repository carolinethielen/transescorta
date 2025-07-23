import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { ArrowLeft, Send, MessageCircle, Phone, Video, MoreVertical, User2 } from 'lucide-react';
import type { Message, User, ChatRoom } from '@shared/schema';

// Audio notification for new messages
const playNotificationSound = () => {
  try {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMcBDuY3PbDeSgFKn7L8diMOQgXZLjr55NBDR5Mp+PtwPBWFApEp+DysFQ');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  } catch {}
};

export default function ChatMain() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Chat state
  const [selectedChatUserId, setSelectedChatUserId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [ws, setWs] = useState<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get user from URL params if redirected from profile
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('user');
    if (userId) {
      setSelectedChatUserId(userId);
    }
  }, []);

  // Fetch chat rooms list
  const { data: chatRooms = [], isLoading: roomsLoading, error: roomsError } = useQuery<
    (ChatRoom & { otherUser: User; lastMessage: Message | null; unreadCount: number })[]
  >({
    queryKey: ['/api/chat/rooms'],
    enabled: !!user,
    retry: 1,
  });

  // Fetch messages for selected chat
  const { data: messages = [], isLoading: messagesLoading } = useQuery<Message[]>({
    queryKey: ['/api/chat', selectedChatUserId, 'messages'],
    enabled: !!selectedChatUserId && !!user,
    retry: 1,
  });

  // Get chat partner info
  const selectedChatRoom = chatRooms.find(room => room.otherUser.id === selectedChatUserId);
  const chatPartner = selectedChatRoom?.otherUser;

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ receiverId, content }: { receiverId: string; content: string }) => {
      return await apiRequest('POST', '/api/chat/messages', { 
        receiverId, 
        content,
        messageType: 'text'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat', selectedChatUserId, 'messages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/chat/rooms'] });
      queryClient.invalidateQueries({ queryKey: ['/api/chat/unread-count'] });
      setMessageText('');
      scrollToBottom();
    },
    onError: (error) => {
      console.error('Send message error:', error);
      toast({
        title: "Fehler",
        description: "Nachricht konnte nicht gesendet werden. Bitte versuche es erneut.",
        variant: "destructive",
      });
    },
  });

  // WebSocket connection
  useEffect(() => {
    if (!user) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    try {
      const socket = new WebSocket(wsUrl);
      
      socket.onopen = () => {
        console.log('WebSocket connected');
        setWs(socket);
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'new_message') {
            // Refresh messages and rooms
            queryClient.invalidateQueries({ queryKey: ['/api/chat'] });
            queryClient.invalidateQueries({ queryKey: ['/api/chat/unread-count'] });
            
            // Play notification sound
            playNotificationSound();
          }
        } catch (e) {
          console.error('WebSocket message parsing error:', e);
        }
      };

      socket.onclose = () => {
        console.log('WebSocket disconnected');
        setWs(null);
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        setWs(null);
      };

      return () => {
        socket.close();
      };
    } catch (error) {
      console.error('WebSocket connection failed:', error);
    }
  }, [user, queryClient]);

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle sending messages
  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedChatUserId || sendMessageMutation.isPending) return;

    try {
      await sendMessageMutation.mutateAsync({
        receiverId: selectedChatUserId,
        content: messageText.trim(),
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  // Handle key press for sending messages
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Mark messages as read when chat is selected
  useEffect(() => {
    if (selectedChatUserId && user) {
      apiRequest('PUT', `/api/chat/${selectedChatUserId}/read`, {})
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ['/api/chat/rooms'] });
          queryClient.invalidateQueries({ queryKey: ['/api/chat/unread-count'] });
        })
        .catch(console.error);
    }
  }, [selectedChatUserId, user, queryClient]);

  // Loading state
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Anmeldung erforderlich</h2>
          <p className="text-muted-foreground mb-4">Du musst angemeldet sein, um den Chat zu nutzen.</p>
          <Link href="/login">
            <Button>Jetzt anmelden</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen max-w-6xl mx-auto bg-background">
      {/* Chat List Sidebar */}
      <div className="w-80 border-r bg-card">
        <div className="p-4 border-b">
          <h1 className="text-xl font-semibold">Nachrichten</h1>
        </div>

        <ScrollArea className="h-full">
          {roomsLoading ? (
            <div className="p-4">
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-3 animate-pulse">
                    <div className="w-12 h-12 bg-muted rounded-full" />
                    <div className="flex-1">
                      <div className="h-4 bg-muted rounded mb-2" />
                      <div className="h-3 bg-muted rounded w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : chatRooms.length === 0 ? (
            <div className="p-8 text-center">
              <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                Keine Unterhaltungen
              </h3>
              <p className="text-sm text-muted-foreground">
                Starte eine neue Unterhaltung über ein Profil
              </p>
            </div>
          ) : (
            <div className="p-2">
              {chatRooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => setSelectedChatUserId(room.otherUser.id)}
                  className={`w-full p-3 rounded-lg text-left hover:bg-muted/50 transition-colors ${
                    selectedChatUserId === room.otherUser.id ? 'bg-muted' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={room.otherUser.profileImageUrl || undefined} />
                        <AvatarFallback>
                          {room.otherUser.firstName?.charAt(0) || '?'}
                        </AvatarFallback>
                      </Avatar>
                      {room.otherUser.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium truncate">
                          {room.otherUser.firstName}
                        </h3>
                        {room.unreadCount > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {room.unreadCount}
                          </Badge>
                        )}
                      </div>
                      {room.lastMessage && (
                        <p className="text-sm text-muted-foreground truncate mt-1">
                          {room.lastMessage.content}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChatUserId && chatPartner ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={chatPartner.profileImageUrl || undefined} />
                    <AvatarFallback>
                      {chatPartner.firstName?.charAt(0) || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-semibold">{chatPartner.firstName}</h2>
                    <p className="text-sm text-muted-foreground">
                      {chatPartner.isOnline ? 'Online' : 'Zuletzt gesehen vor kurzem'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              {messagesLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start space-x-2 animate-pulse">
                      <div className="w-8 h-8 bg-muted rounded-full" />
                      <div className="flex-1">
                        <div className="h-4 bg-muted rounded mb-2" />
                        <div className="h-16 bg-muted rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    Keine Nachrichten
                  </h3>
                  <p className="text-muted-foreground">
                    Schreibe die erste Nachricht an {chatPartner.firstName}!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message, index) => {
                    const isFromMe = message.senderId === user.id;
                    const showAvatar = index === 0 || messages[index - 1]?.senderId !== message.senderId;
                    
                    return (
                      <div
                        key={message.id}
                        className={`flex items-start gap-3 ${isFromMe ? 'flex-row-reverse' : ''}`}
                      >
                        {showAvatar && (
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={isFromMe ? (user.profileImageUrl || undefined) : (chatPartner.profileImageUrl || undefined)} />
                            <AvatarFallback>
                              {isFromMe ? user.firstName?.charAt(0) : chatPartner.firstName?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        {!showAvatar && <div className="w-8" />}
                        
                        <div className={`max-w-xs lg:max-w-md ${isFromMe ? 'text-right' : ''}`}>
                          <div
                            className={`rounded-lg px-4 py-2 text-sm ${
                              isFromMe
                                ? 'bg-[#FF007F] text-white'
                                : 'bg-muted text-foreground'
                            }`}
                          >
                            {message.content}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {message.createdAt ? new Date(message.createdAt).toLocaleTimeString('de-DE', {
                              hour: '2-digit',
                              minute: '2-digit',
                            }) : ''}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t bg-card">
              <div className="flex items-center space-x-2">
                <Input
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Nachricht an ${chatPartner.firstName}...`}
                  className="flex-1"
                  disabled={sendMessageMutation.isPending}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim() || sendMessageMutation.isPending}
                  size="sm"
                  className="bg-[#FF007F] hover:bg-[#FF007F]/90"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              
              {!ws && (
                <div className="mt-2 text-xs text-amber-600">
                  Verbindung wird hergestellt...
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                Wähle eine Unterhaltung
              </h3>
              <p className="text-muted-foreground">
                Wähle eine Person aus der Liste, um zu chatten
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}