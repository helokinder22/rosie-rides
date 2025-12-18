import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, MapPin, Car, Sparkles, Settings, Crown, Lock, User, LogOut, CreditCard, ShieldAlert, History, Menu } from "lucide-react";
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
    queryFn: () => base44.entities.Destination.list('-created_date'),
    initialData: [],
  });

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me(),
  });

  const isPremium = user?.subscription_status === 'premium';
  const isLimitReached = !isPremium && destinations.length >= 2;

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

  const openUber = async (destination) => {
    // Record trip in background
    base44.entities.Trip.create({
      destination_name: destination.name,
      destination_address: destination.address,
      category: destination.category,
      trip_date: new Date().toISOString()
    }).catch(err => console.error("Failed to record trip", err));

    // Notify contacts in background
    const notifyContacts = async () => {
      try {
        const contacts = await base44.entities.EmergencyContact.list();
        if (contacts.length > 0) {
          const emailPromises = contacts.map(contact => 
            base44.integrations.Core.SendEmail({
              to: contact.email,
              subject: `🚗 Trip Alert: ${user?.full_name || 'User'} is going to ${destination.name}`,
              body: `
Hello ${contact.name},

${user?.full_name || 'User'} has just tapped to go to:

📍 ${destination.name}
🏠 ${destination.address}

Time: ${new Date().toLocaleString()}

They are opening the Uber app now.
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
                style={{ color: '#4A90E2' }}
              >
                <Menu className="w-8 h-8" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white/95 backdrop-blur-xl border-0 rounded-3xl shadow-2xl max-w-sm">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-center text-slate-800">My Profile</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center space-y-6 py-4">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-slate-400" />
                </div>
                
                <div className="text-center space-y-1">
                  <h3 className="text-xl font-bold text-slate-900">{user?.full_name || 'Guest User'}</h3>
                  <p className="text-slate-500">{user?.email}</p>
                </div>

                <div className="w-full bg-slate-50 rounded-xl p-4 flex items-center justify-between border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isPremium ? 'bg-yellow-100 text-yellow-600' : 'bg-slate-200 text-slate-600'}`}>
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-slate-500">Plan</p>
                      <p className="font-bold text-slate-800">{isPremium ? 'Premium Member' : 'Free Plan'}</p>
                    </div>
                  </div>
                  {isPremium && <Crown className="w-5 h-5 text-yellow-500" />}
                </div>

                <Link to={createPageUrl("TripHistory")} className="w-full">
                  <Button 
                    variant="outline" 
                    className="w-full h-12 text-lg rounded-xl border-2 border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    <History className="w-5 h-5 mr-2" />
                    Trip History
                  </Button>
                </Link>

                <Link to={createPageUrl("Disclaimer")} className="w-full">
                  <Button 
                    variant="outline" 
                    className="w-full h-12 text-lg rounded-xl border-2 border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    <ShieldAlert className="w-5 h-5 mr-2" />
                    Disclaimer
                  </Button>
                </Link>

                <Button 
                  variant="destructive" 
                  className="w-full h-12 text-lg rounded-xl mt-2"
                  onClick={() => base44.auth.logout()}
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Sign Out
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

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

          <h1 className="text-5xl sm:text-6xl font-black mb-2 drop-shadow-lg" style={{ color: '#4A90E2' }}>
            Rosie's Rides
          </h1>

          <a 
            href="https://m.uber.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-3xl sm:text-4xl font-black text-white mb-4 drop-shadow-lg hover:text-yellow-200 transition-colors cursor-pointer block"
          >
            Where are you going?
          </a>
          <div className="inline-block bg-black/40 backdrop-blur-md rounded-full px-8 py-4 border-2 border-white/20">
            <p className="text-2xl sm:text-3xl text-white font-bold drop-shadow-md">
              🚗 Tap your destination below
            </p>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <EmergencyButton className="h-20 px-10 text-2xl rounded-3xl" />
            <Link to={createPageUrl("EmergencyContacts")}>
              <Button
                size="lg"
                variant="outline"
                className="h-20 px-10 text-2xl bg-white/90 hover:bg-white backdrop-blur-sm shadow-xl font-bold rounded-3xl border-3 border-white"
              >
                <Settings className="w-7 h-7 mr-3" />
                Contacts
              </Button>
            </Link>
            {!isPremium && (
              <Link to={createPageUrl("Subscription")}>
                <Button
                  size="lg"
                  className="h-20 px-10 text-2xl bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white shadow-xl font-bold rounded-3xl border-4 border-white/50"
                >
                  <Crown className="w-7 h-7 mr-3" />
                  Premium
                </Button>
              </Link>
            )}
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
                  onShare={handleShare}
                />
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-12 animate-bounce-slow">
          {isLimitReached ? (
            <Link to={createPageUrl("Subscription")}>
              <Button 
                size="lg"
                className="h-24 px-14 text-3xl font-bold bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white shadow-2xl rounded-3xl border-4 border-white/30 transform hover:scale-105 transition-all duration-300"
              >
                <Lock className="w-10 h-10 mr-4" />
                Unlock More
              </Button>
            </Link>
          ) : (
            <Link to={createPageUrl("ManageDestinations")}>
              <Button 
                size="lg"
                className="h-24 px-14 text-3xl font-bold text-white shadow-2xl rounded-3xl border-4 border-white/30 transform hover:scale-105 transition-all duration-300"
                style={{ backgroundColor: '#4A90E2' }}
              >
                <Plus className="w-10 h-10 mr-4" />
                Add Destination
              </Button>
            </Link>
          )}
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