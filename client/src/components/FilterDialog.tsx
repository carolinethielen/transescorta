import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Filter, X } from 'lucide-react';

interface FilterDialogProps {
  onFiltersChange: (filters: any) => void;
}

export function FilterDialog({ onFiltersChange }: FilterDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    ageRange: [18, 50],
    priceRange: [50, 500],
    position: '',
    bodyType: '',
    ethnicity: '',
    circumcision: '',
    services: [] as string[],
    onlineOnly: false,
    premiumOnly: false,
  });

  // Synchronisiert mit ProfileEditUnified.tsx
  const services = [
    'Begleitung', 'Massage', 'Dinner Date', 'Overnights', 'Travel Companion',
    'Fetish', 'Domination', 'Submission', 'Role Play', 'BDSM',
    'Aktiv', 'Passiv', 'Versatile', 'Oral', 'Anal'
  ];

  const positions = ['top', 'bottom', 'versatile'];
  const bodyTypes = ['Schlank', 'Athletisch', 'Durchschnittlich', 'Kurvig', 'Plus Size', 'Muskulös'];
  const ethnicities = ['Europäisch', 'Lateinamerikanisch', 'Asiatisch', 'Afrikanisch', 'Arabisch', 'Gemischt'];

  const handleServiceToggle = (service: string) => {
    const newServices = filters.services.includes(service)
      ? filters.services.filter(s => s !== service)
      : [...filters.services, service];
    
    setFilters({ ...filters, services: newServices });
  };

  const applyFilters = () => {
    onFiltersChange(filters);
    setIsOpen(false);
  };

  const clearFilters = () => {
    const clearedFilters = {
      ageRange: [18, 50],
      priceRange: [50, 500],
      position: '',
      bodyType: '',
      ethnicity: '',
      circumcision: '',
      services: [],
      onlineOnly: false,
      premiumOnly: false,
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  // Function to generate active filter summary
  const getActiveFilterSummary = () => {
    const active = [];
    
    if (filters.ageRange[0] !== 18 || filters.ageRange[1] !== 50) {
      active.push(`${filters.ageRange[0]}-${filters.ageRange[1]}J`);
    }
    if (filters.priceRange[0] !== 50 || filters.priceRange[1] !== 500) {
      active.push(`${filters.priceRange[0]}-${filters.priceRange[1]}€`);
    }
    if (filters.position) {
      active.push(filters.position);
    }
    if (filters.bodyType) {
      active.push(filters.bodyType);
    }
    if (filters.ethnicity && filters.ethnicity !== 'all') {
      active.push(filters.ethnicity);
    }
    if (filters.circumcision && filters.circumcision !== 'all') {
      active.push(filters.circumcision);
    }
    if (filters.services.length > 0) {
      active.push(`${filters.services.length} Service${filters.services.length > 1 ? 's' : ''}`);
    }
    if (filters.onlineOnly) {
      active.push('Online');
    }
    if (filters.premiumOnly) {
      active.push('Premium');
    }
    
    return active.length > 0 ? active.join(', ') : null;
  };

  const activeSummary = getActiveFilterSummary();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className={`h-8 w-8 p-1 ${activeSummary ? 'bg-[#FF007F] text-white hover:bg-[#FF007F]/90' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
        >
          <Filter className={`w-4 h-4 ${activeSummary ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Filter & Suche
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="w-4 h-4 mr-1" />
              Zurücksetzen
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Age Range */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Alter: {filters.ageRange[0]} - {filters.ageRange[1]} Jahre
            </label>
            <Slider
              value={filters.ageRange}
              onValueChange={(value) => setFilters({ ...filters, ageRange: value })}
              min={18}
              max={60}
              step={1}
              className="w-full"
            />
          </div>

          {/* Price Range */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Preis: {filters.priceRange[0]}€ - {filters.priceRange[1]}€ pro Stunde
            </label>
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => setFilters({ ...filters, priceRange: value })}
              min={50}
              max={1000}
              step={10}
              className="w-full"
            />
          </div>

          {/* Position */}
          <div>
            <label className="text-sm font-medium mb-2 block">Position</label>
            <Select value={filters.position} onValueChange={(value) => setFilters({ ...filters, position: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Position wählen..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle</SelectItem>
                {positions.map((position) => (
                  <SelectItem key={position} value={position}>
                    {position === 'top' ? 'Top/Aktiv' : 
                     position === 'bottom' ? 'Bottom/Passiv' : 
                     'Versatile/Switch'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Body Type */}
          <div>
            <label className="text-sm font-medium mb-2 block">Körpertyp</label>
            <Select value={filters.bodyType} onValueChange={(value) => setFilters({ ...filters, bodyType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Körpertyp wählen..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle</SelectItem>
                {bodyTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Ethnicity */}
          <div>
            <label className="text-sm font-medium mb-2 block">Ethnizität</label>
            <Select value={filters.ethnicity} onValueChange={(value) => setFilters({ ...filters, ethnicity: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Ethnizität wählen..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle</SelectItem>
                {ethnicities.map((ethnicity) => (
                  <SelectItem key={ethnicity} value={ethnicity}>
                    {ethnicity}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Services */}
          <div>
            <label className="text-sm font-medium mb-2 block">Services</label>
            <div className="grid grid-cols-2 gap-2">
              {services.map((service) => (
                <div key={service} className="flex items-center space-x-2">
                  <Checkbox
                    id={service}
                    checked={filters.services.includes(service)}
                    onCheckedChange={() => handleServiceToggle(service)}
                  />
                  <label htmlFor={service} className="text-sm cursor-pointer">
                    {service}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Circumcision Filter - Additional for Trans escorts */}
          <div>
            <label className="text-sm font-medium mb-2 block">Beschneidung</label>
            <Select value={filters.circumcision || ''} onValueChange={(value) => setFilters({ ...filters, circumcision: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Beschneidung wählen..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle</SelectItem>
                <SelectItem value="beschnitten">Beschnitten</SelectItem>
                <SelectItem value="unbeschnitten">Unbeschnitten</SelectItem>
                <SelectItem value="teilweise">Teilweise</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Filters */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="onlineOnly"
                checked={filters.onlineOnly}
                onCheckedChange={(checked) => setFilters({ ...filters, onlineOnly: !!checked })}
              />
              <label htmlFor="onlineOnly" className="text-sm cursor-pointer">
                Nur Online-Escorts
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="premiumOnly"
                checked={filters.premiumOnly}
                onCheckedChange={(checked) => setFilters({ ...filters, premiumOnly: !!checked })}
              />
              <label htmlFor="premiumOnly" className="text-sm cursor-pointer">
                Nur Premium-Escorts
              </label>
            </div>
          </div>

          {/* Apply Button */}
          <Button onClick={applyFilters} className="w-full bg-[#FF007F] hover:bg-[#FF007F]/90">
            Filter anwenden
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}