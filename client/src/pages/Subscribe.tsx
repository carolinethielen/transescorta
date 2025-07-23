import React, { useEffect, useState } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from "@/lib/queryClient";
import { Crown, Check, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

// Load Stripe
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Premium aktiviert!",
        description: "Willkommen bei TransConnect Premium!",
      });
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        className="w-full bg-[#FF007F] hover:bg-[#FF007F]/90"
        disabled={!stripe || isLoading}
      >
        {isLoading ? 'Verarbeitung...' : 'Premium abonnieren - 9,99€/Monat'}
      </Button>
    </form>
  );
};

export default function Subscribe() {
  const [clientSecret, setClientSecret] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Create subscription
    apiRequest("POST", "/api/get-or-create-subscription")
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((error) => {
        toast({
          title: "Fehler",
          description: "Konnte Subscription nicht erstellen",
          variant: "destructive",
        });
      });
  }, [toast]);

  if (!clientSecret) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#FF007F] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-border">
        <Link href="/explore">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold ml-4">Premium werden</h1>
      </div>

      <div className="p-4">
        {/* Premium Features */}
        <Card className="mb-6 bg-gradient-to-r from-[#FF007F]/10 to-purple-500/10 border-[#FF007F]/30">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <Crown className="w-16 h-16 text-[#FF007F] mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">TransConnect Premium</h2>
              <p className="text-muted-foreground">
                Erweitere deine Dating-Erfahrung mit Premium-Features
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-[#FF007F]" />
                <span>Unbegrenzte Likes pro Tag</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-[#FF007F]" />
                <span>Sehen wer dich geliked hat</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-[#FF007F]" />
                <span>Erweiterte Suchfilter</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-[#FF007F]" />
                <span>Profil-Boost (5x mehr Sichtbarkeit)</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-[#FF007F]" />
                <span>Premium-Badge im Profil</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-[#FF007F]" />
                <span>Priorität im Support</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-[#FF007F]" />
                <span>Werbefreie Erfahrung</span>
              </div>
            </div>

            <div className="text-center">
              <Badge className="bg-[#FF007F] text-white px-4 py-2 text-base">
                Nur 9,99€ pro Monat
              </Badge>
              <p className="text-sm text-muted-foreground mt-2">
                Jederzeit kündbar
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Form */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Zahlungsinformationen</h3>
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm />
            </Elements>
            
            <div className="mt-4 text-center text-sm text-muted-foreground">
              <p>Sichere Zahlung über Stripe</p>
              <p className="mt-1">
                Mit der Bestellung stimmst du unseren{' '}
                <a href="#" className="text-[#FF007F] hover:underline">AGB</a> zu.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
