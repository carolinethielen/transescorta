import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Crown, Lock } from 'lucide-react';
import type { Message, User } from '@shared/schema';

interface ChatBubbleProps {
  message: Message & {
    imageUrl?: string;
    privateAlbum?: {
      id: string;
      title: string;
      coverImage: string;
      imageCount: number;
      accessExpiresAt: string;
    };
  };
  isFromMe: boolean;
  showAvatar: boolean;
  user: User;
  chatPartner?: User;
  onDownloadImage?: (url: string) => void;
  onAccessPrivateAlbum?: (albumId: string) => void;
}

export function ChatBubble({
  message,
  isFromMe,
  showAvatar,
  user,
  chatPartner,
  onDownloadImage,
  onAccessPrivateAlbum
}: ChatBubbleProps) {
  const isExpired = message.privateAlbum && new Date(message.privateAlbum.accessExpiresAt) < new Date();

  return (
    <div className={`flex ${isFromMe ? 'justify-end' : 'justify-start'} mb-1`}>
      <div className={`flex items-end gap-2 max-w-[80%] ${isFromMe ? 'flex-row-reverse' : ''}`}>
        {/* Avatar only for other users and when showing avatar */}
        {!isFromMe && showAvatar && (
          <Avatar className="w-6 h-6 mb-1">
            <AvatarImage src={chatPartner?.profileImageUrl || undefined} />
            <AvatarFallback className="text-xs">
              {chatPartner?.firstName?.charAt(0) || '?'}
            </AvatarFallback>
          </Avatar>
        )}
        {!isFromMe && !showAvatar && <div className="w-6" />}
        
        <div className={`flex flex-col ${isFromMe ? 'items-end' : 'items-start'}`}>
          {/* Text Message */}
          {message.messageType === 'text' && (
            <div
              className={`px-4 py-2 rounded-2xl max-w-xs lg:max-w-md break-words ${
                isFromMe
                  ? 'bg-[#FF007F] text-white rounded-br-md'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-bl-md'
              }`}
            >
              {message.content}
            </div>
          )}

          {/* Image Message */}
          {message.messageType === 'image' && message.imageUrl && (
            <div
              className={`rounded-2xl overflow-hidden max-w-xs lg:max-w-md ${
                isFromMe ? 'rounded-br-md' : 'rounded-bl-md'
              }`}
            >
              <div className="relative group">
                <img 
                  src={message.imageUrl} 
                  alt="Geteiltes Bild"
                  className="w-full h-auto max-h-64 object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDownloadImage?.(message.imageUrl!)}
                    className="text-white hover:bg-white/20"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              {message.content && (
                <div className={`px-3 py-2 ${isFromMe ? 'bg-[#FF007F] text-white' : 'bg-white dark:bg-gray-800'}`}>
                  {message.content}
                </div>
              )}
            </div>
          )}

          {/* Private Album Message */}
          {message.messageType === 'private_album' && message.privateAlbum && (
            <Card 
              className={`max-w-xs cursor-pointer hover:shadow-md transition-shadow ${
                isExpired ? 'opacity-60' : ''
              }`}
              onClick={() => !isExpired && onAccessPrivateAlbum?.(message.privateAlbum!.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Crown className="w-5 h-5 text-yellow-500" />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{message.privateAlbum.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {message.privateAlbum.imageCount} private Fotos
                    </p>
                  </div>
                  {isExpired && <Lock className="w-4 h-4 text-muted-foreground" />}
                </div>
                
                <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-2">
                  <img 
                    src={message.privateAlbum.coverImage} 
                    alt={message.privateAlbum.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Badge variant={isExpired ? "secondary" : "default"} className="text-xs">
                    {isExpired ? 'Zugang abgelaufen' : '24h Zugang'}
                  </Badge>
                  {!isExpired && (
                    <p className="text-xs text-muted-foreground">
                      Läuft ab: {new Date(message.privateAlbum.accessExpiresAt).toLocaleDateString('de-DE')}
                    </p>
                  )}
                </div>
                
                {message.content && (
                  <p className="text-sm mt-2">{message.content}</p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Timestamp */}
          <p className={`text-xs text-gray-500 mt-1 ${isFromMe ? 'text-right' : 'text-left'}`}>
            {message.createdAt ? new Date(message.createdAt).toLocaleTimeString('de-DE', {
              hour: '2-digit',
              minute: '2-digit',
            }) : ''}
          </p>
        </div>
      </div>
    </div>
  );
}