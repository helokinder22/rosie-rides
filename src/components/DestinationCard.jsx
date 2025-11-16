import React from "react";
import { Card } from "@/components/ui/card";
import { 
  Stethoscope, 
  ShoppingCart, 
  Scissors, 
  Pill, 
  Utensils, 
  Users, 
  MapPin 
} from "lucide-react";

const categoryConfig = {
  doctor: { icon: Stethoscope, color: "bg-blue-500", label: "Doctor" },
  grocery: { icon: ShoppingCart, color: "bg-green-500", label: "Grocery" },
  salon: { icon: Scissors, color: "bg-pink-500", label: "Salon" },
  pharmacy: { icon: Pill, color: "bg-red-500", label: "Pharmacy" },
  restaurant: { icon: Utensils, color: "bg-orange-500", label: "Restaurant" },
  family: { icon: Users, color: "bg-purple-500", label: "Family" },
  other: { icon: MapPin, color: "bg-slate-500", label: "Other" },
};

export default function DestinationCard({ destination, onSelect }) {
  const config = categoryConfig[destination.category] || categoryConfig.other;
  const Icon = config.icon;

  return (
    <Card
      onClick={() => onSelect(destination)}
      className="group cursor-pointer border-3 hover:border-blue-400 transition-all duration-200 hover:shadow-2xl hover:scale-105 bg-white"
    >
      <div className="p-8">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className={`w-24 h-24 ${config.color} rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}>
            <Icon className="w-14 h-14 text-white" />
          </div>
          
          <div className="space-y-2 w-full">
            <h3 className="text-3xl font-bold text-slate-800 leading-tight">
              {destination.name}
            </h3>
            <p className="text-lg text-slate-600 leading-relaxed break-words">
              {destination.address}
            </p>
          </div>

          <div className="w-full pt-4 border-t border-slate-200">
            <div className="text-xl font-semibold text-blue-600">
              Tap to Call Uber
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}