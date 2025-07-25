import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { updateProfileSchema, type UpdateProfile } from '@shared/schema';
import { ProfileImageUploadNew } from '@/components/ProfileImageUploadNew';
import { useProfile } from '@/hooks/useProfile';
import { ArrowLeft, Save, MapPin, User, Heart, DollarSign, Camera } from 'lucide-react';

// Location detection using GPS
const useLocationDetection = () => {
  const [location, setLocation] = useState<{ city: string; latitude: number; longitude: number } | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);

  const detectLocation = async () => {
    setIsDetecting(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Reverse geocoding to get city name
      const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=de`);
      const data = await response.json();
      
      setLocation({
        city: data.city || data.locality || 'Unbekannte Stadt',
        latitude,
        longitude
      });
    } catch (error) {
      console.error('GPS location detection failed:', error);
    } finally {
      setIsDetecting(false);
    }
  };

  return { location, detectLocation, isDetecting };
};

// Predefined options
const services = [
  'Begleitung', 'Massage', 'Dinner Date', 'Overnights', 'Travel Companion',
  'Fetish', 'Domination', 'Submission', 'Role Play', 'BDSM',
  'Aktiv', 'Passiv', 'Versatile', 'Oral', 'Anal'
];

const interests = [
  'Sport', 'Musik', 'Reisen', 'Kochen', 'Kunst', 'Mode', 'Fitness',
  'Nachtleben', 'Theater', 'Kino', 'Lesen', 'Gaming', 'Fotografie'
];

const bodyTypes = [
  'Schlank', 'Athletisch', 'Durchschnittlich', 'Kurvig', 'Plus Size', 'Muskulös'
];

const ethnicities = [
  'Kaukasisch', 'Lateinamerikanisch', 'Asiatisch', 'Afrikanisch', 'Arabisch', 'Gemischt'
];

export default function ProfileEditUnified() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { location: gpsLocation, detectLocation, isDetecting } = useLocationDetection();
  
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  // Use profile hook for consistent data
  const { profile: currentUser, isLoading, refreshProfile } = useProfile();

  const form = useForm<UpdateProfile>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      age: undefined,
      bio: '',
      location: '',
      latitude: undefined,
      longitude: undefined,
      profileImageUrl: '',
      profileImages: [],
      height: undefined,
      weight: undefined,
      cockSize: undefined,
      circumcision: undefined,
      position: undefined,
      bodyType: '',
      ethnicity: '',
      services: [],
      hourlyRate: undefined,
      interests: [],
    }
  });

  // Update form when user data loads - with proper value handling
  useEffect(() => {
    if (currentUser) {
      console.log('Updating form with user data:', currentUser);
      
      const formData = {
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        age: currentUser.age || undefined,
        bio: currentUser.bio || '',
        location: currentUser.location || '',
        latitude: currentUser.latitude || undefined,
        longitude: currentUser.longitude || undefined,
        profileImageUrl: currentUser.profileImageUrl || '',
        profileImages: currentUser.profileImages || [],
        height: currentUser.height || undefined,
        weight: currentUser.weight || undefined,
        cockSize: currentUser.cockSize || undefined,
        circumcision: currentUser.circumcision || undefined,
        position: currentUser.position || undefined,
        bodyType: currentUser.bodyType || '',
        ethnicity: currentUser.ethnicity || '',
        services: currentUser.services || [],
        hourlyRate: currentUser.hourlyRate || undefined,
        interests: currentUser.interests || [],
      };
      
      console.log('Form data being set:', formData);
      
      // Reset form with new data
      form.reset(formData);
      
      // Set selected services and interests
      setSelectedServices(currentUser.services || []);
      setSelectedInterests(currentUser.interests || []);
      
      // Force update individual fields that might not be updating
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          form.setValue(key as any, value);
        }
      });
    }
  }, [currentUser, form]);

  // Update location when GPS detects it
  useEffect(() => {
    if (gpsLocation) {
      form.setValue('location', gpsLocation.city);
      form.setValue('latitude', gpsLocation.latitude);
      form.setValue('longitude', gpsLocation.longitude);
      toast({
        title: "Standort erkannt",
        description: `Automatisch erkannt: ${gpsLocation.city}`,
      });
    }
  }, [gpsLocation, form, toast]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: UpdateProfile & { profileImageUrl?: string; profileImages?: string[] }) => {
      console.log('Updating profile with data:', { ...data, services: selectedServices, interests: selectedInterests });
      
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          ...data, 
          services: selectedServices,
          interests: selectedInterests
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(errorData.message || 'Profile update failed');
      }
      
      return response.json();
    },
    onSuccess: async () => {
      // Refresh profile data using the hook
      await refreshProfile();
      
      toast({
        title: "Profil gespeichert",
        description: "Dein Profil wurde erfolgreich aktualisiert!",
      });
      setTimeout(() => {
        navigate('/my-profile');
      }, 1000);
    },
    onError: (error: Error) => {
      toast({
        title: "Fehler beim Speichern",
        description: error.message || "Profil konnte nicht aktualisiert werden.",
        variant: "destructive",
      });
    },
  });



  const onSubmit = (data: UpdateProfile) => {
    const submitData = {
      ...data,
      services: selectedServices,
      interests: selectedInterests,
    };
    
    console.log('Submitting profile data:', submitData);
    updateProfileMutation.mutate(submitData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#FF007F] border-t-transparent rounded-full" />
      </div>
    );
  }

  const isTransUser = user?.userType === 'trans';

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate('/my-profile')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück
          </Button>
          <h1 className="text-2xl font-bold">Profil bearbeiten</h1>
          <div className="w-20" />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Profile Images - Only for trans users */}
            {isTransUser && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="w-5 h-5 text-[#FF007F]" />
                    Profilbilder
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ProfileImageUploadNew
                    currentMainImage={currentUser?.profileImageUrl || undefined}
                    currentImages={Array.isArray(currentUser?.profileImages) ? currentUser.profileImages : []}
                    onImageUpdate={(mainImage, additionalImages) => {
                      console.log('Image update callback:', { mainImage, additionalImages });
                      form.setValue('profileImageUrl', mainImage || '', { shouldDirty: true });
                      form.setValue('profileImages', additionalImages, { shouldDirty: true });
                    }}
                  />
                </CardContent>
              </Card>
            )}

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
                          <Input placeholder="Dein Vorname" {...field} />
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
                          <Input placeholder="Dein Nachname" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alter</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="18"
                          min={18}
                          max={100}
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Über mich</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Erzähle etwas über dich..."
                          className="min-h-[100px]"
                          maxLength={500}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#FF007F]" />
                  Standort
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Stadt</FormLabel>
                        <FormControl>
                          <Input placeholder="Berlin, Deutschland" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={detectLocation}
                      disabled={isDetecting}
                      className="mb-0"
                    >
                      {isDetecting ? (
                        <div className="animate-spin w-4 h-4 border-2 border-[#FF007F] border-t-transparent rounded-full" />
                      ) : (
                        <MapPin className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Dein Standort wird auf der Startseite mit Kilometerentfernung angezeigt
                </p>
              </CardContent>
            </Card>

            {/* Physical Details - Only for trans users */}
            {isTransUser && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-[#FF007F]" />
                    Körperliche Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Größe (cm)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="170"
                              min={140}
                              max={220}
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
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
                              placeholder="65"
                              min={40}
                              max={200}
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
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
                      name="cockSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Schwanzgröße (cm)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="18"
                              min={8}
                              max={35}
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="circumcision"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Beschneidung</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Auswählen..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="beschnitten">Beschnitten</SelectItem>
                              <SelectItem value="unbeschnitten">Unbeschnitten</SelectItem>
                              <SelectItem value="teilweise">Teilweise</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="position"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Position</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Auswählen..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="top">Top/Aktiv</SelectItem>
                              <SelectItem value="bottom">Bottom/Passiv</SelectItem>
                              <SelectItem value="versatile">Versatile/Switch</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bodyType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Körpertyp</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Auswählen..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {bodyTypes.map((type) => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
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
                    name="ethnicity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ethnizität</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Auswählen..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ethnicities.map((ethnicity) => (
                              <SelectItem key={ethnicity} value={ethnicity}>{ethnicity}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {/* Services & Pricing - Only for trans users */}
            {isTransUser && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-[#FF007F]" />
                    Services & Preise
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-base font-medium mb-3 block">Angebotene Services</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {services.map((service) => (
                        <div key={service} className="flex items-center space-x-2">
                          <Checkbox
                            id={service}
                            checked={selectedServices.includes(service)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedServices([...selectedServices, service]);
                              } else {
                                setSelectedServices(selectedServices.filter(s => s !== service));
                              }
                            }}
                          />
                          <Label htmlFor={service} className="text-sm">{service}</Label>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedServices.map((service) => (
                        <Badge key={service} variant="secondary" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="hourlyRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stundensatz (€)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="150"
                            min={50}
                            max={1000}
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {/* Interests */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-[#FF007F]" />
                  Interessen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {interests.map((interest) => (
                    <div key={interest} className="flex items-center space-x-2">
                      <Checkbox
                        id={interest}
                        checked={selectedInterests.includes(interest)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedInterests([...selectedInterests, interest]);
                          } else {
                            setSelectedInterests(selectedInterests.filter(i => i !== interest));
                          }
                        }}
                      />
                      <Label htmlFor={interest} className="text-sm">{interest}</Label>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedInterests.map((interest) => (
                    <Badge key={interest} variant="secondary" className="text-xs">
                      {interest}
                    </Badge>
                  ))}
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