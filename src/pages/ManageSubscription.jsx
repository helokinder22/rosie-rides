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
  DialogClose,
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
          <DialogContent className="bg-white border-0 rounded-3xl shadow-2xl max-w-sm max-h-[90vh] overflow-auto p-0">
            <DialogHeader className="p-6 rounded-t-3xl relative" style={{ backgroundColor: '#0091a2' }}>
              <DialogTitle className="text-3xl font-bold text-center text-white">Menu</DialogTitle>
              <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-slate-100 data-[state=open]:text-slate-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                <span className="sr-only">Close</span>
              </DialogClose>
            </DialogHeader>
            <div className="flex flex-col items-center space-y-6 py-8 px-6" ref={(el) => el?.parentElement?.scrollTo(0, 0)}>
              <div className="relative">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                  <User className="w-12 h-12" style={{ color: '#0091a2' }} />
                </div>
                {isPremium && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                    <Crown className="w-8 h-8 text-yellow-500" />
                  </div>
                )}
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-2xl font-black text-slate-900">{user?.full_name || 'Guest User'}</h3>
                <p className="text-slate-600 text-lg">{user?.email}</p>
              </div>

              <Link to={createPageUrl("Home")} className="w-full">
                <Button 
                  className="w-full h-16 text-xl rounded-2xl text-white font-bold shadow-lg"
                  style={{ backgroundColor: '#0091a2' }}
                >
                  <Home className="w-6 h-6 mr-2" />
                  Home
                </Button>
              </Link>

              <Link to={createPageUrl("ManageDestinations")} className="w-full">
                <Button 
                  variant="outline" 
                  className="w-full h-14 text-lg rounded-2xl border-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  <Settings className="w-5 h-5 mr-2" style={{ color: '#0091a2' }} />
                  Manage Destinations
                </Button>
              </Link>

              <Link to={createPageUrl("EmergencyContacts")} className="w-full">
                <Button 
                  variant="outline" 
                  className="w-full h-14 text-lg rounded-2xl border-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  <Settings className="w-5 h-5 mr-2" style={{ color: '#0091a2' }} />
                  Emergency Contacts
                </Button>
              </Link>

              <Link to={createPageUrl("TripHistory")} className="w-full">
                <Button 
                  variant="outline" 
                  className="w-full h-14 text-lg rounded-2xl border-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  <History className="w-5 h-5 mr-2" style={{ color: '#0091a2' }} />
                  Trip History
                </Button>
              </Link>

              <Link to={createPageUrl("About")} className="w-full">
                <Button 
                  variant="outline" 
                  className="w-full h-14 text-lg rounded-2xl border-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  <Sparkles className="w-5 h-5 mr-2" style={{ color: '#0091a2' }} />
                  About
                </Button>
              </Link>

              <Link to={createPageUrl("AddToHomescreen")} className="w-full">
                <Button 
                  variant="outline" 
                  className="w-full h-14 text-lg rounded-2xl border-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  <Smartphone className="w-5 h-5 mr-2" style={{ color: '#0091a2' }} />
                  Add to Homescreen
                </Button>
              </Link>

              <Link to={createPageUrl("Disclaimer")} className="w-full">
                <Button 
                  variant="outline" 
                  className="w-full h-14 text-lg rounded-2xl border-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  <ShieldAlert className="w-5 h-5 mr-2" style={{ color: '#0091a2' }} />
                  Disclaimer
                </Button>
              </Link>

              <Button 
                className="w-full h-14 text-lg rounded-2xl text-gray-700 font-bold"
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
        className="h-16 w-16 border-4 border-white/50 bg-white hover:bg-slate-50 shadow-xl rounded-2xl mb-8 p-0"
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