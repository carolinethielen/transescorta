import React, { useState } from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Check, CheckCheck, Download, Maximize2 } from 'lucide-react';
import { PlaceholderImage } from './PlaceholderImage';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  messageType?: 'text' | 'image';
  imageUrl?: string;
  isRead: boolean;
  createdAt: string;
}

interface ChatBubbleProps {
  message: Message;
  currentUserId: string;
  senderImage?: string;
  senderName?: string;
  senderUserType?: 'trans' | 'man';
  showAvatar?: boolean;
  isLastInGroup?: boolean;
}

export function ChatBubble({ 
  message, 
  currentUserId, 
  senderImage, 
  senderName,
  senderUserType = 'trans',
  showAvatar = true,
  isLastInGroup = true
}: ChatBubbleProps) {
  const isOwn = message.senderId === currentUserId;
  const time = format(new Date(message.createdAt), 'HH:mm', { locale: de });
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <div className={`flex items-end gap-2 mb-1 ${isOwn ? 'flex-row-reverse' : 'flex-row'} animate-in slide-in-from-bottom-2 duration-300`}>
      {/* Avatar - only show for last message in group and for other person */}
      {showAvatar && !isOwn && isLastInGroup && (
        <div className="flex-shrink-0 mb-1">
          {senderImage ? (
            <img
              src={senderImage}
              alt={senderName || 'Sender'}
              className="w-8 h-8 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <PlaceholderImage size="sm" userType={senderUserType} />
          )}
        </div>
      )}
      {showAvatar && !isOwn && !isLastInGroup && (
        <div className="w-8 h-8 flex-shrink-0" /> // Spacer for alignment
      )}

      {/* Message Bubble */}
      <div className={`max-w-[75%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
        {/* Sender name for group chats (optional) */}
        {!isOwn && showAvatar && isLastInGroup && senderName && (
          <span className="text-xs text-gray-500 mb-1 px-2">{senderName}</span>
        )}

        <div 
          className={`px-4 py-2 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
            isOwn 
              ? 'bg-[#FF007F] text-white rounded-br-md' 
              : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-bl-md'
          }`}
        >
          {/* Image Message */}
          {message.messageType === 'image' && message.imageUrl && (
            <div className="relative">
              <Dialog>
                <DialogTrigger asChild>
                  <div className="cursor-pointer group relative">
                    <img
                      src={message.imageUrl}
                      alt="Geteiltes Bild"
                      className="max-w-full max-h-48 rounded-lg object-cover"
                      onLoad={() => setImageLoading(false)}
                      style={{ display: imageLoading ? 'none' : 'block' }}
                    />
                    {imageLoading && (
                      <div className="w-48 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                        <div className="animate-spin w-6 h-6 border-2 border-[#FF007F] border-t-transparent rounded-full" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                      <Maximize2 className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] p-0">
                  <div className="relative">
                    <img
                      src={message.imageUrl}
                      alt="Geteiltes Bild"
                      className="w-full h-auto max-h-[80vh] object-contain"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute top-4 right-4"
                      onClick={() => {
                        const a = document.createElement('a');
                        a.href = message.imageUrl!;
                        a.download = 'chat-image.jpg';
                        a.click();
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              {/* Caption if exists */}
              {message.content && (
                <p className="mt-2 text-sm">{message.content}</p>
              )}
            </div>
          )}

          {/* Text Message */}
          {message.messageType !== 'image' && (
            <p className="text-sm leading-relaxed break-words">{message.content}</p>
          )}
        </div>

        {/* Time and Read Status */}
        <div className={`flex items-center gap-1 mt-1 px-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="text-xs text-gray-400">
            {time}
          </span>
          
          {/* Read indicators for own messages */}
          {isOwn && (
            <div className="ml-1">
              {message.isRead ? (
                <CheckCheck className="w-3 h-3 text-blue-500" />
              ) : (
                <Check className="w-3 h-3 text-gray-400" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}