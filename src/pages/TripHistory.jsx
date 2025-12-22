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
    queryFn: () => base44.entities.Trip.list('-created_date', 100), // Get last 100 trips
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
    <div className="min-h-screen bg-slate-50 relative overflow-y-auto">
      <div className="absolute top-0 left-0 w-full h-64 rounded-b-[3rem] shadow-2xl" style={{ backgroundColor: '#0091a2' }}></div>

      {/* Profile Menu */}
      <div className="absolute top-8 right-4 z-10">
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
            <div className="flex flex-col items-center space-y-6 py-4" ref={(el) => el?.parentElement?.scrollTo(0, 0)}>
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
                  className="w-full h-12 rounded-xl border-2 text-white font-bold"
                  style={{ backgroundColor: '#0091a2', borderColor: '#0091a2' }}
                >
                  <Home className="w-5 h-5" />
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

              <Link to={createPageUrl("About")} className="w-full">
                <Button 
                  variant="outline" 
                  className="w-full h-12 text-lg rounded-xl border-2 border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  <Sparkles className="w-5 h-5 mr-2" style={{ color: '#0091a2' }} />
                  About
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

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <Button
          variant="secondary"
          size="lg"
          onClick={() => navigate(createPageUrl("Home"))}
          className="mb-8 h-14 w-14 bg-white/20 hover:bg-white/30 border border-white/30 backdrop-blur-md p-0"
        >
          <Home className="w-6 h-6 text-white" />
        </Button>

        <div className="flex items-center gap-4 mb-8 text-white">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
            <History className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-black">Trip History</h1>
            <p className="text-blue-100 text-lg">Your past journeys</p>
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