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
import PageMenuHeader from "@/components/PageMenuHeader";
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

  const deleteTripMutation = useMutation({
    mutationFn: (id) => base44.entities.Trip.delete(id),
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
        <PageMenuHeader />

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
                onDelete={() => deleteTripMutation.mutate(trip.id)}
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