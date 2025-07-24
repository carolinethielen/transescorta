import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Send, Paperclip, Image as ImageIcon, Crown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface ChatInputProps {
  messageText: string;
  setMessageText: (text: string) => void;
  onSendMessage: () => void;
  onSendImage: (file: File) => void;
  onSendPrivateAlbum: (albumId: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

export function ChatInput({
  messageText,
  setMessageText,
  onSendMessage,
  onSendImage,
  onSendPrivateAlbum,
  isLoading,
  placeholder = "Nachricht schreiben..."
}: ChatInputProps) {
  const { user } = useAuth();
  const [showAttachments, setShowAttachments] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch private albums for trans escorts
  const { data: privateAlbums = [] } = useQuery<Array<{
    id: string;
    title: string;
    coverImage: string;
    imageCount: number;
  }>>({
    queryKey: ['/api/albums/private'],
    enabled: !!user && user.userType === 'trans',
    retry: 1,
  });

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onSendImage(file);
      setShowAttachments(false);
    }
  };

  const handlePrivateAlbumShare = (albumId: string) => {
    onSendPrivateAlbum(albumId);
    setShowAttachments(false);
  };

  return (
    <div className="fixed bottom-16 left-0 right-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-50">
      <div className="flex items-center space-x-2 w-full max-w-md mx-auto">
        {/* Attachment Button */}
        <Dialog open={showAttachments} onOpenChange={setShowAttachments}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="p-2">
              <Paperclip className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Anhang senden</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Photo Upload */}
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center gap-2 h-12"
                variant="outline"
              >
                <ImageIcon className="w-5 h-5" />
                Foto senden
              </Button>
              
              {/* Private Albums - Only for trans escorts */}
              {user?.userType === 'trans' && privateAlbums.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Crown className="w-4 h-4 text-yellow-500" />
                    Private Alben teilen (24h Zugang)
                  </h4>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                    {privateAlbums.map((album) => (
                      <Card 
                        key={album.id}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handlePrivateAlbumShare(album.id)}
                      >
                        <CardContent className="p-3">
                          <div className="aspect-square bg-muted rounded-lg mb-2 overflow-hidden">
                            {album.coverImage ? (
                              <img 
                                src={album.coverImage} 
                                alt={album.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon className="w-6 h-6 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <p className="text-xs font-medium truncate">{album.title}</p>
                          <Badge variant="secondary" className="text-xs mt-1">
                            {album.imageCount} Fotos
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Message Input */}
        <Input
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="flex-1 min-w-0 border-gray-300 dark:border-gray-600"
          disabled={isLoading}
        />

        {/* Send Button */}
        <Button
          onClick={onSendMessage}
          disabled={!messageText.trim() || isLoading}
          size="sm"
          className="bg-[#FF007F] hover:bg-[#FF007F]/90 text-white flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}