import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Users, Shield, Image, Crown, Ban, CheckCircle, XCircle, Eye, Trash2, UserPlus, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import AdminProtection from "@/components/AdminProtection";

interface User {
  id: string;
  email: string;
  username: string;
  userType: 'trans' | 'man';
  isPremium: boolean;
  isBlocked: boolean;
  isAdmin: boolean;
  profileImageUrl?: string;
  city?: string;
  age?: number;
  createdAt: string;
  lastActive?: string;
  premiumExpiresAt?: string;
}

interface ImageModerationItem {
  id: string;
  imageUrl: string;
  userId: string;
  username: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadedAt: string;
  moderatedAt?: string;
  moderatedBy?: string;
  rejectionReason?: string;
}

interface AdminStats {
  totalUsers: number;
  transUsers: number;
  manUsers: number;
  premiumUsers: number;
  blockedUsers: number;
  pendingImages: number;
  activeChats: number;
}

interface AdminLog {
  id: string;
  adminId: string;
  adminUsername: string;
  action: string;
  targetType: string;
  targetId: string;
  details: string;
  createdAt: string;
}

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch admin data
  const { data: stats = {} as AdminStats } = useQuery<AdminStats>({
    queryKey: ['/api/admin/stats'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const users = useQuery({
    queryKey: ['/api/admin/users'],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  const { data: pendingImages = [] } = useQuery<ImageModerationItem[]>({
    queryKey: ['/api/admin/images/pending'],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const { data: logs = [] } = useQuery<AdminLog[]>({
    queryKey: ['/api/admin/logs'],
    refetchInterval: 15000, // Refresh every 15 seconds
  });

  // Mutations
  const updateUserMutation = useMutation({
    mutationFn: async (data: { userId: string; updates: Partial<User> }) => {
      console.log("updateUserMutation sending:", data);
      const response = await fetch(`/api/admin/users/${data.userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data.updates)
      });
      
      if (!response.ok) {
        const error = await response.text();
        console.error("Update user error:", error);
        throw new Error(error);
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      toast({ title: "Benutzer aktualisiert", description: "Änderungen wurden erfolgreich gespeichert." });
      setIsUserDialogOpen(false);
    },
    onError: (error) => {
      console.error("Update user mutation error:", error);
      toast({ title: "Fehler", description: "Benutzer konnte nicht aktualisiert werden.", variant: "destructive" });
    }
  });

  const blockUserMutation = useMutation({
    mutationFn: (data: { userId: string; reason: string }) =>
      apiRequest(`/api/admin/users/${data.userId}/block`, "POST", { reason: data.reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      toast({ title: "Benutzer blockiert", description: "Der Benutzer wurde erfolgreich blockiert." });
    },
  });

  const unblockUserMutation = useMutation({
    mutationFn: (userId: string) =>
      apiRequest(`/api/admin/users/${userId}/unblock`, "POST"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      toast({ title: "Benutzer entsperrt", description: "Der Benutzer wurde erfolgreich entsperrt." });
    },
  });

  const activatePremiumMutation = useMutation({
    mutationFn: async (data: { userId: string; days: number }) => {
      console.log("activatePremiumMutation sending:", data);
      const response = await fetch(`/api/admin/users/${data.userId}/premium/activate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ days: data.days })
      });
      
      if (!response.ok) {
        const error = await response.text();
        console.error("Activate premium error:", error);
        throw new Error(error);
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      toast({ title: "Premium aktiviert", description: "Premium-Status wurde erfolgreich aktiviert." });
    },
    onError: (error) => {
      console.error("Activate premium mutation error:", error);
      toast({ title: "Fehler", description: "Premium konnte nicht aktiviert werden.", variant: "destructive" });
    }
  });

  const deactivatePremiumMutation = useMutation({
    mutationFn: (userId: string) =>
      apiRequest(`/api/admin/users/${userId}/premium/deactivate`, "POST"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      toast({ title: "Premium deaktiviert", description: "Premium-Status wurde erfolgreich deaktiviert." });
    },
  });

  const approveImageMutation = useMutation({
    mutationFn: (imageId: string) =>
      apiRequest(`/api/admin/images/${imageId}/approve`, "POST"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/images/pending'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      toast({ title: "Bild genehmigt", description: "Das Bild wurde erfolgreich genehmigt." });
      // Move to next image
      if (currentImageIndex < pendingImages.length - 1) {
        setCurrentImageIndex(currentImageIndex + 1);
      }
    },
  });

  const rejectImageMutation = useMutation({
    mutationFn: (data: { imageId: string; reason: string }) =>
      apiRequest(`/api/admin/images/${data.imageId}/reject`, "POST", { reason: data.reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/images/pending'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      toast({ title: "Bild abgelehnt", description: "Das Bild wurde erfolgreich abgelehnt." });
      // Move to next image
      if (currentImageIndex < pendingImages.length - 1) {
        setCurrentImageIndex(currentImageIndex + 1);
      }
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (data: { userId: string; reason: string }) => {
      console.log("deleteUserMutation sending:", data);
      const response = await fetch(`/api/admin/users/${data.userId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ reason: data.reason })
      });
      
      if (!response.ok) {
        const error = await response.text();
        console.error("Delete user error:", error);
        throw new Error(error);
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      toast({ title: "Benutzer gelöscht", description: "Der Benutzer wurde erfolgreich gelöscht." });
      setIsUserDialogOpen(false);
    },
    onError: (error) => {
      console.error("Delete user mutation error:", error);
      toast({ title: "Fehler", description: "Benutzer konnte nicht gelöscht werden.", variant: "destructive" });
    }
  });

  const handleSwipeApprove = () => {
    if (pendingImages[currentImageIndex]) {
      approveImageMutation.mutate(pendingImages[currentImageIndex].id);
    }
  };

  const handleSwipeReject = () => {
    const reason = prompt("Grund für Ablehnung eingeben:");
    if (reason && pendingImages[currentImageIndex]) {
      rejectImageMutation.mutate({
        imageId: pendingImages[currentImageIndex].id,
        reason
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AdminProtection>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              TransEscorta Verwaltung
            </p>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            <Shield className="w-4 h-4 mr-1" />
            Administrator
          </Badge>
        </div>

        {/* Stats Cards */}
        {stats.totalUsers !== undefined && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Gesamt Benutzer</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.transUsers} Trans, {stats.manUsers} Männer
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Premium Benutzer</CardTitle>
                <Crown className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.premiumUsers}</div>
                <p className="text-xs text-muted-foreground">
                  Aktive Premium-Mitgliedschaften
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Blockierte Benutzer</CardTitle>
                <Ban className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.blockedUsers}</div>
                <p className="text-xs text-muted-foreground">
                  Gesperrte Accounts
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bilder Moderation</CardTitle>
                <Image className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingImages}</div>
                <p className="text-xs text-muted-foreground">
                  Warten auf Freigabe
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">Benutzer</TabsTrigger>
            <TabsTrigger value="moderation">Bild Moderation</TabsTrigger>
            <TabsTrigger value="logs">Aktivitäts-Log</TabsTrigger>
            <TabsTrigger value="settings">Einstellungen</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Benutzerverwaltung</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.data?.users?.length > 0 ? users.data.users.map((user: User) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <img
                          src={user.profileImageUrl || "/placeholder-avatar.png"}
                          alt={user.username}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{user.username}</h3>
                            {user.isPremium && <Crown className="w-4 h-4 text-yellow-500" />}
                            {user.isAdmin && <Shield className="w-4 h-4 text-blue-500" />}
                            {user.isBlocked && <Ban className="w-4 h-4 text-red-500" />}
                          </div>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>{user.userType === 'trans' ? 'Trans' : 'Mann'}</span>
                            <span>{user.city}</span>
                            <span>{user.age} Jahre</span>
                            <span>Seit: {formatDate(user.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setIsUserDialogOpen(true);
                          }}
                        >
                          <Settings className="w-4 h-4 mr-1" />
                          Bearbeiten
                        </Button>
                        {user.isBlocked ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => unblockUserMutation.mutate(user.id)}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Entsperren
                          </Button>
                        ) : (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              const reason = prompt("Grund für Blockierung eingeben:");
                              if (reason) {
                                blockUserMutation.mutate({ userId: user.id, reason });
                              }
                            }}
                          >
                            <Ban className="w-4 h-4 mr-1" />
                            Blockieren
                          </Button>
                        )}
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-gray-500">
                      Keine Benutzer gefunden
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="moderation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Bild Moderation - Tinder Swipe Style</CardTitle>
                <p className="text-sm text-gray-600">
                  {pendingImages.length > 0 
                    ? `Bild ${currentImageIndex + 1} von ${pendingImages.length}` 
                    : "Keine Bilder zur Moderation vorhanden"}
                </p>
              </CardHeader>
              <CardContent>
                {pendingImages.length > 0 && pendingImages[currentImageIndex] ? (
                  <div className="max-w-md mx-auto">
                    <div className="relative">
                      <img
                        src={pendingImages[currentImageIndex].imageUrl}
                        alt="Zu moderierendes Bild"
                        className="w-full h-96 object-cover rounded-lg shadow-lg"
                      />
                      <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded-full text-sm">
                        {pendingImages[currentImageIndex].username}
                      </div>
                      <div className="absolute top-4 right-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded-full text-sm">
                        {formatDate(pendingImages[currentImageIndex].uploadedAt)}
                      </div>
                    </div>
                    
                    <div className="flex justify-center space-x-4 mt-6">
                      <Button
                        variant="destructive"
                        size="lg"
                        onClick={handleSwipeReject}
                        className="flex-1"
                      >
                        <XCircle className="w-5 h-5 mr-2" />
                        Ablehnen
                      </Button>
                      <Button
                        variant="default"
                        size="lg"
                        onClick={handleSwipeApprove}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Genehmigen
                      </Button>
                    </div>

                    <div className="flex justify-center space-x-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
                        disabled={currentImageIndex === 0}
                      >
                        Vorheriges
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentImageIndex(Math.min(pendingImages.length - 1, currentImageIndex + 1))}
                        disabled={currentImageIndex === pendingImages.length - 1}
                      >
                        Nächstes
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Image className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Keine Bilder zur Moderation
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Aktuell sind keine Bilder zur Freigabe vorhanden.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Admin Aktivitäts-Log</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {logs.length > 0 ? logs.map((log: AdminLog) => (
                    <div key={log.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">{log.adminUsername}</span>
                          <Badge variant="secondary" className="text-xs">
                            {log.action}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{log.details}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(log.createdAt)}
                        </p>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-gray-500">
                      Keine Admin-Aktivitäten vorhanden
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Einstellungen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Plattform Limits</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Premium Escorts (Max)</Label>
                        <Input type="number" defaultValue="6" className="mt-1" />
                      </div>
                      <div>
                        <Label>Neue Escorts (Max)</Label>
                        <Input type="number" defaultValue="4" className="mt-1" />
                      </div>
                      <div>
                        <Label>Escorts pro Standort (Max)</Label>
                        <Input type="number" defaultValue="40" className="mt-1" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Auto-Moderation</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Auto-Gesichtserkennung</Label>
                          <p className="text-sm text-gray-600">Bilder ohne Gesichter automatisch ablehnen</p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>NSFW-Filter</Label>
                          <p className="text-sm text-gray-600">Explizite Inhalte automatisch markieren</p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>

                  <Button className="w-full md:w-auto">
                    Einstellungen speichern
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* User Edit Dialog */}
        <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Benutzer bearbeiten: {selectedUser?.username}</DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Benutzername</Label>
                    <Input 
                      defaultValue={selectedUser.username}
                      onChange={(e) => setSelectedUser({...selectedUser, username: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>E-Mail</Label>
                    <Input 
                      defaultValue={selectedUser.email}
                      onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Benutzertyp</Label>
                    <Select 
                      defaultValue={selectedUser.userType}
                      onValueChange={(value: 'trans' | 'man') => setSelectedUser({...selectedUser, userType: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="trans">Trans</SelectItem>
                        <SelectItem value="man">Mann</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Stadt</Label>
                    <Input 
                      defaultValue={selectedUser.city || ''}
                      onChange={(e) => setSelectedUser({...selectedUser, city: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Premium Status</Label>
                      <p className="text-sm text-gray-600">
                        {selectedUser.isPremium ? 
                          `Aktiv bis: ${selectedUser.premiumExpiresAt ? formatDate(selectedUser.premiumExpiresAt) : 'Unbekannt'}` : 
                          'Nicht aktiv'
                        }
                      </p>
                    </div>
                    <div className="space-x-2">
                      {selectedUser.isPremium ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deactivatePremiumMutation.mutate(selectedUser.id)}
                        >
                          Premium deaktivieren
                        </Button>
                      ) : (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => activatePremiumMutation.mutate({ userId: selectedUser.id, days: 30 })}
                        >
                          Premium aktivieren (30 Tage)
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Admin Status</Label>
                      <p className="text-sm text-gray-600">Admin-Berechtigung gewähren</p>
                    </div>
                    <Switch 
                      checked={selectedUser.isAdmin}
                      onCheckedChange={(checked) => setSelectedUser({...selectedUser, isAdmin: checked})}
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="destructive"
                    onClick={() => {
                      const reason = prompt("Grund für Löschung eingeben:");
                      if (reason) {
                        deleteUserMutation.mutate({ userId: selectedUser.id, reason });
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Benutzer löschen
                  </Button>
                  <div className="space-x-2">
                    <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>
                      Abbrechen
                    </Button>
                    <Button 
                      onClick={() => {
                        console.log("Saving user:", selectedUser);
                        updateUserMutation.mutate({ 
                          userId: selectedUser.id, 
                          updates: selectedUser 
                        });
                      }}
                      disabled={updateUserMutation.isPending}
                    >
                      {updateUserMutation.isPending ? "Speichert..." : "Speichern"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
    </AdminProtection>
  );
}