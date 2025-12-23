import React from "react";
import { Button } from "@/components/ui/button";
import { Home, Sparkles, Menu, User, LogOut, CreditCard, Crown, Settings, ShieldAlert, History, Smartphone } from "lucide-react";
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
import { base44 } from "@/api/base44Client";

export default function About() {
  const navigate = useNavigate();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
        {/* Profile Menu */}
        <div className="absolute top-0 right-0 z-10">
          <Dialog>
          variant="outline"
          size="lg"
          onClick={() => navigate(createPageUrl("Home"))}
          className="h-16 w-16 mb-8 border-4 border-slate-200 bg-white hover:bg-slate-50 shadow-xl p-0"
        >
          <Home className="w-6 h-6" style={{ color: '#0091a2' }} />
        </Button>

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 sm:p-12 shadow-2xl border-4 border-white/50">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="relative">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691a6204f2266bf3df80a940/6b6693db3_icon.png"
                alt="Rosie Rides"
                className="w-24 h-24 rounded-3xl shadow-2xl transform rotate-3"
              />
              <div className="absolute -top-2 -right-2">
                <Sparkles className="w-8 h-8 animate-pulse" style={{ color: '#00c2d1' }} />
              </div>
            </div>
          </div>

          <h1 className="text-5xl sm:text-6xl font-black mb-8 text-center" style={{ color: '#0091a2' }}>
            About Rosie Rides
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-2xl text-slate-700 leading-relaxed">
              Rosie Rides makes getting a ride effortless. Set your pickup and drop‑off in seconds, see clear options and prices, and request with one tap. The clean, friendly interface cuts the clutter so you can book faster and with confidence. Behind the scenes, Rosie Rides connects to transportation services to bring a driver to your door—handling payment, safety, and receipts. Simple, fast, and reliable.
            </p>
          </div>
        </div>

        <div className="text-center py-8 text-gray-500 text-sm">
          © 2026 Rosie Rides. All rights reserved.
        </div>
      </div>
    </div>
  );
}