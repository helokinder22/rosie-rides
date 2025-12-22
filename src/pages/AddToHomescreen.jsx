import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Smartphone, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function AddToHomescreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-60 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <Button
          variant="outline"
          size="lg"
          onClick={() => navigate(createPageUrl("Home"))}
          className="h-16 w-16 mb-8 border-4 border-slate-200 bg-white hover:bg-slate-50 shadow-xl p-0"
        >
          <Home className="w-6 h-6" style={{ color: '#0091a2' }} />
        </Button>

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 sm:p-12 shadow-2xl border-4 border-white/50 mb-8">
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