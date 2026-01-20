import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Home, Settings as SettingsIcon, Sparkles, Menu, User, LogOut, CreditCard, Crown, ShieldAlert, History, Smartphone, CheckCircle } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

export default function Settings() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me(),
  });

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const updateFontSizeMutation = useMutation({
    mutationFn: async (fontSize) => {
      await base44.auth.updateMe({ font_size: fontSize });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      setIsSaving(false);
      // Reload page to apply new font size
      window.location.reload();
    },
  });

  const handleFontSizeChange = async (fontSize) => {
    setIsSaving(true);
    updateFontSizeMutation.mutate(fontSize);
  };

  const fontSizes = [
    { value: 'small', label: 'Small', description: 'Compact text for more content' },
    { value: 'medium', label: 'Medium', description: 'Default comfortable reading' },
    { value: 'large', label: 'Large', description: 'Easier to read' },
    { value: 'extra-large', label: 'Extra Large', description: 'Maximum readability' }
  ];

  const currentFontSize = user?.font_size || 'medium';
  const isPremium = user?.subscription_status === 'premium';

  return (
    <div className="min-h-screen bg-slate-100 relative overflow-y-auto">
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header with logo and buttons */}
        <div className="flex justify-between items-center mb-12">
          <div></div>

          <Link to={createPageUrl("Home")} className="flex items-center gap-2 sm:gap-3">
            <div className="relative">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691a6204f2266bf3df80a940/6b6693db3_icon.png"
                alt="Rosie Rides"
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl shadow-lg"
              />
              <div className="absolute -top-2 -right-2">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" style={{ color: '#00c2d1' }} />
              </div>
            </div>
            <h1 className="text-xl sm:text-3xl font-black" style={{ color: '#0091a2' }}>
              Rosie Rides
            </h1>
          </Link>
          
          <div>
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
                      <SettingsIcon className="w-5 h-5 mr-2" style={{ color: '#0091a2' }} />
                      Manage Destinations
                    </Button>
                  </Link>

                  <Link to={createPageUrl("EmergencyContacts")} className="w-full">
                    <Button 
                      variant="outline" 
                      className="w-full h-14 text-lg rounded-2xl border-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
                    >
                      <SettingsIcon className="w-5 h-5 mr-2" style={{ color: '#0091a2' }} />
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

                  <Link to={createPageUrl("ManageSubscription")} className="w-full">
                    <Button 
                      variant="outline" 
                      className="w-full h-14 text-lg rounded-2xl border-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
                    >
                      <CreditCard className="w-5 h-5 mr-2" style={{ color: '#0091a2' }} />
                      Manage Subscription
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
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-4 border-white/50 mb-8">
          <h2 className="text-4xl sm:text-5xl font-black mb-6 text-center" style={{ color: '#0091a2' }}>
            Settings
          </h2>
        </div>

        <Card className="bg-white border-0 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-3xl font-black text-slate-800">Font Size</CardTitle>
            <CardDescription className="text-lg">
              Choose your preferred text size for the entire app
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {fontSizes.map((size) => (
              <button
                key={size.value}
                onClick={() => handleFontSizeChange(size.value)}
                disabled={isSaving}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  currentFontSize === size.value
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800 text-lg">{size.label}</div>
                    <div className="text-slate-600 text-sm">{size.description}</div>
                  </div>
                  {currentFontSize === size.value && (
                    <CheckCircle className="w-6 h-6 text-teal-600" />
                  )}
                </div>
              </button>
            ))}
            {isSaving && (
              <p className="text-center text-slate-600 text-sm">Saving and applying changes...</p>
            )}
          </CardContent>
        </Card>

        <div className="text-center py-8 text-gray-500 text-sm">
          © 2026 Rosie Rides. All rights reserved.
        </div>
      </div>
    </div>
  );
}