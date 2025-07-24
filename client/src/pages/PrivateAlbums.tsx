import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  ArrowLeft, 
  Plus, 
  Image as ImageIcon, 
  Lock, 
  Unlock, 
  Share, 
  Trash2,
  Upload
} from 'lucide-react';
import { useLocation } from 'wouter';

export default function PrivateAlbums() {
  const [location, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<any>(null);

  // Form state for creating albums
  const [albumForm, setAlbumForm] = useState({
    title: '',
    description: '',
    isPublic: false,
  });

  // Fetch user's private albums
  const { data: albums = [], isLoading } = useQuery<any[]>({
    queryKey: ['/api/albums/my'],
    enabled: !!user,
  });

  // Create album mutation
  const createAlbumMutation = useMutation({
    mutationFn: async (albumData: any) => {
      return await apiRequest('/api/albums', 'POST', albumData);
    },
    onSuccess: () => {
      toast({
        title: "Album erstellt",
        description: "Dein privates Album wurde erfolgreich erstellt",
      });
      setIsCreateDialogOpen(false);
      setAlbumForm({ title: '', description: '', isPublic: false });
      queryClient.invalidateQueries({ queryKey: ['/api/albums/my'] });
    },
    onError: (error) => {
      toast({
        title: "Fehler",
        description: "Album konnte nicht erstellt werden",
        variant: "destructive",
      });
    },
  });

  // Grant access mutation
  const grantAccessMutation = useMutation({
    mutationFn: async ({ albumId, userId }: { albumId: string; userId: string }) => {
      return await apiRequest(`/api/albums/${albumId}/access`, 'POST', { userId });
    },
    onSuccess: () => {
      toast({
        title: "Zugriff gewährt",
        description: "Der Kunde kann jetzt auf dein privates Album zugreifen",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/albums/my'] });
    },
  });

  const handleCreateAlbum = () => {
    if (!albumForm.title.trim()) {
      toast({
        title: "Fehler",
        description: "Bitte gib einen Titel für das Album ein",
        variant: "destructive",
      });
      return;
    }
    createAlbumMutation.mutate(albumForm);
  };

  const handleGrantAccess = (albumId: string, userId: string) => {
    grantAccessMutation.mutate({ albumId, userId });
  };

  if (!user || user.userType !== 'trans') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader>
            <CardTitle className="text-center">Nur für Escorts</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Diese Funktion ist nur für Trans-Escorts verfügbar.
            </p>
            <Button onClick={() => navigate('/')}>Zurück zur Startseite</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h1 className="text-xl font-semibold">Private Alben</h1>
            </div>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Neues Album
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Privates Album erstellen</DialogTitle>
                  <DialogDescription>
                    Erstellen Sie ein neues privates Album für exklusive Inhalte
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Titel</label>
                    <Input
                      value={albumForm.title}
                      onChange={(e) => setAlbumForm({ ...albumForm, title: e.target.value })}
                      placeholder="z.B. Exklusive Fotos, Sexy Outfits..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Beschreibung</label>
                    <Textarea
                      value={albumForm.description}
                      onChange={(e) => setAlbumForm({ ...albumForm, description: e.target.value })}
                      placeholder="Beschreibe dein Album..."
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                      className="flex-1"
                    >
                      Abbrechen
                    </Button>
                    <Button
                      onClick={handleCreateAlbum}
                      disabled={createAlbumMutation.isPending}
                      className="flex-1"
                    >
                      Album erstellen
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-t-lg"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : albums.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Noch keine Alben</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Erstelle dein erstes privates Album und teile exklusive Inhalte mit ausgewählten Kunden.
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Erstes Album erstellen
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album: any) => (
              <Card key={album.id} className="group hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-pink-500 to-purple-600 rounded-t-lg flex items-center justify-center relative overflow-hidden">
                  {album.imageUrls?.length > 0 ? (
                    <img
                      src={album.imageUrls[0]}
                      alt={album.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-12 h-12 text-white/80" />
                  )}
                  
                  {/* Privacy indicator */}
                  <div className="absolute top-2 right-2">
                    {album.isPublic ? (
                      <Badge variant="secondary" className="bg-green-500 text-white">
                        <Unlock className="w-3 h-3 mr-1" />
                        Öffentlich
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-gray-800 text-white">
                        <Lock className="w-3 h-3 mr-1" />
                        Privat
                      </Badge>
                    )}
                  </div>

                  {/* Image count */}
                  {album.imageUrls?.length > 0 && (
                    <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                      {album.imageUrls.length} Fotos
                    </div>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 truncate">{album.title}</h3>
                  {album.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                      {album.description}
                    </p>
                  )}
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedAlbum(album)}
                      className="flex-1"
                    >
                      <Share className="w-4 h-4 mr-1" />
                      Teilen
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/albums/${album.id}/edit`)}
                    >
                      <Upload className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}