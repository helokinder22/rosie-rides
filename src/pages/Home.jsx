import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, MapPin, Car, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import DestinationCard from "../components/DestinationCard";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Home() {
  const { data: destinations, isLoading } = useQuery({
    queryKey: ['destinations'],
    queryFn: () => base44.entities.Destination.list('-created_date'),
    initialData: [],
  });

  const openUber = (destination) => {
    const pickup = "current_location";
    const dropoff = encodeURIComponent(destination.address);
    const uberUrl = `uber://?action=setPickup&pickup=${pickup}&dropoff[formatted_address]=${dropoff}`;
    
    window.location.href = uberUrl;
    
    setTimeout(() => {
      const webUrl = `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[formatted_address]=${dropoff}`;
      window.open(webUrl, '_blank');
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-600 flex items-center justify-center">
        <div className="text-3xl text-white font-bold animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-600 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-60 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-3xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-6 transition-transform duration-300">
                <Car className="w-14 h-14 text-white" />
              </div>
              <div className="absolute -top-2 -right-2">
                <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
              </div>
            </div>
          </div>
          
          <h1 className="text-6xl sm:text-7xl font-black text-white mb-4 drop-shadow-lg">
            Where to?
          </h1>
          <div className="inline-block bg-white/20 backdrop-blur-md rounded-full px-8 py-4 border-2 border-white/30">
            <p className="text-2xl sm:text-3xl text-white font-semibold">
              🚗 Tap your destination below
            </p>
          </div>
        </div>

        {destinations.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="max-w-2xl mx-auto bg-white/95 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border-4 border-white/50">
              <div className="w-32 h-32 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <MapPin className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-slate-800 mb-4">
                No destinations yet!
              </h2>
              <p className="text-xl text-slate-600">
                Add your favorite places to get started on your journey
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {destinations.map((destination, index) => (
              <div
                key={destination.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <DestinationCard
                  destination={destination}
                  onSelect={openUber}
                />
              </div>
            ))}
          </div>
        )}

        {/* Add Destination Button */}
        <div className="flex justify-center mt-12 animate-bounce-slow">
          <Link to={createPageUrl("ManageDestinations")}>
            <Button 
              size="lg"
              className="h-24 px-14 text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 shadow-2xl rounded-3xl border-4 border-white/50 transform hover:scale-105 transition-all duration-300"
            >
              <Plus className="w-10 h-10 mr-4" />
              Add Destination
            </Button>
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out backwards;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}