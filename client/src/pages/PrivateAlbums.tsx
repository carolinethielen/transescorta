import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Image as ImageIcon, 
  Trash2, 
  Upload, 
  Crown,
  ArrowLeft,
  Calendar,
  Eye,
  Share2
} from 'lucide-react';

const createAlbumSchema = z.object({
  title: z.string().min(1, 'Album-Titel ist erforderlich'),
  description: z.string().optional(),
});

type CreateAlbumForm = z.infer<typeof createAlbumSchema>;

interface PrivateAlbum {
  id: string;
  title: string;
  description?: string;
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  email: string;
  firstName?: string;
  userType: 'trans' | 'man';
  isPremium: boolean;
}

export default function PrivateAlbums() {
  const [selectedAlbum, setSelectedAlbum] = useState<PrivateAlbum | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch current user to check premium status
  const { data: currentUser } = useQuery<User>({
    queryKey: ['/api/auth/user'],
  });

  // Fetch user's private albums
  const { data: albums = [], isLoading } = useQuery<PrivateAlbum[]>({
    queryKey: ['/api/private-albums'],
    enabled: !!currentUser,
  });

  const createForm = useForm<CreateAlbumForm>({
    resolver: zodResolver(createAlbumSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const createAlbumMutation = useMutation({
    mutationFn: async (data: CreateAlbumForm) => {
      const response = await fetch('/api/private-albums', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Album erstellen fehlgeschlagen');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Album erstellt!',
        description: 'Dein privates Album wurde erfolgreich erstellt.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/private-albums'] });
      setIsCreateOpen(false);
      createForm.reset();
    },
    onError: (error: any) => {
      toast({
        title: 'Fehler',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const uploadImagesMutation = useMutation({
    mutationFn: async ({ albumId, files }: { albumId: string; files: File[] }) => {
      const formData = new FormData();
      files.forEach(file => formData.append('images', file));
      
      const response = await fetch(`/api/private-albums/${albumId}/upload`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Bilder hochladen fehlgeschlagen');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Bilder hochgeladen!',
        description: 'Deine Bilder wurden erfolgreich hinzugefügt.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/private-albums'] });
      setUploadingFiles([]);
    },
    onError: (error: any) => {
      toast({
        title: 'Upload-Fehler',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteAlbumMutation = useMutation({
    mutationFn: async (albumId: string) => {
      const response = await fetch(`/api/private-albums/${albumId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Album löschen fehlgeschlagen');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Album gelöscht',
        description: 'Das Album wurde erfolgreich entfernt.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/private-albums'] });
      setSelectedAlbum(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Fehler',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const canCreateMoreAlbums = currentUser?.isPremium || albums.length === 0;
  const maxImagesPerAlbum = currentUser?.isPremium ? undefined : 5;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!selectedAlbum) return;

    const currentImageCount = selectedAlbum.imageUrls.length;
    const remainingSlots = maxImagesPerAlbum ? maxImagesPerAlbum - currentImageCount : Infinity;
    
    if (!currentUser?.isPremium && files.length > remainingSlots) {
      toast({
        title: 'Limit erreicht',
        description: `Du kannst nur noch ${remainingSlots} Bilder hinzufügen. Upgrade auf Premium für unbegrenzte Uploads.`,
        variant: 'destructive',
      });
      return;
    }

    setUploadingFiles(files);
    uploadImagesMutation.mutate({ albumId: selectedAlbum.id, files });
  };

  if (!currentUser || currentUser.userType !== 'trans') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Private Alben sind nur für Trans-Escort-Profile verfügbar.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="bg-gray-200 h-32 rounded mb-4"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-3 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/my-profile">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück zum Profil
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Private Alben</h1>
            <p className="text-muted-foreground">
              Erstelle private Alben und teile sie im Chat für 24 Stunden
            </p>
          </div>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button 
              disabled={!canCreateMoreAlbums}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {albums.length === 0 ? 'Erstes Album erstellen' : 'Neues Album'}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Neues privates Album</DialogTitle>
            </DialogHeader>
            <Form {...createForm}>
              <form onSubmit={createForm.handleSubmit(data => createAlbumMutation.mutate(data))} className="space-y-4">
                <FormField
                  control={createForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Album-Titel</FormLabel>
                      <FormControl>
                        <Input placeholder="z.B. Besondere Fotos" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={createForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Beschreibung (optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Beschreibe dein Album..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsCreateOpen(false)}
                  >
                    Abbrechen
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createAlbumMutation.isPending}
                  >
                    {createAlbumMutation.isPending ? 'Erstelle...' : 'Album erstellen'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {!canCreateMoreAlbums && (
        <Card className="mb-6 border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Crown className="w-5 h-5 text-amber-600" />
                <div>
                  <p className="font-medium text-amber-800">
                    Du hast bereits dein kostenloses Album erstellt
                  </p>
                  <p className="text-sm text-amber-600">
                    Upgrade auf Premium für unbegrenzte private Alben
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Premium werden
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="albums" className="w-full">
        <TabsList>
          <TabsTrigger value="albums">Meine Alben ({albums.length})</TabsTrigger>
          <TabsTrigger value="shared">Geteilte Alben</TabsTrigger>
        </TabsList>

        <TabsContent value="albums" className="mt-6">
          {albums.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">Noch keine privaten Alben</p>
                <p className="text-muted-foreground mb-4">
                  Erstelle dein erstes privates Album um exklusive Fotos mit Kunden zu teilen
                </p>
                <Button onClick={() => setIsCreateOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Erstes Album erstellen
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.map((album: PrivateAlbum) => (
                <Card 
                  key={album.id} 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedAlbum(album)}
                >
                  <CardContent className="p-4">
                    <div className="aspect-video bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                      {album.imageUrls.length > 0 ? (
                        <img 
                          src={album.imageUrls[0]} 
                          alt={album.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      )}
                      <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                        {album.imageUrls.length} Fotos
                      </div>
                    </div>
                    
                    <h3 className="font-semibold mb-1 truncate">{album.title}</h3>
                    {album.description && (
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {album.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(album.createdAt).toLocaleDateString('de-DE')}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        Privat
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="shared" className="mt-6">
          <Card>
            <CardContent className="pt-6 text-center">
              <Share2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">Geteilte Alben</p>
              <p className="text-muted-foreground">
                Hier siehst du, welche Alben du geteilt hast und wie lange sie noch zugänglich sind
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Album Detail Modal */}
      {selectedAlbum && (
        <Dialog open={!!selectedAlbum} onOpenChange={() => setSelectedAlbum(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{selectedAlbum.title}</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('file-upload')?.click()}
                    disabled={uploadImagesMutation.isPending}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploadImagesMutation.isPending ? 'Lädt hoch...' : 'Bilder hinzufügen'}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteAlbumMutation.mutate(selectedAlbum.id)}
                    disabled={deleteAlbumMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </DialogTitle>
            </DialogHeader>

            <input
              id="file-upload"
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />

            {selectedAlbum.description && (
              <p className="text-muted-foreground mb-4">{selectedAlbum.description}</p>
            )}

            {!currentUser?.isPremium && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-amber-800">
                  <Crown className="w-4 h-4 inline mr-1" />
                  Kostenlos: Maximal {maxImagesPerAlbum} Bilder pro Album. 
                  <strong> Premium: Unbegrenzte Bilder.</strong>
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {selectedAlbum.imageUrls.map((imageUrl, index) => (
                <div key={index} className="aspect-square relative group">
                  <img
                    src={imageUrl}
                    alt={`${selectedAlbum.title} ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Implement image removal
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {selectedAlbum.imageUrls.length === 0 && (
                <div className="col-span-full text-center py-8">
                  <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">Noch keine Bilder in diesem Album</p>
                  <Button onClick={() => document.getElementById('file-upload')?.click()}>
                    <Upload className="w-4 h-4 mr-2" />
                    Erste Bilder hinzufügen
                  </Button>
                </div>
              )}
            </div>

            {selectedAlbum.imageUrls.length > 0 && (
              <div className="mt-6 pt-4 border-t">
                <h4 className="font-medium mb-3">Album teilen</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Du kannst dieses Album im Chat mit Kunden teilen. Sie haben dann 24 Stunden Zugriff darauf.
                </p>
                <Button disabled>
                  <Share2 className="w-4 h-4 mr-2" />
                  Im Chat teilen (bald verfügbar)
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}