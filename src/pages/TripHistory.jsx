import React, { useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Home, Search, Filter, History, CalendarRange } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import TripHistoryItem from "../components/TripHistoryItem";
import { subDays, isAfter, startOfDay } from "date-fns";

export default function TripHistory() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");

  const { data: trips, isLoading } = useQuery({
    queryKey: ['trips'],
    queryFn: () => base44.entities.Trip.list('-created_date', 100), // Get last 100 trips
    initialData: [],
  });

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
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-b-[3rem] shadow-2xl"></div>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <Button
          variant="secondary"
          size="lg"
          onClick={() => navigate(createPageUrl("Home"))}
          className="mb-8 bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-md"
        >
          <Home className="w-5 h-5 mr-2" />
          Back to Home
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
              <TripHistoryItem key={trip.id} trip={trip} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}