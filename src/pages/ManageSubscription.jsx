import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Crown, Home, CheckCircle, XCircle, CreditCard, ExternalLink } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useQuery } from "@tanstack/react-query";

export default function ManageSubscription() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me(),
  });

  const isPremium = user?.subscription_status === 'premium';

  const handleManageSubscription = async () => {
    setIsLoading(true);
    try {
      const { data } = await base44.functions.invoke('createPortalSession', {});
      window.location.href = data.url;
    } catch (error) {
      console.error('Portal error:', error);
      alert('Failed to open subscription management. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <Button
        variant="outline"
        size="lg"
        onClick={() => navigate(createPageUrl("Home"))}
        className="h-14 px-6 text-lg border-2 border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold mb-8"
      >
        <Home className="w-5 h-5 mr-2" />
        Back to Home
      </Button>

      <div className="text-center pt-8 pb-12">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="relative">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691a6204f2266bf3df80a940/6b6693db3_icon.png"
              alt="Rosie Rides"
              className="w-24 h-24 rounded-3xl shadow-2xl"
            />
          </div>
        </div>
        <h1 className="text-5xl sm:text-6xl font-black mb-2" style={{ color: '#0091a2' }}>
          Manage Subscription
        </h1>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="bg-white border-0 shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {isPremium ? (
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Crown className="w-10 h-10 text-yellow-600" />
                </div>
              ) : (
                <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center">
                  <CreditCard className="w-10 h-10 text-slate-600" />
                </div>
              )}
            </div>
            <CardTitle className="text-3xl font-black text-slate-800">
              {isPremium ? 'Premium Member' : 'Free Plan'}
            </CardTitle>
            <CardDescription className="text-lg">
              {user?.email}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-slate-50 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-medium">Current Plan</span>
                <span className="text-slate-900 font-bold">
                  {isPremium ? 'Premium ($9.99/year)' : 'Free'}
                </span>
              </div>
              
              <div className="border-t border-slate-200 pt-4 space-y-2">
                <h4 className="font-bold text-slate-800 mb-3">Your Benefits:</h4>
                {isPremium ? (
                  <>
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="w-5 h-5" />
                      <span>Unlimited Destinations</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="w-5 h-5" />
                      <span>Emergency Alerts</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="w-5 h-5" />
                      <span>Ad-free Experience</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 text-slate-600">
                      <CheckCircle className="w-5 h-5" />
                      <span>Up to 2 Destinations</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <XCircle className="w-5 h-5" />
                      <span>Limited Features</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {isPremium ? (
              <div className="space-y-3">
                <Button
                  onClick={handleManageSubscription}
                  disabled={isLoading}
                  className="w-full h-14 text-lg font-bold bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white shadow-lg rounded-xl"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  {isLoading ? 'Loading...' : 'Manage via Stripe Portal'}
                </Button>
                <p className="text-sm text-slate-500 text-center">
                  Cancel anytime, update payment method, view invoices
                </p>
              </div>
            ) : (
              <Link to={createPageUrl("Subscription")}>
                <Button
                  className="w-full h-14 text-lg font-bold bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white shadow-lg rounded-xl"
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Upgrade to Premium
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="text-center py-8 text-gray-500 text-sm">
        © 2026 Rosie Rides. All rights reserved.
      </div>
    </div>
  );
}