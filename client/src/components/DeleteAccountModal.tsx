import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface DeleteAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteAccountModal({ open, onOpenChange }: DeleteAccountModalProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (confirmationText !== 'LÖSCHEN') {
      toast({
        title: "Fehler",
        description: "Bitte gib 'LÖSCHEN' ein, um dein Konto zu löschen.",
        variant: "destructive",
      });
      return;
    }

    if (!password) {
      toast({
        title: "Fehler",
        description: "Bitte gib dein Passwort ein.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await apiRequest('DELETE', '/api/auth/delete-account', {
        password,
        confirmation: confirmationText
      });

      toast({
        title: "Konto gelöscht",
        description: "Dein Konto wurde erfolgreich gelöscht.",
      });

      // Force logout and redirect
      window.location.href = '/';
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message || "Konto konnte nicht gelöscht werden.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Konto löschen
          </DialogTitle>
        </DialogHeader>
        
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Warnung:</strong> Diese Aktion kann nicht rückgängig gemacht werden. 
            Alle deine Daten, Nachrichten, Fotos und dein Profil werden permanent gelöscht.
          </AlertDescription>
        </Alert>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="confirmationText">
              Gib "LÖSCHEN" ein, um zu bestätigen
            </Label>
            <Input
              id="confirmationText"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder="LÖSCHEN"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Dein Passwort zur Bestätigung</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Abbrechen
            </Button>
            <Button
              type="submit"
              variant="destructive"
              className="flex-1"
              disabled={isLoading || confirmationText !== 'LÖSCHEN'}
            >
              {isLoading ? "Wird gelöscht..." : "Konto löschen"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}