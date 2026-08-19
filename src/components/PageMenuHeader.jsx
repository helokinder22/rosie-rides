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
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";

const LOGO_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691a6204f2266bf3df80a940/6b6693db3_icon.png";

export default function PageMenuHeader() {
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me(),
  });

  const isPremium = user?.subscription_status === 'premium';

  return (
    <>
      {/* Menu button - absolute top-right like homepage */}
      <div className="absolute top-0 right-0 z-10">
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
                <Button className="w-full h-16 text-xl rounded-2xl text-white font-bold shadow-lg" style={{ backgroundColor: '#0091a2' }}>
                  <Home className="w-6 h-6 mr-2" />
                  Home
                </Button>
              </Link>

              <Link to={createPageUrl("ManageDestinations")} className="w-full">
                <Button variant="outline" className="w-full h-14 text-lg rounded-2xl border-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold">
                  <Settings className="w-5 h-5 mr-2" style={{ color: '#0091a2' }} />
                  Manage Destinations
                </Button>
              </Link>

              <Link to={createPageUrl("Settings")} className="w-full">
                <Button variant="outline" className="w-full h-14 text-lg rounded-2xl border-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold">
                  <Settings className="w-5 h-5 mr-2" style={{ color: '#0091a2' }} />
                  Settings
                </Button>
              </Link>

              <Link to={createPageUrl("EmergencyContacts")} className="w-full">
                <Button variant="outline" className="w-full h-14 text-lg rounded-2xl border-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold">
                  <Settings className="w-5 h-5 mr-2" style={{ color: '#0091a2' }} />
                  Emergency Contacts
                </Button>
              </Link>

              <Link to={createPageUrl("TripHistory")} className="w-full">
                <Button variant="outline" className="w-full h-14 text-lg rounded-2xl border-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold">
                  <History className="w-5 h-5 mr-2" style={{ color: '#0091a2' }} />
                  Trip History
                </Button>
              </Link>

              <Link to={createPageUrl("ManageSubscription")} className="w-full">
                <Button variant="outline" className="w-full h-14 text-lg rounded-2xl border-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold">
                  <CreditCard className="w-5 h-5 mr-2" style={{ color: '#0091a2' }} />
                  Manage Subscription
                </Button>
              </Link>

              <Link to={createPageUrl("About")} className="w-full">
                <Button variant="outline" className="w-full h-14 text-lg rounded-2xl border-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold">
                  <Sparkles className="w-5 h-5 mr-2" style={{ color: '#0091a2' }} />
                  About
                </Button>
              </Link>

              <Link to={createPageUrl("AddToHomescreen")} className="w-full">
                <Button variant="outline" className="w-full h-14 text-lg rounded-2xl border-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold">
                  <Smartphone className="w-5 h-5 mr-2" style={{ color: '#0091a2' }} />
                  Add to Homescreen
                </Button>
              </Link>

              <Link to={createPageUrl("Disclaimer")} className="w-full">
                <Button variant="outline" className="w-full h-14 text-lg rounded-2xl border-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold">
                  <ShieldAlert className="w-5 h-5 mr-2" style={{ color: '#0091a2' }} />
                  Disclaimer
                </Button>
              </Link>

              <Button
                className="w-full h-14 text-lg rounded-2xl text-gray-700 font-bold"
                style={{ backgroundColor: '#ffc20c' }}
                onClick={() => base44.auth.logout('/')}
              >
                <LogOut className="w-5 h-5 mr-2" style={{ color: '#0091a2' }} />
                Sign Out
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Logo + title - centered like homepage */}
      <Link to={createPageUrl("Home")} className="block text-center mb-8">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="relative">
            <img
              src={LOGO_URL}
              alt="Rosie Rides"
              className="w-24 h-24 rounded-3xl shadow-2xl transform rotate-3 hover:rotate-6 transition-transform duration-300"
            />
            <div className="absolute -top-4 -right-3">
              <Sparkles className="w-5 h-5 animate-pulse" style={{ color: '#00c2d1' }} />
            </div>
          </div>
        </div>
        <h1 className="text-5xl sm:text-6xl font-black mb-2" style={{ color: '#0091a2' }}>
          Rosie Rides
        </h1>
      </Link>
    </>
  );
}