import React, { useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Home, Search, History, CalendarRange, Menu, User, LogOut, CreditCard, Crown, Settings, Sparkles, ShieldAlert, Smartphone } from "lucide-react";
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
import TripHistoryItem from "../components/TripHistoryItem";
import { subDays, isAfter, startOfDay } from "date-fns";

export default function TripHistory() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");

  const { data: trips, isLoading } = useQuery({
    queryKey: ['trips'],
    queryFn: () => base44.entities.Trip.list('-created_date', 100),
    initialData: [],
  });

  const toggleCompleteMutation = useMutation({
    mutationFn: ({ id, completed }) => base44.entities.Trip.update(id, { completed }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
  });

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me(),
  });

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredTrips = useMemo(() => {
    return trips.filter(trip => {
      const matchesSearch = 
        (trip.destination_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (trip.destination_address?.toLowerCase() || "").includes(searchTerm.toLowerCase());

      let matchesTime = true;
      const tripDate = new Date(trip.trip_date || trip.created_date);
      
      if (timeFilter === "7days") {
        matchesTime = isAfter(tripDate, subDays(new Date(), 7));
      } else if (timeFilter === "30days") {
        matchesTime = isAfter(tripDate, subDays(new Date(), 30));
      } else if (timeFilter === "today") {
        matchesTime = isAfter(tripDate, startOfDay(new Date()));
      }

      return matchesSearch && matchesTime;
    });
  }, [trips, searchTerm, timeFilter]);

  return (
    <div className="min-h-screen bg-slate-100 relative overflow-y-auto">

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Header with logo and buttons */}
        <div className="flex justify-between items-center mb-12">
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate(createPageUrl("Home"))}
            className="h-16 w-16 border-4 border-white/50 bg-white hover:bg-slate-50 shadow-xl rounded-2xl p-0"
          >
            <Home className="w-6 h-6" style={{ color: '#0091a2' }} />
          </Button>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691a6204f2266bf3df80a940/6b6693db3_icon.png"
              alt="Rosie Rides"
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl shadow-lg"
            />
            <h1 className="text-xl sm:text-3xl font-black" style={{ color: '#0091a2' }}>
              Rosie Rides
            </h1>
          </div>
          
          <div>
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

                <Link to={createPageUrl("EmergencyContacts")} className="w-full">
                  <Button 
                    variant="outline" 
                    className="w-full h-14 text-lg rounded-2xl border-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
                  >
                    <Settings className="w-5 h-5 mr-2" style={{ color: '#0091a2' }} />
                    Emergency Contacts
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
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border-2 border-slate-200 shadow-lg">
            <History className="w-8 h-8" style={{ color: '#0091a2' }} />
          </div>
          <div>
            <h2 className="text-4xl font-black" style={{ color: '#0091a2' }}>Trip History</h2>
            <p className="text-slate-600 text-lg">Your past journeys</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 mb-8">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                placeholder="Search destinations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-lg bg-slate-50 border-slate-200"
              />
            </div>
            <div className="flex items-center gap-2">
              <CalendarRange className="w-5 h-5 text-slate-400" />
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="h-12 text-lg bg-slate-50 border-slate-200">
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-4 pb-12">
          {isLoading ? (
            <div className="text-center py-12 text-slate-400">Loading history...</div>
          ) : filteredTrips.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <History className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-600">No trips found</h3>
              <p className="text-slate-400">Your trip history will appear here</p>
            </div>
          ) : (
            filteredTrips.map((trip) => (
              <TripHistoryItem 
                key={trip.id} 
                trip={trip}
                onToggleComplete={() => toggleCompleteMutation.mutate({ id: trip.id, completed: !trip.completed })}
              />
            ))
          )}
        </div>

        <div className="text-center py-8 text-gray-500 text-sm">
          © 2026 Rosie Rides. All rights reserved.
        </div>
      </div>
    </div>
  );
}