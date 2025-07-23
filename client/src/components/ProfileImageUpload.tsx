import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, X, Camera, ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProfileImageUploadProps {
  currentImage?: string;
  additionalImages?: string[];
  onImageUpload: (imageUrl: string, isMainImage: boolean) => void;
  onImageDelete: (imageUrl: string, isMainImage: boolean) => void;
  maxImages?: number;
  isTransUser?: boolean;
}

export function ProfileImageUpload({
  currentImage,
  additionalImages = [],
  onImageUpload,
  onImageDelete,
  maxImages = 6,
  isTransUser = false
}: ProfileImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>, isMainImage = false) => {
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

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Datei zu groß",
        description: "Bitte wähle ein Bild unter 5MB aus.",
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
        onImageUpload(imageUrl, isMainImage);
        setUploading(false);
        
        toast({
          title: "Bild hochgeladen",
          description: isMainImage ? "Profilbild wurde aktualisiert." : "Bild wurde hinzugefügt.",
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload fehlgeschlagen",
        description: "Bild konnte nicht hochgeladen werden.",
        variant: "destructive",
      });
      setUploading(false);
    }

    // Reset input
    event.target.value = '';
  };

  const handleDeleteImage = (imageUrl: string, isMainImage: boolean) => {
    onImageDelete(imageUrl, isMainImage);
    toast({
      title: "Bild gelöscht",
      description: isMainImage ? "Profilbild wurde entfernt." : "Bild wurde entfernt.",
    });
  };

  const totalImages = additionalImages.length + (currentImage ? 1 : 0);
  const canAddMore = totalImages < maxImages;

  if (!isTransUser) {
    return null; // Only trans users can upload multiple images
  }

  return (
    <div className="space-y-4">
      {/* Main Profile Image */}
      <div>
        <h4 className="font-medium mb-2">Profilbild</h4>
        <div className="flex items-center gap-4">
          {currentImage ? (
            <div className="relative">
              <img
                src={currentImage}
                alt="Profilbild"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                onClick={() => handleDeleteImage(currentImage, true)}
              >
                <X className="w-3 h-3" />
              </Button>
              <Badge className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-[#FF007F] text-white text-xs">
                Haupt
              </Badge>
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
          )}
          
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="mb-2"
            >
              <Camera className="w-4 h-4 mr-2" />
              {currentImage ? 'Ändern' : 'Hochladen'}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileSelect(e, true)}
              className="hidden"
            />
            <p className="text-xs text-gray-500">
              Empfohlen: Quadratisches Bild, max. 5MB
            </p>
          </div>
        </div>
      </div>

      {/* Additional Images */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium">Weitere Bilder ({additionalImages.length}/{maxImages - 1})</h4>
          {canAddMore && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e) => handleFileSelect(e as any, false);
                input.click();
              }}
              disabled={uploading}
            >
              <Upload className="w-4 h-4 mr-2" />
              Hinzufügen
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          {additionalImages.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <img
                src={imageUrl}
                alt={`Zusatzbild ${index + 1}`}
                className="w-full aspect-square object-cover rounded-lg border border-gray-200"
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleDeleteImage(imageUrl, false)}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
          
          {/* Add more slots if under limit */}
          {canAddMore && additionalImages.length < maxImages - 1 && (
            <div 
              className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-[#FF007F] transition-colors"
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e) => handleFileSelect(e as any, false);
                input.click();
              }}
            >
              <Upload className="w-6 h-6 text-gray-400" />
            </div>
          )}
        </div>
        
        <p className="text-xs text-gray-500 mt-2">
          Zeige deine besten Bilder. Kunden können alle deine Bilder in deinem Profil sehen.
        </p>
      </div>
      
      {uploading && (
        <div className="text-center py-2">
          <div className="inline-flex items-center">
            <div className="animate-spin w-4 h-4 border-2 border-[#FF007F] border-t-transparent rounded-full mr-2" />
            <span className="text-sm text-gray-600">Bild wird hochgeladen...</span>
          </div>
        </div>
      )}
    </div>
  );
}