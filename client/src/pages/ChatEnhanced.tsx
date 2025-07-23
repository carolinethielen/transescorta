import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatBubble } from '@/components/ChatBubble';
import { ChatInput } from '@/components/ChatInput';
import { PlaceholderImage } from '@/components/PlaceholderImage';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { isUnauthorizedError } from '@/lib/authUtils';
import { ArrowLeft, MoreVertical, MessageCircle } from 'lucide-react';
import type { Message, User } from '@shared/schema';

export default function ChatEnhanced() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);

  // Get other user ID from URL params (simplified for demo)
  const otherUserId = new URLSearchParams(window.location.search).get('user') || 'demo-trans-1';

  // Fetch chat partner info
  const { data: chatPartner, isLoading: isPartnerLoading } = useQuery<User>({
    queryKey: [`/api/users/${otherUserId}`],
    retry: false,
  });

  // Fetch messages
  const { data: messages = [], isLoading: isMessagesLoading } = useQuery<Message[]>({
    queryKey: [`/api/chat/${otherUserId}/messages`],
    retry: false,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: {
      receiverId: string;
      content: string;
      messageType?: 'text' | 'image';
      imageUrl?: string;
    }) => {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/chat/messages', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.withCredentials = true;
        
        xhr.onload = function() {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const result = JSON.parse(xhr.responseText);
              resolve(result);
            } catch (e) {
              reject(new Error('Invalid JSON response'));
            }
          } else {
            try {
              const errorData = JSON.parse(xhr.responseText);
              reject(new Error(errorData.message || 'Failed to send message'));
            } catch (e) {
              reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
            }
          }
        };
        
        xhr.onerror = function() {
          reject(new Error('Network error'));
        };
        
        xhr.send(JSON.stringify(messageData));
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/chat/${otherUserId}/messages`] });
      setNewMessage('');
      
      // Scroll to bottom after sending message
      setTimeout(() => {
        if (scrollAreaRef.current) {
          const scrollArea = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
          if (scrollArea) {
            scrollArea.scrollTop = scrollArea.scrollHeight;
          }
        }
      }, 100);
    },
    onError: (error: any) => {
      if (isUnauthorizedError(error)) {
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
        title: "Fehler beim Senden",
        description: error.message || "Nachricht konnte nicht gesendet werden.",
        variant: "destructive",
      });
    },
  });

  // Setup WebSocket connection for real-time updates
  useEffect(() => {
    if (!user?.id) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log('WebSocket connected');
      socket.send(JSON.stringify({
        type: 'auth',
        userId: user.id
      }));
      setWs(socket);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'new_message') {
          // Refresh messages when new message received
          queryClient.invalidateQueries({ queryKey: [`/api/chat/${otherUserId}/messages`] });
          
          // Show notification if message is from chat partner
          if (data.senderId === otherUserId) {
            toast({
              title: `Neue Nachricht von ${chatPartner?.firstName || 'Unbekannt'}`,
              description: data.message.content || 'Bild gesendet',
            });
          }
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
      setWs(null);
    };

    return () => {
      socket.close();
    };
  }, [user?.id, otherUserId, chatPartner?.firstName, queryClient, toast]);

  // Auto-scroll to bottom when messages load
  useEffect(() => {
    if (messages.length > 0 && scrollAreaRef.current) {
      setTimeout(() => {
        const scrollArea = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollArea) {
          scrollArea.scrollTop = scrollArea.scrollHeight;
        }
      }, 100);
    }
  }, [messages.length]);

  const sendMessage = (content: string, messageType: 'text' | 'image' = 'text', imageUrl?: string) => {
    if ((!content.trim() && messageType === 'text') || !user) return;
    
    sendMessageMutation.mutate({
      receiverId: otherUserId,
      content: content.trim(),
      messageType,
      imageUrl,
    });
  };

  if (isPartnerLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#FF007F] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          
          {/* Chat Partner Info */}
          {chatPartner && (
            <div className="flex items-center gap-3">
              <div className="relative">
                {chatPartner.profileImageUrl ? (
                  <img
                    src={chatPartner.profileImageUrl}
                    alt={chatPartner.firstName || ''}
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <PlaceholderImage 
                    size="md" 
                    userType={chatPartner.userType ?? 'trans'} 
                    className="w-10 h-10"
                  />
                )}
                {chatPartner.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {chatPartner.firstName}
                  {chatPartner.lastName && ` ${chatPartner.lastName}`}
                </h3>
                <p className="text-sm text-gray-500">
                  {chatPartner.isOnline ? (
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      Online
                    </span>
                  ) : (
                    'Zuletzt gesehen...'
                  )}
                </p>
              </div>
            </div>
          )}
        </div>
        
        <Button variant="ghost" size="sm">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden relative">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="p-4 space-y-2 pb-4">
            {isMessagesLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin w-6 h-6 border-2 border-[#FF007F] border-t-transparent rounded-full" />
              </div>
            ) : messages && messages.length > 0 ? (
              messages.map((message, index) => {
                const isLastInGroup = index === messages.length - 1 || 
                  messages[index + 1]?.senderId !== message.senderId;
                  
                return (
                  <ChatBubble
                    key={message.id}
                    message={{
                      ...message,
                      messageType: message.messageType ?? 'text',
                      imageUrl: message.imageUrl ?? undefined,
                      isRead: message.isRead ?? false,
                      createdAt: message.createdAt?.toISOString() ?? new Date().toISOString(),
                    }}
                    currentUserId={user?.id || ''}
                    senderImage={
                      message.senderId === user?.id 
                        ? user?.profileImageUrl ?? undefined
                        : chatPartner?.profileImageUrl ?? undefined
                    }
                    senderName={
                      message.senderId === user?.id 
                        ? user?.firstName ?? undefined
                        : chatPartner?.firstName ?? undefined
                    }
                    senderUserType={
                      message.senderId === user?.id 
                        ? user?.userType ?? 'trans'
                        : chatPartner?.userType ?? 'trans'
                    }
                    showAvatar={true}
                    isLastInGroup={isLastInGroup}
                  />
                );
              })
            ) : (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  Noch keine Nachrichten
                </h3>
                <p className="text-gray-500 mb-4">
                  Schreibe die erste Nachricht an {chatPartner?.firstName}!
                </p>
                <div className="text-sm text-gray-400">
                  💬 Du kannst Textnachrichten und Bilder senden
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Enhanced Chat Input with Photo Support */}
      <div className="flex-shrink-0">
        <ChatInput
          onSendMessage={sendMessage}
          disabled={sendMessageMutation.isPending}
          placeholder={`Nachricht an ${chatPartner?.firstName || 'Unbekannt'}...`}
        />
        
        {/* WebSocket Connection Status */}
        {!ws && (
          <div className="bg-yellow-50 border-t border-yellow-200 px-4 py-2">
            <p className="text-sm text-yellow-800 text-center">
              Verbindung wird hergestellt...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}