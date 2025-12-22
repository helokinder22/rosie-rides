import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, MapPin, Car, Sparkles, Settings, Crown, Lock, User, LogOut, CreditCard, ShieldAlert, History, Menu, Smartphone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import DestinationCard from "../components/DestinationCard";
import EmergencyButton from "../components/EmergencyButton";

export default function Home() {
  const navigate = useNavigate(); // Make sure useNavigate is imported or remove if not needed (it's not imported in Home.js usually unless I check imports)
  const { data: destinations, isLoading } = useQuery({
    queryKey: ['destinations'],
    queryFn: async () => {
      console.log('Home page: Fetching destinations...');
      const data = await base44.entities.Destination.list('sort_order');
      console.log('Home page: Fetched destinations count:', data.length);
      console.log('Home page: Destinations data:', JSON.stringify(data));
      return data.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    },
    initialData: [],
    staleTime: 0, // Always refetch on mount
    refetchOnMount: 'always',
  });

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        return await base44.auth.me();
      } catch (error) {
        console.error('Failed to fetch user:', error);
        return null;
      }
    },
  });

  const isPremium = user?.subscription_status === 'premium';
  const isLimitReached = !isPremium && destinations.length >= 2;

  // Force authentication check on iPad
  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        await base44.auth.me();
        console.log('User authenticated successfully');
      } catch (error) {
        console.log('Auth check failed, redirecting to login');
        base44.auth.redirectToLogin(window.location.href);
      }
    };
    checkAuth();
  }, []);



  const handleShare = async (destination) => {
    const shareData = {
      title: 'My Trip',
      text: `I'm heading to ${destination.name} (${destination.address}) via Uber.`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to SMS for mobile or alert
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        window.open(`sms:?body=${encodeURIComponent(shareData.text)}`);
      } else {
        alert(`Share this message:\n\n${shareData.text}`);
      }
    }
  };

  const openTransportApp = async (destination) => {
    // Construct full address from separate fields or use legacy address field
    const fullAddress = destination.address || 
      [destination.number, destination.street, destination.city, destination.state, destination.zip]
        .filter(Boolean)
        .join(' ');

    console.log('Opening transportation app with destination:', destination.name);
    console.log('Full address:', fullAddress);

    // Record trip in background
    base44.entities.Trip.create({
      destination_name: destination.name,
      destination_address: fullAddress,
      category: destination.category,
      trip_date: new Date().toISOString()
    }).catch(err => console.error("Failed to record trip", err));

    // Notify contacts in background
    const notifyContacts = async () => {
      try {
        const contacts = await base44.entities.EmergencyContact.list();
        const notifyList = contacts.filter(c => c.notify_on_ride !== false);
        if (notifyList.length > 0) {
          const emailPromises = notifyList.map(contact => 
            base44.integrations.Core.SendEmail({
              to: contact.email,
              subject: `🚗 Trip Alert: ${user?.full_name || 'User'} is going to ${destination.name}`,
              body: `
  Hello ${contact.name},

  ${user?.full_name || 'User'} has just tapped to go to:

  📍 ${destination.name}
  🏠 ${fullAddress}

  Time: ${new Date().toLocaleString()}

  They are opening the transportation app now.
            `
            })
          );
          await Promise.all(emailPromises);
        }
      } catch (error) {
        console.error("Failed to notify contacts", error);
      }
    };
    notifyContacts();

    // Try multiple URL formats for best compatibility
    const encodedAddress = encodeURIComponent(fullAddress);
    const encodedName = encodeURIComponent(destination.name);
    
    // Format 1: Try with coordinates first (most reliable)
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}`);
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        console.log('Geocoded coordinates:', lat, lon);
        // Use universal link format with coordinates
        const uberUrl = `uber://?action=setPickup&pickup=my_location&dropoff[latitude]=${lat}&dropoff[longitude]=${lon}&dropoff[nickname]=${encodedName}`;
        console.log('Opening transportation URL:', uberUrl);
        window.location.href = uberUrl;
        return;
      }
    } catch (error) {
      console.error("Geocoding failed", error);
    }

    // Format 2: Fallback to address-based deep link
    console.log('Using address-based fallback');
    const uberUrl = `uber://?action=setPickup&pickup=my_location&dropoff[formatted_address]=${encodedAddress}&dropoff[nickname]=${encodedName}`;
    console.log('Opening transportation URL:', uberUrl);
    window.location.href = uberUrl;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-600 flex items-center justify-center">
        <div className="text-3xl text-white font-bold animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-60 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Profile Button */}
        <div className="absolute top-0 right-4 z-10">
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
                <button
                  onClick={(e) => e.currentTarget.closest('[role="dialog"]')?.querySelector('[data-radix-dismissable]')?.click()}
                  className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  <span className="sr-only">Close</span>
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

                <Button 
                  className="w-full h-16 text-xl rounded-2xl text-white font-bold shadow-lg"
                  style={{ backgroundColor: '#0091a2' }}
                  disabled
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 mr-2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  Home
                </Button>

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
                  onClick={() => base44.auth.logout()}
                >
                  <LogOut className="w-5 h-5 mr-2" style={{ color: '#0091a2' }} />
                  Sign Out
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="relative">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691a6204f2266bf3df80a940/6b6693db3_icon.png"
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

          <h2 className="text-3xl sm:text-4xl font-black mb-4 text-gray-700">
            Where are you going?
          </h2>
          <div className="inline-block">
            <p className="text-2xl sm:text-3xl text-gray-700 font-bold flex items-center justify-center gap-3">
              <Car className="w-8 h-8" style={{ color: '#0091a2' }} />
              Tap your destination below
            </p>
          </div>

          {destinations.length === 0 && (
            <div className="mt-8 flex justify-center">
              <Link to={createPageUrl("ManageDestinations")}>
                <Button
                  size="lg"
                  className="h-20 px-10 text-2xl text-gray-700 shadow-xl font-bold rounded-3xl border-4 border-white/50"
                  style={{ backgroundColor: '#ffc20c' }}
                >
                  <Plus className="w-7 h-7 mr-3" />
                  Add Destination
                </Button>
              </Link>
            </div>
          )}
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
                  onSelect={openTransportApp}
                  onShare={handleShare}
                />
              </div>
            ))}
          </div>
        )}

        {destinations.length > 0 && (
          <div className="flex justify-center mt-12 animate-bounce-slow">
            <Link to={createPageUrl("ManageDestinations")}>
              <Button 
                size="lg"
                className="h-16 sm:h-20 md:h-24 px-6 sm:px-10 md:px-14 text-xl sm:text-2xl md:text-3xl font-bold text-gray-700 shadow-2xl rounded-3xl border-4 border-white/30 transform hover:scale-105 transition-all duration-300"
                style={{ backgroundColor: '#ffc20c' }}
              >
                <Plus className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 mr-2 sm:mr-3 md:mr-4" />
                Add/Edit Destination
              </Button>
            </Link>
          </div>
        )}
        </div>

        <div className="text-center py-8 text-gray-500 text-sm">
          © 2026 Rosie Rides. All rights reserved.
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