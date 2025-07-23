import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Crown, Check } from 'lucide-react';
import { Link } from 'wouter';

export default function Explore() {
  const [ageRange, setAgeRange] = useState([22, 45]);
  const [distance, setDistance] = useState([25]);
  const [interests, setInterests] = useState<string[]>(['Dating', 'Trans']);

  const handleInterestChange = (interest: string, checked: boolean) => {
    if (checked) {
      setInterests([...interests, interest]);
    } else {
      setInterests(interests.filter(i => i !== interest));
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <h2 className="text-xl font-bold mb-4">Entdecken & Filter</h2>
      
      <div className="space-y-4">
        {/* Age Range */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Altersbereich</h3>
            <div className="px-2">
              <Slider
                value={ageRange}
                onValueChange={setAgeRange}
                max={65}
                min={18}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-[#FF007F] mt-2">
                <span>{ageRange[0]}</span>
                <span>{ageRange[1]}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Distance */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Entfernung</h3>
            <div className="px-2">
              <Slider
                value={distance}
                onValueChange={setDistance}
                max={100}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="text-sm text-[#FF007F] mt-2">
                Max. {distance[0]} km
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interests */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Interessen</h3>
            <div className="grid grid-cols-2 gap-2">
              {['Dating', 'Freundschaft', 'Trans', 'Community'].map((interest) => (
                <div key={interest} className="flex items-center space-x-2">
                  <Checkbox
                    id={interest}
                    checked={interests.includes(interest)}
                    onCheckedChange={(checked) => 
                      handleInterestChange(interest, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={interest}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {interest}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Premium Features */}
        <Card className="bg-gradient-to-r from-[#FF007F]/10 to-purple-500/10 border-[#FF007F]/30">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3 mb-3">
              <Crown className="w-6 h-6 text-[#FF007F]" />
              <h3 className="font-semibold">Premium Features</h3>
            </div>
            <ul className="space-y-2 text-sm mb-4">
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#FF007F]" />
                <span>Unbegrenzte Likes</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#FF007F]" />
                <span>Wer hat mich geliked?</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#FF007F]" />
                <span>Erweiterte Filter</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#FF007F]" />
                <span>Profil-Boost</span>
              </li>
            </ul>
            <Link href="/subscribe">
              <Button className="w-full bg-[#FF007F] hover:bg-[#FF007F]/90">
                Premium werden - 9,99€/Monat
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Apply Filters */}
        <Button className="w-full bg-[#FF007F] hover:bg-[#FF007F]/90">
          Filter anwenden
        </Button>
      </div>
    </div>
  );
}
