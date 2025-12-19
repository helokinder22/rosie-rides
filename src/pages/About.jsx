import React from "react";
import { Button } from "@/components/ui/button";
import { Home, Sparkles, Menu, User, LogOut, CreditCard, Crown, Settings, ShieldAlert, History, Smartphone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

export default function About() {
  const navigate = useNavigate();

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me(),
  });

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-60 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

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
          <DialogContent className="bg-white/95 backdrop-blur-xl border-0 rounded-3xl shadow-2xl max-w-sm">
            <DialogHeader className="rounded-t-3xl p-6 -m-6 mb-0" style={{ backgroundColor: '#0091a2' }}>
              <DialogTitle className="text-2xl font-bold text-center text-white">Menu</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center space-y-6 py-4">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
                <User className="w-10 h-10" style={{ color: '#0091a2' }} />
              </div>
              
              <div className="text-center space-y-1">
                <h3 className="text-xl font-bold text-slate-900">{user?.full_name || 'Guest User'}</h3>
                <p className="text-slate-500">{user?.email}</p>
              </div>

              <div className="w-full bg-slate-50 rounded-xl p-4 flex items-center justify-between border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${user?.subscription_status === 'premium' ? 'bg-yellow-100 text-yellow-600' : 'bg-slate-200 text-slate-600'}`}>
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-slate-500">Plan</p>
                    <p className="font-bold text-slate-800">{user?.subscription_status === 'premium' ? 'Premium Member' : 'Free Plan'}</p>
                  </div>
                </div>
                {user?.subscription_status === 'premium' && <Crown className="w-5 h-5 text-yellow-500" />}
              </div>

              <Link to={createPageUrl("Home")} className="w-full">
                <Button 
                  variant="outline" 
                  className="w-full h-12 text-lg rounded-xl border-2 border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  <Home className="w-5 h-5 mr-2" style={{ color: '#0091a2' }} />
                  Home
                </Button>
              </Link>

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

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <Button
          variant="outline"
          size="lg"
          onClick={() => navigate(createPageUrl("Home"))}
          className="h-16 px-6 text-xl mb-8 border-4 border-slate-200 bg-white hover:bg-slate-50 shadow-xl font-bold text-slate-900"
        >
          <Home className="w-6 h-6 mr-3" />
          Back to Home
        </Button>

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 sm:p-12 shadow-2xl border-4 border-white/50">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="relative">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691a6204f2266bf3df80a940/6b6693db3_icon.png"
                alt="Rosie's Rides"
                className="w-24 h-24 rounded-3xl shadow-2xl transform rotate-3"
              />
              <div className="absolute -top-2 -right-2">
                <Sparkles className="w-8 h-8 animate-pulse" style={{ color: '#00c2d1' }} />
              </div>
            </div>
          </div>

          <h1 className="text-5xl sm:text-6xl font-black mb-8 text-center" style={{ color: '#0091a2' }}>
            About Rosie's Rides
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-2xl text-slate-700 leading-relaxed">
              Rosie's Rides makes getting an Uber effortless. Set your pickup and drop‑off in seconds, see clear options and prices, and request with one tap. The clean, friendly interface cuts the clutter so you can book faster and with confidence. Behind the scenes, Rosie's Rides talks to Uber to bring a driver to your door—while Uber handles payment, safety, and receipts. Simple, fast, and reliable.
            </p>
          </div>
        </div>

        <div className="text-center py-8 text-white text-sm opacity-70">
          © 2026 Rosie's Rides. All rights reserved.
        </div>
      </div>
    </div>
  );
}