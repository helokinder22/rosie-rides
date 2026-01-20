import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Check, Shield, Star, Home, Sparkles, Menu, User, LogOut, CreditCard, Crown, Settings, ShieldAlert, History, Smartphone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useQuery } from "@tanstack/react-query";

export default function Subscription() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me(),
  });

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubscribe = async () => {
    setIsProcessing(true);
    try {
      const { data } = await base44.functions.invoke('createCheckout', {});
      if (data.error) {
        alert(data.error);
        setIsProcessing(false);
        return;
      }
      if (!data.url) {
        alert('Failed to create checkout session. Please try again.');
        setIsProcessing(false);
        return;
      }
      // Small delay to ensure state updates before redirect
      setTimeout(() => {
        window.location.href = data.url;
      }, 100);
    } catch (error) {
      console.error('Checkout error:', error);
      const errorMessage = error.response?.data?.error || error.data?.error || 'Failed to start checkout. Please try again.';
      alert(errorMessage);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 relative overflow-y-auto">
      {/* Profile Menu */}
      <div className="absolute top-6 right-4 z-10">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="h-16 w-16 p-0 transition-transform hover:scale-105"
              style={{ color: '#0091a2' }}
            >
              <Menu className="w-8 h-8" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border-0 rounded-3xl shadow-2xl max-w-sm max-h-[90vh] overflow-auto p-0">
            <DialogHeader className="p-6 rounded-t-3xl relative" style={{ backgroundColor: '#0091a2' }}>
              <DialogTitle className="text-3xl font-bold text-center text-white">Menu</DialogTitle>
              <button
                onClick={(e) => e.currentTarget.closest('[role="dialog"]')?.querySelector('[aria-label="Close"]')?.click()}
                className="absolute right-4 top-4 text-white hover:opacity-70 transition-opacity"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </DialogHeader>
            <div className="flex flex-col items-center space-y-6 py-8 px-6" ref={(el) => el?.parentElement?.scrollTo(0, 0)}>
              <div className="relative">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                  <User className="w-12 h-12" style={{ color: '#0091a2' }} />
                </div>
                {user?.subscription_status === 'premium' && (
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

              <Link to={createPageUrl("ManageSubscription")} className="w-full">
                <Button 
                  variant="outline" 
                  className="w-full h-14 text-lg rounded-2xl border-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  <CreditCard className="w-5 h-5 mr-2" style={{ color: '#0091a2' }} />
                  Manage Subscription
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
                onClick={async () => {
                  try {
                    await base44.auth.logout();
                    window.location.reload();
                  } catch (err) {
                    console.error('Logout error:', err);
                    window.location.href = '/';
                  }
                }}
              >
                <LogOut className="w-5 h-5 mr-2" style={{ color: '#0091a2' }} />
                Sign Out
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>



      <Link to={createPageUrl("Home")} className="block text-center pt-8 pb-12">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="relative">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691a6204f2266bf3df80a940/6b6693db3_icon.png"
              alt="Rosie Rides"
              className="w-24 h-24 rounded-3xl shadow-2xl transform rotate-3 hover:rotate-6 transition-transform duration-300"
            />
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-8 h-8 animate-pulse" style={{ color: '#00c2d1' }} />
            </div>
          </div>
        </div>
        <h1 className="text-5xl sm:text-6xl font-black mb-2" style={{ color: '#0091a2' }}>
          Rosie Rides
        </h1>
      </Link>

      <div className="max-w-4xl w-full mx-auto grid md:grid-cols-2 gap-8 items-center">

        <div className="text-slate-700 space-y-6">
          <h1 className="text-5xl font-black leading-tight">
            Unlock <span className="text-yellow-400">Premium</span> Features
          </h1>
          <p className="text-xl text-slate-600">
            Get unlimited access to all senior-friendly features and ensure your loved ones travel safely.
          </p>
          
          <div className="space-y-4 mt-8">
            <div className="flex items-center gap-4">
              <div className="bg-green-500/20 p-3 rounded-xl">
                <Shield className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Enhanced Safety</h3>
                <p className="text-slate-400">Real-time emergency alerts & location sharing</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="bg-blue-500/20 p-3 rounded-xl" style={{ boxShadow: '0 8px 20px rgba(0, 145, 162, 0.4)' }}>
                <Star className="w-8 h-8" style={{ color: '#007580' }} />
              </div>
              <div>
                <h3 className="text-xl font-bold">Unlimited Destinations</h3>
                <p className="text-slate-400">Save as many favorite places as you need</p>
              </div>
            </div>
          </div>
        </div>

        <Card className="bg-white border-0 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-yellow-400 to-orange-500" />
            <CardHeader className="text-center pt-10">
                <CardTitle className="text-3xl font-black text-slate-800">Senior Premium</CardTitle>
                <CardDescription className="text-lg">Everything you need for peace of mind</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
                <div className="flex justify-center items-baseline">
                    <span className="text-6xl font-black text-slate-900">$9.99</span>
                    <span className="text-xl text-slate-500 ml-2">/year</span>
                </div>
                
                <ul className="space-y-3 text-left max-w-xs mx-auto">
                    {['Unlimited Destinations', 'Emergency Alerts', 'Ad-free Experience', 'Family Dashboard'].map((feature) => (
                        <li key={feature} className="flex items-center gap-3">
                            <div className="bg-green-100 rounded-full p-1">
                                <Check className="w-4 h-4 text-green-600" />
                            </div>
                            <span className="text-slate-700 font-medium">{feature}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
            <CardFooter className="pb-10">
                <Button 
                    onClick={handleSubscribe} 
                    disabled={isProcessing}
                    className="w-full h-16 text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white shadow-lg rounded-xl transition-all hover:scale-105"
                >
                    {isProcessing ? "Processing..." : "Subscribe Now"}
                </Button>
            </CardFooter>
        </Card>

      </div>

      <div className="text-center py-8 text-gray-500 text-sm">
        © 2026 Rosie Rides. All rights reserved.
      </div>
    </div>
  );
}