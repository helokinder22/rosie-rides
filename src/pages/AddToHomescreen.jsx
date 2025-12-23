import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Smartphone, Sparkles, Menu, User, LogOut, CreditCard, Crown, Settings, ShieldAlert, History } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

export default function AddToHomescreen() {
  const navigate = useNavigate();

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me(),
  });

  return (
    <div className="min-h-screen relative overflow-y-auto" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-60 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Home Button */}
        <Button
          variant="outline"
          size="lg"
          onClick={() => navigate(createPageUrl("Home"))}
          className="absolute top-0 left-0 h-16 w-16 border-4 border-white/50 bg-white hover:bg-slate-50 shadow-xl rounded-2xl p-0 z-10"
        >
          <Home className="w-6 h-6" style={{ color: '#0091a2' }} />
        </Button>

        {/* Profile Menu */}
        <div className="absolute top-0 right-0 z-10">
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

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 sm:p-12 shadow-2xl border-4 border-white/50 mt-24 mb-8">
          <div className="flex items-center justify-center gap-4 mb-8">
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

          <h1 className="text-5xl sm:text-6xl font-black mb-6 text-center" style={{ color: '#0091a2' }}>
            Add to Homescreen
          </h1>

          <p className="text-xl text-slate-600 text-center mb-8">
            Here's how to add Rosie Rides to your home screen:
          </p>
        </div>

        <div className="space-y-6">
          <Card className="border-0 bg-white/95 backdrop-blur-sm shadow-xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-400 to-purple-500"></div>
            <CardHeader className="pt-8">
              <CardTitle className="text-3xl font-black text-slate-800 flex items-center gap-3">
                <span className="text-4xl">🍎</span>
                iPhone/iPad (Safari)
              </CardTitle>
            </CardHeader>
            <CardContent className="text-lg text-slate-700 space-y-2">
              <ol className="list-decimal list-inside space-y-2">
                <li>Open Rosie Rides in Safari.</li>
                <li>Tap the Share icon.</li>
                <li>Choose Add to Home Screen.</li>
                <li>Tap Add.</li>
              </ol>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/95 backdrop-blur-sm shadow-xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-400 to-teal-500"></div>
            <CardHeader className="pt-8">
              <CardTitle className="text-3xl font-black text-slate-800 flex items-center gap-3">
                <span className="text-4xl">🤖</span>
                Android (Chrome)
              </CardTitle>
            </CardHeader>
            <CardContent className="text-lg text-slate-700 space-y-2">
              <ol className="list-decimal list-inside space-y-2">
                <li>Open Rosie Rides in Chrome.</li>
                <li>Tap the three‑dot menu.</li>
                <li>Tap Add to Home screen or Install app.</li>
                <li>Confirm Add.</li>
              </ol>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/95 backdrop-blur-sm shadow-xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-400 to-red-500"></div>
            <CardHeader className="pt-8">
              <CardTitle className="text-3xl font-black text-slate-800 flex items-center gap-3">
                <span className="text-4xl">🦊</span>
                Android (Firefox)
              </CardTitle>
            </CardHeader>
            <CardContent className="text-lg text-slate-700 space-y-2">
              <ol className="list-decimal list-inside space-y-2">
                <li>Open Rosie Rides.</li>
                <li>Tap the three‑dot menu.</li>
                <li>Tap Install or Add to Home screen.</li>
                <li>Confirm.</li>
              </ol>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/95 backdrop-blur-sm shadow-xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-400 to-pink-500"></div>
            <CardHeader className="pt-8">
              <CardTitle className="text-3xl font-black text-slate-800 flex items-center gap-3">
                <span className="text-4xl">🌐</span>
                Samsung Internet
              </CardTitle>
            </CardHeader>
            <CardContent className="text-lg text-slate-700 space-y-2">
              <ol className="list-decimal list-inside space-y-2">
                <li>Open Rosie Rides.</li>
                <li>Tap the menu (≡).</li>
                <li>Tap Add page to and choose Home screen.</li>
              </ol>
            </CardContent>
          </Card>
        </div>

        <div className="text-center py-8 text-gray-500 text-sm">
          © 2026 Rosie Rides. All rights reserved.
        </div>
      </div>
    </div>
  );
}