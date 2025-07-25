import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ProfileImageUpload } from '@/components/ProfileImageUpload';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { apiRequest } from '@/lib/queryClient';
import { updateProfileSchema } from '@shared/schema';
import { ArrowLeft, Save, MapPin, Euro, User, Heart } from 'lucide-react';
import { useLocation } from 'wouter';
import { z } from 'zod';
import { useLanguage } from '@/contexts/LanguageContext';

type ProfileFormData = z.infer<typeof updateProfileSchema>;

const availableServices = [
  'Escort Service', 'Girlfriend Experience', 'Massage', 'Gesellschaft',
  'Dinner Date', 'Travel Companion', 'Photo Shooting', 'Domina Service',
  'Aktiv/Top', 'Passiv/Bottom', 'Versatile', 'Oral aktiv', 'Oral passiv',
  'Anal aktiv', 'Anal passiv', 'Küssen', 'French Kiss', 'Kuscheln'
];

const bodyTypes = [
  'Schlank', 'Athletisch', 'Durchschnittlich', 'Kurvig', 'Vollschlank', 'Muskulös'
];

const ethnicities = [
  'Europäisch', 'Lateinamerikanisch', 'Asiatisch', 'Afrikanisch', 'Arabisch', 'Gemischt'
];

const positions = [
  { value: 'top', label: 'Top/Aktiv' },
  { value: 'bottom', label: 'Bottom/Passiv' },
  { value: 'versatile', label: 'Versatile/Switch' }
];

