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
import PageMenuHeader from "@/components/PageMenuHeader";
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
    <div className="min-h-screen relative overflow-y-auto bg-slate-100">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-60 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <PageMenuHeader />

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 sm:p-12 shadow-2xl border-4 border-white/50">

          <h2 className="text-4xl sm:text-5xl font-black mb-8 text-center" style={{ color: '#0091a2' }}>
            About
          </h2>

          <div className="prose prose-lg max-w-none">
            <p className="text-2xl text-slate-700 leading-relaxed">
              Rosie Rides makes getting a ride effortless. Set your pickup and drop‑off in seconds, see clear options and prices, and request with one tap. The clean, friendly interface cuts the clutter so you can book faster and with confidence. Behind the scenes, Rosie Rides connects to transportation services to bring a driver to your door—handling payment, safety, and receipts. Simple, fast, and reliable.
            </p>

            <div className="mt-8 pt-8 border-t border-slate-200">
              <p className="text-xl text-slate-600 text-center">
                Questions? Contact us at{' '}
                <a href="mailto:info@rosierides.com" className="font-bold hover:underline" style={{ color: '#0091a2' }}>
                  info@rosierides.com
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="text-center py-8 text-gray-500 text-sm">
          © 2026 Rosie Rides. All rights reserved.
        </div>
      </div>
    </div>
  );
}