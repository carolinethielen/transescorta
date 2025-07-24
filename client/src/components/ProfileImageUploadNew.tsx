import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Upload, X, Star, Image as ImageIcon, Plus } from 'lucide-react';

interface ProfileImageUploadProps {
  currentMainImage?: string;
  currentImages?: string[];
  onImageUpdate?: (mainImage: string | null, additionalImages: string[]) => void;
}

export function ProfileImageUploadNew({ 
  currentMainImage, 
  currentImages = [], 
  onImageUpdate 
}: ProfileImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [mainImage, setMainImage] = useState<string | null>(currentMainImage || null);
  const [additionalImages, setAdditionalImages] = useState<string[]>(currentImages);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('/api/upload/profile-image', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      const imageUrl = data.imageUrl;
      
      if (!mainImage) {
        // If no main image, set this as main image
        setMainImage(imageUrl);
        onImageUpdate?.(imageUrl, additionalImages);
      } else if (additionalImages.length < 4) {
        // Add to additional images (max 4 additional + 1 main = 5 total)
        const newAdditionalImages = [...additionalImages, imageUrl];
        setAdditionalImages(newAdditionalImages);
        onImageUpdate?.(mainImage, newAdditionalImages);
      }
      
      toast({
        title: "Bild erfolgreich hochgeladen",
        description: "Das Bild wurde zu deinem Profil hinzugefügt",
      });
      
      // Invalidate user profile cache
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
    },
    onError: (error) => {
      console.error('Upload error:', error);
      toast({
        title: "Upload fehlgeschlagen",
        description: "Das Bild konnte nicht hochgeladen werden. Versuche es erneut.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setUploading(false);
    }
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Ungültiger Dateityp",
        description: "Bitte wähle eine Bilddatei aus (JPG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Datei zu groß",
        description: "Das Bild darf maximal 5MB groß sein",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    uploadMutation.mutate(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (imageUrl: string, isMainImage: boolean) => {
    if (isMainImage) {
      // Remove main image, promote first additional image if available
      const newMainImage = additionalImages.length > 0 ? additionalImages[0] : null;
      const newAdditionalImages = additionalImages.slice(1);
      setMainImage(newMainImage);
      setAdditionalImages(newAdditionalImages);
      onImageUpdate?.(newMainImage, newAdditionalImages);
    } else {
      // Remove from additional images
      const newAdditionalImages = additionalImages.filter(img => img !== imageUrl);
      setAdditionalImages(newAdditionalImages);
      onImageUpdate?.(mainImage, newAdditionalImages);
    }

    toast({
      title: "Bild entfernt",
      description: "Das Bild wurde aus deinem Profil entfernt",
    });
  };

  const setAsMainImage = (imageUrl: string) => {
    if (mainImage) {
      // Swap main image with selected additional image
      const newAdditionalImages = additionalImages.map(img => 
        img === imageUrl ? mainImage : img
      );
      setMainImage(imageUrl);
      setAdditionalImages(newAdditionalImages);
      onImageUpdate?.(imageUrl, newAdditionalImages);
    }

    toast({
      title: "Hauptbild geändert",
      description: "Das Bild wurde als Hauptbild festgelegt",
    });
  };

  const totalImages = (mainImage ? 1 : 0) + additionalImages.length;
  const canUploadMore = totalImages < 5;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Profilbilder</h3>
        <span className="text-sm text-muted-foreground">
          {totalImages} / 5 Bilder
        </span>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {/* Main Image */}
        {mainImage && (
          <Card className="relative group">
            <CardContent className="p-2">
              <div className="relative aspect-square">
                <img
                  src={mainImage}
                  alt="Hauptbild"
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute top-2 left-2">
                  <div className="bg-[#FF007F] text-white px-2 py-1 rounded text-xs font-medium flex items-center">
                    <Star className="w-3 h-3 mr-1" />
                    Hauptbild
                  </div>
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="destructive"
                    size="icon"
                    className="w-6 h-6"
                    onClick={() => removeImage(mainImage, true)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Additional Images */}
        {additionalImages.map((imageUrl, index) => (
          <Card key={imageUrl} className="relative group">
            <CardContent className="p-2">
              <div className="relative aspect-square">
                <img
                  src={imageUrl}
                  alt={`Bild ${index + 2}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg" />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity space-x-1">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="w-6 h-6"
                    onClick={() => setAsMainImage(imageUrl)}
                    title="Als Hauptbild setzen"
                  >
                    <Star className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="w-6 h-6"
                    onClick={() => removeImage(imageUrl, false)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Upload Button */}
        {canUploadMore && (
          <Card 
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <CardContent className="p-2 h-full">
              <div className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg hover:border-[#FF007F]/50 transition-colors">
                {uploading ? (
                  <div className="animate-spin w-8 h-8 border-4 border-[#FF007F] border-t-transparent rounded-full" />
                ) : (
                  <>
                    <Plus className="w-8 h-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground text-center">
                      Bild hinzufügen
                    </span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Upload Instructions */}
      <div className="text-sm text-muted-foreground space-y-1">
        <p>• Maximal 5 Bilder pro Profil</p>
        <p>• Unterstützte Formate: JPG, PNG, GIF</p>
        <p>• Maximale Dateigröße: 5MB</p>
        <p>• Das erste Bild wird als Hauptbild verwendet</p>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading || !canUploadMore}
      />
    </div>
  );
}