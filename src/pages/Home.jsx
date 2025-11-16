import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, MapPin } from "lucide-react";
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
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-2xl text-slate-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
              <MapPin className="w-9 h-9 text-white" />
            </div>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-800 mb-3">
            My Destinations
          </h1>
          <p className="text-2xl text-slate-600">
            Tap a destination to call an Uber
          </p>
        </div>

        {destinations.length === 0 ? (
          <div className="text-center py-16">
            <Alert className="max-w-2xl mx-auto bg-blue-50 border-blue-200">
              <AlertDescription className="text-xl text-slate-700">
                You haven't added any destinations yet. Tap the button below to add your first destination!
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {destinations.map((destination) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                onSelect={openUber}
              />
            ))}
          </div>
        )}

        <div className="flex justify-center mt-12">
          <Link to={createPageUrl("ManageDestinations")}>
            <Button 
              size="lg"
              className="h-20 px-12 text-2xl bg-green-600 hover:bg-green-700 shadow-xl rounded-2xl"
            >
              <Plus className="w-8 h-8 mr-3" />
              Add Destination
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}