import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ImageGallery } from '@/components/ImageGallery';
import { 
  MapPin, 
  Clock, 
  Euro, 
  User as UserIcon, 
  Ruler, 
  Weight, 
  Heart,
  Crown,
  MessageCircle,
  ArrowLeft,
  Star
} from 'lucide-react';
import { OnlineIndicator } from '@/components/OnlineIndicator';
import type { User } from '@shared/schema';

interface EscortProfileViewProps {
  user: User;
  isOwnProfile?: boolean;
  onBack?: () => void;
  onContact?: () => void;
  onEdit?: () => void;
}

export function EscortProfileView({ 
  user, 
  isOwnProfile = false, 
  onBack, 
  onContact, 
  onEdit 
}: EscortProfileViewProps) {
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative">
        {/* Back Button */}
        {onBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="absolute top-4 left-4 z-10 bg-white/90 dark:bg-black/90 hover:bg-white dark:hover:bg-black"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück
          </Button>
        )}

        {/* Contact/Edit Button */}
        <div className="absolute top-4 right-4 z-10">
          {isOwnProfile ? (
            onEdit && (
              <Button
                onClick={onEdit}
                className="bg-[#FF007F] hover:bg-[#FF007F]/90"
              >
                Profil bearbeiten
              </Button>
            )
          ) : (
            onContact && (
              <Button
                onClick={onContact}
                className="bg-[#FF007F] hover:bg-[#FF007F]/90"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Kontakt
              </Button>
            )
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 pt-16">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Images */}
          <div>
            <ImageGallery
              images={user.profileImages || []}
              mainImage={user.profileImageUrl || undefined}
              userName={user.firstName || 'Escort'}
            />
          </div>

          {/* Right Column - Profile Info */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{user.firstName}</h1>
                {user.age && (
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {user.age}
                  </Badge>
                )}
                {user.isPremium && (
                  <Crown className="w-6 h-6 text-yellow-500" />
                )}
                <OnlineIndicator isOnline={user.isOnline} variant="badge" />
              </div>

              <div className="flex items-center justify-between mb-3">
                {user.location && (
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    {user.location}
                  </div>
                )}
                <OnlineIndicator 
                  isOnline={user.isOnline} 
                  lastSeen={user.lastSeen} 
                  variant="text"
                />
              </div>

              {user.bio && (
                <p className="text-base leading-relaxed">{user.bio}</p>
              )}
            </div>

            <Separator />

            {/* Pricing */}
            {user.hourlyRate && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Euro className="w-5 h-5 mr-2 text-[#FF007F]" />
                      <span className="font-medium">Stundensatz</span>
                    </div>
                    <div className="text-xl font-bold text-[#FF007F]">
                      {user.hourlyRate}€
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Physical Details */}
            {(user.height || user.weight || user.bodyType || user.ethnicity) && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center">
                    <UserIcon className="w-4 h-4 mr-2" />
                    Körperliche Details
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {user.height && (
                      <div className="flex items-center">
                        <Ruler className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span>{user.height} cm</span>
                      </div>
                    )}
                    {user.weight && (
                      <div className="flex items-center">
                        <Weight className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span>{user.weight} kg</span>
                      </div>
                    )}
                    {user.bodyType && (
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Körpertyp: </span>
                        <span className="font-medium">{user.bodyType}</span>
                      </div>
                    )}
                    {user.ethnicity && (
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Ethnizität: </span>
                        <span className="font-medium">{user.ethnicity}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Intimate Details (for trans escorts) */}
            {user.userType === 'trans' && (user.cockSize || user.circumcision || user.position) && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center">
                    <Heart className="w-4 h-4 mr-2" />
                    Weitere Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    {user.cockSize && (
                      <div>
                        <span className="text-muted-foreground">Größe: </span>
                        <span className="font-medium">{user.cockSize} cm</span>
                      </div>
                    )}
                    {user.circumcision && (
                      <div>
                        <span className="text-muted-foreground">Beschneidung: </span>
                        <span className="font-medium capitalize">{user.circumcision}</span>
                      </div>
                    )}
                    {user.position && (
                      <div>
                        <span className="text-muted-foreground">Position: </span>
                        <span className="font-medium capitalize">{user.position}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Services */}
            {user.services && user.services.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center">
                    <Star className="w-4 h-4 mr-2" />
                    Angebotene Services
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {user.services.map((service) => (
                      <Badge key={service} variant="outline" className="bg-[#FF007F]/10 border-[#FF007F]/20">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Online Status */}
            <div className="flex items-center gap-2 text-sm">
              <div className={`w-3 h-3 rounded-full ${user.isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-muted-foreground">
                {user.isOnline ? 'Jetzt online' : 'Zuletzt gesehen: vor kurzem'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}