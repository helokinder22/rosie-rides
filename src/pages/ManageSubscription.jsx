import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Crown, Home, CheckCircle, XCircle, CreditCard, ExternalLink, Menu, User, LogOut, Settings, Sparkles, ShieldAlert, History, Smartphone } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ManageSubscription() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me(),
  });

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const isPremium = user?.subscription_status === 'premium';

  const handleManageSubscription = async () => {
    setIsLoading(true);
    try {
      const { data } = await base44.functions.invoke('createPortalSession', {});
      if (data.error) {
        alert(data.error);
        setIsLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch (error) {
      console.error('Portal error:', error);
      const errorMessage = error.response?.data?.error || 'Failed to open subscription management. Please try again.';
      alert(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 overflow-y-auto">
      {/* Profile Menu */}
      <div className="absolute top-8 sm:top-12 right-4 z-10">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="secondary"
              className="h-16 w-16 rounded-2xl bg-white border-4 border-white/50 shadow-xl p-0 hover:bg-slate-50 transition-transform hover:scale-105"
              style={{ color: '#0091a2' }}
            >
              <Menu className="w-8 h-8" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white/95 backdrop-blur-xl border-0 rounded-3xl shadow-2xl max-w-sm max-h-[90vh] overflow-auto">
            <DialogHeader className="rounded-t-3xl p-6 -m-6 mb-0" style={{ backgroundColor: '#0091a2' }}>
              <DialogTitle className="text-2xl font-bold text-center text-white">Menu</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center space-y-6 py-4" ref={(el) => el?.parentElement?.scrollTo(0, 0)}>
              <Link to={createPageUrl("Home")} className="w-full">
                <Button 
                  variant="outline" 
                  className="w-full h-12 rounded-xl border-2 text-white font-bold"
                  style={{ backgroundColor: '#0091a2', borderColor: '#0091a2' }}
                >
                  <Home className="w-5 h-5" />
                </Button>
              </Link>
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
                <User className="w-10 h-10" style={{ color: '#0091a2' }} />
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-xl font-bold text-slate-900">{user?.full_name || 'Guest User'}</h3>
                <p className="text-slate-500">{user?.email}</p>
              </div>

              <div className="w-full bg-slate-50 rounded-xl p-4 flex items-center justify-between border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isPremium ? 'bg-yellow-100 text-yellow-600' : 'bg-slate-200 text-slate-600'}`}>
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-slate-500">Plan</p>
                    <p className="font-bold text-slate-800">{isPremium ? 'Premium Member' : 'Free Plan'}</p>
                  </div>
                </div>
                {isPremium && <Crown className="w-5 h-5 text-yellow-500" />}
              </div>

              <Link to={createPageUrl("ManageDestinations")} className="w-full">
                <Button 
                  variant="outline" 
                  className="w-full h-12 text-lg rounded-xl border-2 border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  <Settings className="w-5 h-5 mr-2" style={{ color: '#0091a2' }} />
                  Manage Destinations
                </Button>
              </Link>

              <Link to={createPageUrl("EmergencyContacts")} className="w-full">
                <Button 
                  variant="outline" 
                  className="w-full h-12 text-lg rounded-xl border-2 border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  <Settings className="w-5 h-5 mr-2" style={{ color: '#0091a2' }} />
                  Emergency Contacts
                </Button>
              </Link>

              <Link to={createPageUrl("TripHistory")} className="w-full">
                <Button 
                  variant="outline" 
                  className="w-full h-12 text-lg rounded-xl border-2 border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  <History className="w-5 h-5 mr-2" style={{ color: '#0091a2' }} />
                  Trip History
                </Button>
              </Link>

              <Link to={createPageUrl("About")} className="w-full">
                <Button 
                  variant="outline" 
                  className="w-full h-12 text-lg rounded-xl border-2 border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  <Sparkles className="w-5 h-5 mr-2" style={{ color: '#0091a2' }} />
                  About
                </Button>
              </Link>

              <Link to={createPageUrl("AddToHomescreen")} className="w-full">
                <Button 
                  variant="outline" 
                  className="w-full h-12 text-lg rounded-xl border-2 border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  <Smartphone className="w-5 h-5 mr-2" style={{ color: '#0091a2' }} />
                  Add to Homescreen
                </Button>
              </Link>

              <Link to={createPageUrl("Disclaimer")} className="w-full">
                <Button 
                  variant="outline" 
                  className="w-full h-12 text-lg rounded-xl border-2 border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  <ShieldAlert className="w-5 h-5 mr-2" style={{ color: '#0091a2' }} />
                  Disclaimer
                </Button>
              </Link>

              <Button 
                className="w-full h-12 text-lg rounded-xl mt-2 text-gray-700 font-bold"
                style={{ backgroundColor: '#ffc20c' }}
                onClick={() => base44.auth.logout()}
              >
                <LogOut className="w-5 h-5 mr-2" style={{ color: '#0091a2' }} />
                Sign Out
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Button
        variant="outline"
        size="lg"
        onClick={() => navigate(createPageUrl("Home"))}
        className="h-14 w-14 border-2 border-slate-300 bg-white hover:bg-slate-50 mb-8 p-0"
      >
        <Home className="w-6 h-6" style={{ color: '#0091a2' }} />
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