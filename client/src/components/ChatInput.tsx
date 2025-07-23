import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Paperclip, Image as ImageIcon, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChatInputProps {
  onSendMessage: (content: string, messageType?: 'text' | 'image', imageUrl?: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSendMessage, disabled = false, placeholder = "Nachricht schreiben..." }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSend = () => {
    if (selectedImage) {
      // Send image with optional caption
      onSendMessage(message.trim(), 'image', selectedImage);
      setSelectedImage(null);
      setMessage('');
    } else if (message.trim()) {
      // Send text message
      onSendMessage(message.trim(), 'text');
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Ungültiger Dateityp",
        description: "Bitte wähle eine Bilddatei aus.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 10MB for chat)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Datei zu groß", 
        description: "Bitte wähle ein Bild unter 10MB aus.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Convert to base64 for now (in production, upload to cloud storage)
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setSelectedImage(imageUrl);
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Image processing error:', error);
      toast({
        title: "Fehler beim Verarbeiten",
        description: "Bild konnte nicht verarbeitet werden.",
        variant: "destructive",
      });
      setUploading(false);
    }

    // Reset input
    event.target.value = '';
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
  };

  return (
    <div className="flex-shrink-0 border-t bg-white dark:bg-gray-900 p-4 sticky bottom-0">
      {/* Image Preview */}
      {selectedImage && (
        <div className="mb-3 relative inline-block">
          <img
            src={selectedImage}
            alt="Zu sendendes Bild"
            className="max-w-32 max-h-32 rounded-lg object-cover border border-gray-200"
          />
          <Button
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
            onClick={removeSelectedImage}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}

      <div className="flex items-end gap-2">
        {/* File Upload Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || uploading}
          className="flex-shrink-0 p-2"
        >
          <ImageIcon className="w-5 h-5" />
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />

        {/* Message Input */}
        <div className="flex-1">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={selectedImage ? "Bildunterschrift (optional)..." : placeholder}
            disabled={disabled || uploading}
            className="resize-none border-gray-200 focus:border-[#FF007F]"
          />
        </div>

        {/* Send Button */}
        <Button
          onClick={handleSend}
          disabled={disabled || uploading || (!message.trim() && !selectedImage)}
          size="sm"
          className="flex-shrink-0 bg-[#FF007F] hover:bg-[#E6006B] text-white"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>

      {uploading && (
        <div className="mt-2 text-center">
          <div className="inline-flex items-center text-sm text-gray-600">
            <div className="animate-spin w-4 h-4 border-2 border-[#FF007F] border-t-transparent rounded-full mr-2" />
            Bild wird verarbeitet...
          </div>
        </div>
      )}
    </div>
  );
}