export default function ProfileEdit() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const { t } = useLanguage();

  // Fetch current user data
  const { data: currentUser, isLoading } = useQuery({
    queryKey: ['/api/auth/user'],
  });

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
      age: currentUser?.age || undefined,
      bio: currentUser?.bio || '',
      height: currentUser?.height || undefined,
      weight: currentUser?.weight || undefined,
      cockSize: currentUser?.cockSize || undefined,
      position: currentUser?.position || undefined,
      bodyType: currentUser?.bodyType || '',
      ethnicity: currentUser?.ethnicity || '',
      services: currentUser?.services || [],
      hourlyRate: currentUser?.hourlyRate || undefined,
      location: currentUser?.location || '',
      interests: currentUser?.interests || [],
    },
  });

  // Update form when user data loads
  React.useEffect(() => {
    if (currentUser) {
      form.reset({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        age: currentUser.age || undefined,
        bio: currentUser.bio || '',
        height: currentUser.height || undefined,
        weight: currentUser.weight || undefined,
        cockSize: currentUser.cockSize || undefined,
        position: currentUser.position || undefined,
        bodyType: currentUser.bodyType || '',
        ethnicity: currentUser.ethnicity || '',
        services: currentUser.services || [],
        hourlyRate: currentUser.hourlyRate || undefined,
        location: currentUser.location || '',
        interests: currentUser.interests || [],
      });
      setSelectedServices(currentUser.services || []);
    }
  }, [currentUser, form]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData & { profileImageUrl?: string; profileImages?: string[] }) => {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', '/api/auth/profile', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.withCredentials = true;
        
        xhr.onload = function() {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const result = JSON.parse(xhr.responseText);
              resolve(result);
            } catch (e) {
              reject(new Error('Invalid JSON response'));
            }
          } else {
            try {
              const errorData = JSON.parse(xhr.responseText);
              reject(new Error(errorData.message || 'Profile update failed'));
            } catch (e) {
              reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
            }
          }
        };
        
        xhr.onerror = function() {
          reject(new Error('Network error'));
        };
        
        xhr.send(JSON.stringify({ ...data, services: selectedServices }));
      });
    },
    onSuccess: () => {
      toast({
        title: "Profil aktualisiert",
        description: "Deine Änderungen wurden erfolgreich gespeichert.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      navigate('/profile');
    },
    onError: (error: any) => {
      toast({
        title: "Fehler beim Speichern",
        description: error.message || "Profil konnte nicht aktualisiert werden.",
        variant: "destructive",
      });
    },
  });

  const handleImageUpload = async (imageUrl: string, isMainImage: boolean) => {
    const currentData = form.getValues();
    
    if (isMainImage) {
      await updateProfileMutation.mutateAsync({
        ...currentData,
        profileImageUrl: imageUrl,
        services: selectedServices
      });
    } else {
      const currentImages = currentUser?.profileImages || [];
      const newImages = [...currentImages, imageUrl];
      
      await updateProfileMutation.mutateAsync({
        ...currentData,
        profileImages: newImages,
        services: selectedServices
      });
    }
  };

  const handleImageDelete = async (imageUrl: string, isMainImage: boolean) => {
    const currentData = form.getValues();
    
    if (isMainImage) {
      await updateProfileMutation.mutateAsync({
        ...currentData,
        profileImageUrl: '',
        services: selectedServices
      });
    } else {
      const currentImages = currentUser?.profileImages || [];
      const newImages = currentImages.filter(img => img !== imageUrl);
      
      await updateProfileMutation.mutateAsync({
        ...currentData,
        profileImages: newImages,
        services: selectedServices
      });
    }
  };

  const toggleService = (service: string) => {
    const newServices = selectedServices.includes(service)
      ? selectedServices.filter(s => s !== service)
      : [...selectedServices, service];
    setSelectedServices(newServices);
  };

  const onSubmit = (data: ProfileFormData) => {
    updateProfileMutation.mutate({ ...data, services: selectedServices });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#FF007F] border-t-transparent rounded-full" />
      </div>
    );
  }

  // Only allow trans users to edit profile extensively
  if (user?.userType !== 'trans') {
    return (
      <div className="min-h-screen bg-background p-4">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Profil bearbeiten nicht verfügbar</h2>
            <p className="text-gray-600 mb-4">Diese Funktion ist nur für Trans-Escorts verfügbar.</p>
            <Button onClick={() => navigate('/profile')} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück zum Profil
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate('/profile')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück
          </Button>
          <h1 className="text-2xl font-bold">Profil bearbeiten</h1>
          <div className="w-20" /> {/* Spacer */}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Profile Images */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-[#FF007F]" />
                  Profilbilder
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ProfileImageUpload
                  currentImage={currentUser?.profileImageUrl}
                  additionalImages={currentUser?.profileImages || []}
                  onImageUpload={handleImageUpload}
                  onImageDelete={handleImageDelete}
                  isTransUser={true}
                />
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-[#FF007F]" />
                  Grundinformationen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vorname *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Dein Vorname" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nachname</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Dein Nachname (optional)" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alter *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            value={field.value || ''}
                            onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                            placeholder="25" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Standort *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Berlin, Deutschland" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Über mich</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Erzähle etwas über dich..."
                          className="min-h-24"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Physical Details */}
            <Card>
              <CardHeader>
                <CardTitle>Körperliche Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Größe (cm)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field}
                            value={field.value || ''}
                            onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                            placeholder="170" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gewicht (kg)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field}
                            value={field.value || ''}
                            onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                            placeholder="65" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cockSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Größe (cm)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field}
                            value={field.value || ''}
                            onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                            placeholder="18" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="bodyType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Körpertyp</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Wähle deinen Körpertyp" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {bodyTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ethnicity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ethnizität</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Wähle deine Ethnizität" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ethnicities.map((ethnicity) => (
                              <SelectItem key={ethnicity} value={ethnicity}>
                                {ethnicity}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Wähle deine Präferenz" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {positions.map((position) => (
                            <SelectItem key={position.value} value={position.value}>
                              {position.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Services & Rate */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Euro className="w-5 h-5 text-[#FF007F]" />
                  Services & Preise
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="hourlyRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stundensatz (EUR)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field}
                          value={field.value || ''}
                          onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          placeholder="150" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <Label className="text-base font-medium">Angebotene Services</Label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {availableServices.map((service) => (
                      <div key={service} className="flex items-center space-x-2">
                        <Checkbox
                          id={service}
                          checked={selectedServices.includes(service)}
                          onCheckedChange={() => toggleService(service)}
                        />
                        <Label
                          htmlFor={service}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {service}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedServices.map((service) => (
                      <Badge key={service} variant="secondary" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/profile')}
              >
                Abbrechen
              </Button>
              <Button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="bg-[#FF007F] hover:bg-[#E6006B]"
              >
                {updateProfileMutation.isPending ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Speichern...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Profil speichern
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}