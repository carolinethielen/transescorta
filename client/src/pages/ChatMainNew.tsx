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
import { ArrowLeft, Send, MessageCircle, User2, Download, ExternalLink } from 'lucide-react';
import { ChatInput } from '@/components/ChatInput';
import { ChatBubble } from '@/components/ChatBubble';
import type { Message, User, ChatRoom } from '@shared/schema';

// Audio notification for new messages
const playNotificationSound = () => {
  try {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMcBDuY3PbDeSgFKn7L8diMOQgXZLjr55NBDR5Mp+PtwPBWFApEp+DysFQ');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  } catch {}
};

export default function ChatMainNew() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Chat state
  const [selectedChatUserId, setSelectedChatUserId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [ws, setWs] = useState<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get user from URL params if redirected from profile and create chat room
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('user');
    if (userId && user) {
      // Create chat room first, then select it
      apiRequest('POST', '/api/chat/rooms', { otherUserId: userId })
        .then(() => {
          setSelectedChatUserId(userId);
          // Refresh chat rooms list
          queryClient.invalidateQueries({ queryKey: ['/api/chat/rooms'] });
        })
        .catch((error) => {
          console.error('Failed to create chat room:', error);
          toast({
            title: "Fehler",
            description: `Chat konnte nicht gestartet werden: ${error.message || 'Unbekannter Fehler'}`,
            variant: "destructive",
          });
        });
    }
  }, [user, queryClient, toast]);

  // Fetch chat rooms list
  const { data: chatRooms = [], isLoading: roomsLoading } = useQuery<
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
    mutationFn: async ({ receiverId, content, messageType, imageFile, privateAlbumId }: { 
      receiverId: string; 
      content: string;
      messageType?: string;
      imageFile?: File;
      privateAlbumId?: string;
    }) => {
      if (messageType === 'image' && imageFile) {
        const formData = new FormData();
        formData.append('receiverId', receiverId);
        formData.append('content', content || '');
        formData.append('messageType', 'image');
        formData.append('image', imageFile);
        
        const response = await fetch('/api/chat/messages/image', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error('Failed to send image');
        }
        
        return response.json();
      } else if (messageType === 'private_album' && privateAlbumId) {
        return await apiRequest('POST', '/api/chat/messages', { 
          receiverId, 
          content: content || '',
          messageType: 'private_album',
          privateAlbumId
        });
      } else {
        return await apiRequest('POST', '/api/chat/messages', { 
          receiverId, 
          content,
          messageType: 'text'
        });
      }
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
            // Immediate refresh for current chat
            if (selectedChatUserId) {
              queryClient.invalidateQueries({ queryKey: ['/api/chat', selectedChatUserId, 'messages'] });
            }
            // Refresh chat rooms and unread count
            queryClient.invalidateQueries({ queryKey: ['/api/chat/rooms'] });
            queryClient.invalidateQueries({ queryKey: ['/api/chat/unread-count'] });
            
            // Play notification sound
            playNotificationSound();
            
            // Auto-scroll to bottom
            setTimeout(scrollToBottom, 100);
          }
        } catch (e) {
          console.error('WebSocket message parsing error:', e);
        }
      };

      socket.onclose = () => {
        console.log('WebSocket disconnected');
        setWs(null);
      };

      return () => {
        socket.close();
      };
    } catch (error) {
      console.error('WebSocket connection error:', error);
    }
  }, [user, queryClient]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send message handlers
  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedChatUserId || sendMessageMutation.isPending) return;
    
    try {
      sendMessageMutation.mutate({
        receiverId: selectedChatUserId,
        content: messageText.trim(),
        messageType: 'text'
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleSendImage = (imageFile: File) => {
    if (!selectedChatUserId || sendMessageMutation.isPending) return;
    
    try {
      sendMessageMutation.mutate({
        receiverId: selectedChatUserId,
        content: messageText.trim() || '',
        messageType: 'image',
        imageFile
      });
    } catch (error) {
      console.error('Failed to send image:', error);
    }
  };

  const handleSendPrivateAlbum = (albumId: string) => {
    if (!selectedChatUserId || sendMessageMutation.isPending) return;
    
    try {
      sendMessageMutation.mutate({
        receiverId: selectedChatUserId,
        content: messageText.trim() || '',
        messageType: 'private_album',
        privateAlbumId: albumId
      });
    } catch (error) {
      console.error('Failed to send private album:', error);
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
        <div className="text-center max-w-md mx-auto p-6">
          <h2 className="text-xl font-semibold mb-2">Anmeldung erforderlich</h2>
          <p className="text-muted-foreground mb-6">Du musst angemeldet sein, um den Chat zu nutzen.</p>
          
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg text-sm">
              <p className="font-medium mb-2">Demo-Account verwenden:</p>
              <p>E-Mail: lena@example.com</p>
              <p>Passwort: demo123</p>
            </div>
            
            <div className="flex gap-2">
              <Link href="/login" className="flex-1">
                <Button className="w-full">Anmelden</Button>
              </Link>
              <Link href="/register" className="flex-1">
                <Button variant="outline" className="w-full">Registrieren</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show chat list if no chat is selected (WhatsApp-style)
  if (!selectedChatUserId) {
    return (
      <div className="flex flex-col h-screen bg-background">
        {/* Header */}
        <div className="p-4 border-b bg-card">
          <h1 className="text-xl font-semibold">Nachrichten</h1>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-hidden">
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
                    className="w-full p-3 rounded-lg text-left hover:bg-muted/50 transition-colors active:bg-muted/70"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={room.otherUser.profileImageUrl || undefined} />
                          <AvatarFallback>
                            {room.otherUser.firstName?.charAt(0) || '?'}
                          </AvatarFallback>
                        </Avatar>

                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium truncate">
                              {room.otherUser.firstName} {room.otherUser.lastName}
                            </h3>
                            {room.otherUser.isOnline && (
                              <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                            )}
                          </div>
                          {room.lastMessage && room.lastMessage.createdAt && (
                            <span className="text-xs text-muted-foreground">
                              {new Date(room.lastMessage.createdAt).toLocaleTimeString('de-DE', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground truncate">
                            {room.lastMessage?.content || 'Keine Nachrichten'}
                          </p>
                          {room.unreadCount > 0 && (
                            <Badge className="bg-[#FF007F] text-white text-xs min-w-[20px] h-5 rounded-full px-1.5">
                              {room.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    );
  }

  // Show full-screen chat when a contact is selected (WhatsApp-style)
  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Chat Header - No call/video/menu buttons */}
      <div className="p-4 border-b bg-card">
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSelectedChatUserId(null)}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Avatar className="w-10 h-10">
            <AvatarImage src={chatPartner?.profileImageUrl || undefined} />
            <AvatarFallback>
              {chatPartner?.firstName?.charAt(0) || '?'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <button 
              onClick={() => navigate(`/profile?id=${chatPartner?.id}`)}
              className="text-left hover:opacity-80 transition-opacity"
            >
              <div className="flex items-center gap-2">
                <h3 className="font-medium">
                  {chatPartner?.firstName} {chatPartner?.lastName}
                </h3>
                {chatPartner?.isOnline && (
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {chatPartner?.isOnline ? 'Online' : 'Zuletzt gesehen'}
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area - Takes up remaining space above input */}
      <div className="flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900">
        <ScrollArea className="h-full">
          <div className="p-4 pb-24">
            {messagesLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-3 animate-pulse">
                    <div className="w-8 h-8 bg-muted rounded-full" />
                    <div className="flex-1">
                      <div className="h-10 bg-muted rounded-lg mb-2" />
                      <div className="h-3 bg-muted rounded w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Noch keine Nachrichten</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Schreibe die erste Nachricht!
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {messages.map((message, index) => {
                  const isFromMe = message.senderId === user.id;
                  const showAvatar = !isFromMe && (index === 0 || messages[index - 1]?.senderId !== message.senderId);
                  const nextMessageFromSameUser = messages[index + 1]?.senderId === message.senderId;
                  
                  return (
                    <ChatBubble
                      key={message.id}
                      message={{
                        ...message,
                        imageUrl: message.imageUrl || undefined,
                        privateAlbum: message.privateAlbumId ? {
                          id: message.privateAlbumId,
                          title: 'Privates Album',
                          coverImage: '/placeholder-album.jpg',
                          imageCount: 0,
                          accessExpiresAt: message.privateAlbumAccessExpiresAt?.toISOString() || new Date(Date.now() + 24*60*60*1000).toISOString()
                        } : undefined
                      }}
                      isFromMe={isFromMe}
                      showAvatar={showAvatar && !nextMessageFromSameUser}
                      user={user}
                      chatPartner={chatPartner}
                      onDownloadImage={(url) => {
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = 'image.jpg';
                        link.click();
                      }}
                      onAccessPrivateAlbum={(albumId) => {
                        navigate(`/albums/private/${albumId}`);
                      }}
                    />
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Enhanced Chat Input with Attachments */}
      <ChatInput
        messageText={messageText}
        setMessageText={setMessageText}
        onSendMessage={handleSendMessage}
        onSendImage={handleSendImage}
        onSendPrivateAlbum={handleSendPrivateAlbum}
        isLoading={sendMessageMutation.isPending}
        placeholder={`Nachricht an ${chatPartner?.firstName}...`}
      />
    </div>
  );
}