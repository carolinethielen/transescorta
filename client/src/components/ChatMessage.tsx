import React from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

interface ChatMessageProps {
  message: Message;
  currentUserId: string;
  senderImage?: string;
}

export function ChatMessage({ message, currentUserId, senderImage }: ChatMessageProps) {
  const isOwn = message.senderId === currentUserId;
  const time = format(new Date(message.createdAt), 'HH:mm', { locale: de });

  return (
    <div className={`flex space-x-2 ${isOwn ? 'justify-end' : ''}`}>
      {!isOwn && senderImage && (
        <img 
          src={senderImage}
          alt="Sender"
          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
        />
      )}
      
      <div className={`max-w-xs ${isOwn ? 'order-1' : ''}`}>
        <div 
          className={`p-3 rounded-2xl shadow-sm animate-in slide-in-from-bottom-2 duration-300 ${
            isOwn 
              ? 'bg-[#FF007F] text-white rounded-tr-sm' 
              : 'bg-card rounded-tl-sm'
          }`}
        >
          <p className="text-sm">{message.content}</p>
          <span className={`text-xs mt-1 block ${
            isOwn ? 'text-pink-200' : 'text-muted-foreground'
          }`}>
            {time}
          </span>
        </div>
      </div>
    </div>
  );
}
