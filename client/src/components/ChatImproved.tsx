import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PlaceholderImage } from '@/components/PlaceholderImage';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  Send, 
  Phone, 
  Video, 
  ArrowLeft, 
  Image as ImageIcon, 
  Paperclip,
  Download,
  X,
  Check,
  CheckCheck,
  Clock
} from 'lucide-react';
import { type User, type Message, type ChatRoom } from '@shared/schema';

interface ChatImprovedProps {
  selectedChatId?: string;
  onBack?: () => void;
}

export function ChatImproved({ selectedChatId, onBack }: ChatImprovedProps) {
  const [messageText, setMessageText] = useState('');
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Fetch chat partner info
  const { data: chatPartner } = useQuery<User>({
    queryKey: ['/api/users', selectedChatId, 'public'],
    enabled: !!selectedChatId,
    retry: false,
  });

  // Fetch messages with optimistic updates
  const { data: messages = [], isLoading: messagesLoading, refetch: refetchMessages } = useQuery<Message[]>({
    queryKey: ['/api/chat', selectedChatId, 'messages'],
    enabled: !!selectedChatId,
    retry: false,
    refetchInterval: false, // We'll use WebSocket for real-time updates
  });

  // Memoized message grouping for better performance
  const groupedMessages = useMemo(() => {
    const groups: (Message & { showAvatar: boolean })[] = [];
    
    messages.forEach((message, index) => {
      const prevMessage = messages[index - 1];
      const showAvatar = !prevMessage || 
        prevMessage.senderId !== message.senderId ||
        (new Date(message.createdAt).getTime() - new Date(prevMessage.createdAt).getTime()) > 300000; // 5 minutes
      
      groups.push({ ...message, showAvatar });
    });
    
    return groups;
  }, [messages]);

  // Auto-scroll to bottom with smooth animation
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'end'
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Enhanced WebSocket setup with reconnection
  useEffect(() => {
    if (!user || !selectedChatId) return;

    const connectWebSocket = () => {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      const socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        console.log('🔔 WebSocket connected successfully');
        setIsConnected(true);
        socket.send(JSON.stringify({ type: 'identify', userId: user.id }));
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('🔔 WebSocket message received:', data);
          
          if (data.type === 'new_message' && data.message.chatRoomId === selectedChatId) {
            // Optimistically update messages
            queryClient.setQueryData(
              ['/api/chat', selectedChatId, 'messages'],
              (oldMessages: Message[] = []) => [...oldMessages, data.message]
            );
            scrollToBottom();
          } else if (data.type === 'typing_indicator' && data.chatRoomId === selectedChatId) {
            setIsTyping(data.isTyping && data.userId !== user.id);
          }
        } catch (error) {
          console.error('WebSocket message parse error:', error);
        }
      };

      socket.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        // Reconnect after 3 seconds
        setTimeout(connectWebSocket, 3000);
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };

      setWs(socket);
    };

    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [user, selectedChatId, queryClient, scrollToBottom]);

  // Send message mutation with optimistic updates
  const sendMessageMutation = useMutation({
    mutationFn: async ({ content, imageFile }: { content?: string; imageFile?: File }) => {
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('receiverId', selectedChatId!);
        formData.append('messageType', 'image');
        
        return await apiRequest('POST', '/api/chat/messages/image', formData);
      } else {
        return await apiRequest('POST', '/api/chat/messages', { 
          receiverId: selectedChatId, 
          content 
        });
      }
    },
    onMutate: async ({ content, imageFile }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['/api/chat', selectedChatId, 'messages'] });
      
      // Snapshot previous value
      const previousMessages = queryClient.getQueryData(['/api/chat', selectedChatId, 'messages']);
      
      // Optimistically update
      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`,
        senderId: user!.id,
        receiverId: selectedChatId!,
        content: content || '',
        messageType: imageFile ? 'image' : 'text',
        imageUrl: imageFile ? URL.createObjectURL(imageFile) : undefined,
        isRead: false,
        createdAt: new Date().toISOString(),
        chatRoomId: selectedChatId!
      };
      
      queryClient.setQueryData(
        ['/api/chat', selectedChatId, 'messages'],
        (old: Message[] = []) => [...old, optimisticMessage]
      );
      
      return { previousMessages };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousMessages) {
        queryClient.setQueryData(['/api/chat', selectedChatId, 'messages'], context.previousMessages);
      }
      toast({
        title: "Fehler",
        description: "Nachricht konnte nicht gesendet werden",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      setMessageText('');
      setSelectedImage(null);
      setUploadProgress(0);
      // Refetch to get the real message ID
      refetchMessages();
    }
  });

  // Send typing indicator
  const sendTypingIndicator = useCallback((typing: boolean) => {
    if (ws && isConnected) {
      ws.send(JSON.stringify({
        type: 'typing_indicator',
        chatRoomId: selectedChatId,
        isTyping: typing
      }));
    }
  }, [ws, isConnected, selectedChatId]);

  // Handle input change with typing indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
    
    // Send typing indicator
    sendTypingIndicator(true);
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      sendTypingIndicator(false);
    }, 2000);
  };

  const handleSendMessage = () => {
    if (!messageText.trim() && !selectedImage) return;
    
    sendTypingIndicator(false);
    
    if (selectedImage) {
      sendMessageMutation.mutate({ imageFile: selectedImage });
    } else {
      sendMessageMutation.mutate({ content: messageText.trim() });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "Datei zu groß",
          description: "Bitte wähle ein Bild unter 10MB",
          variant: "destructive",
        });
        return;
      }
      setSelectedImage(file);
    }
  };

  const MessageBubble = ({ message, isFromMe, showAvatar }: { 
    message: Message & { showAvatar: boolean }, 
    isFromMe: boolean, 
    showAvatar: boolean 
  }) => (
    <div className={`flex ${isFromMe ? 'justify-end' : 'justify-start'} mb-1 group`}>
      <div className={`flex items-end gap-2 max-w-[75%] ${isFromMe ? 'flex-row-reverse' : ''}`}>
        {/* Avatar for other user */}
        {!isFromMe && showAvatar && (
          <Avatar className="w-8 h-8 mb-1 border-2 border-white shadow-sm">
            <AvatarImage src={chatPartner?.profileImageUrl || undefined} />
            <AvatarFallback className="text-xs bg-gradient-to-br from-pink-200 to-purple-200">
              {chatPartner?.firstName?.charAt(0) || '?'}
            </AvatarFallback>
          </Avatar>
        )}
        {!isFromMe && !showAvatar && <div className="w-8" />}
        
        <div className={`flex flex-col ${isFromMe ? 'items-end' : 'items-start'}`}>
          {/* Text Message */}
          {message.messageType === 'text' && (
            <div
              className={`px-4 py-3 rounded-2xl max-w-xs lg:max-w-md break-words relative ${
                isFromMe
                  ? 'bg-[#FF007F] text-white rounded-br-md shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-bl-md shadow-sm'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
              
              {/* Message status */}
              <div className={`flex items-center gap-1 mt-1 ${isFromMe ? 'justify-end' : 'justify-start'}`}>
                <span className={`text-xs ${isFromMe ? 'text-pink-100' : 'text-gray-500'}`}>
                  {new Date(message.createdAt).toLocaleTimeString('de-DE', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
                {isFromMe && (
                  <div className="text-pink-100">
                    {message.isRead ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Image Message */}
          {message.messageType === 'image' && message.imageUrl && (
            <div
              className={`rounded-2xl overflow-hidden max-w-xs lg:max-w-md cursor-pointer group relative ${
                isFromMe ? 'rounded-br-md' : 'rounded-bl-md'
              }`}
              onClick={() => setShowImagePreview(message.imageUrl!)}
            >
              <img
                src={message.imageUrl}
                alt="Chat image"
                className="w-full h-auto transition-transform duration-200 group-hover:scale-105"
                loading="lazy"
              />
              
              {/* Image overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <ImageIcon className="w-6 h-6 text-white drop-shadow-lg" />
                </div>
              </div>
              
              {/* Timestamp */}
              <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                {new Date(message.createdAt).toLocaleTimeString('de-DE', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (!selectedChatId) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">Wähle einen Chat aus</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* Chat Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            
            <Avatar className="w-10 h-10 border-2 border-gray-200 dark:border-gray-700">
              <AvatarImage src={chatPartner?.profileImageUrl || undefined} />
              <AvatarFallback className="bg-gradient-to-br from-pink-200 to-purple-200">
                {chatPartner?.firstName?.charAt(0) || '?'}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {chatPartner?.firstName || 'Unbekannt'}
              </h3>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {isConnected ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="p-2">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <Video className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-1">
          {messagesLoading && (
            <div className="flex justify-center py-4">
              <div className="animate-spin w-6 h-6 border-4 border-[#FF007F] border-t-transparent rounded-full" />
            </div>
          )}
          
          {groupedMessages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isFromMe={message.senderId === user?.id}
              showAvatar={message.showAvatar}
            />
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start mb-1">
              <div className="flex items-end gap-2 max-w-[75%]">
                <Avatar className="w-8 h-8 mb-1">
                  <AvatarImage src={chatPartner?.profileImageUrl || undefined} />
                  <AvatarFallback className="text-xs">
                    {chatPartner?.firstName?.charAt(0) || '?'}
                  </AvatarFallback>
                </Avatar>
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Image Preview Modal */}
      {showImagePreview && (
        <Dialog open={!!showImagePreview} onOpenChange={() => setShowImagePreview(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] p-0">
            <div className="relative">
              <img
                src={showImagePreview}
                alt="Full size"
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70"
                onClick={() => setShowImagePreview(null)}
              >
                <X className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="absolute bottom-2 right-2 bg-black/50 text-white hover:bg-black/70"
                onClick={() => window.open(showImagePreview, '_blank')}
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Input Area */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        {/* Image Preview */}
        {selectedImage && (
          <div className="relative mb-3 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center gap-3">
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Preview"
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{selectedImage.name}</p>
                <p className="text-xs text-gray-500">
                  {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedImage(null)}
                className="p-1"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
        
        <div className="flex items-end gap-2">
          {/* Attachment Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 flex-shrink-0"
          >
            <Paperclip className="w-4 h-4" />
          </Button>
          
          {/* Message Input */}
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={messageText}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Nachricht schreiben..."
              className="pr-12 resize-none min-h-[40px] max-h-[120px]"
              disabled={sendMessageMutation.isPending}
            />
          </div>
          
          {/* Send Button */}
          <Button
            onClick={handleSendMessage}
            disabled={(!messageText.trim() && !selectedImage) || sendMessageMutation.isPending}
            className="p-2 bg-[#FF007F] hover:bg-[#FF007F]/90 flex-shrink-0"
          >
            {sendMessageMutation.isPending ? (
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />
      </div>
    </div>
  );
}