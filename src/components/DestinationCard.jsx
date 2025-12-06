import React from "react";
import { Card } from "@/components/ui/card";
import { 
  Stethoscope, 
  ShoppingCart, 
  Scissors, 
  Pill, 
  Utensils, 
  Users, 
  MapPin,
  ArrowRight,
  Share2
} from "lucide-react";

const categoryConfig = {
  doctor: { 
    icon: Stethoscope, 
    gradient: "from-blue-400 to-blue-600", 
    label: "Doctor",
    emoji: "🏥"
  },
  grocery: { 
    icon: ShoppingCart, 
    gradient: "from-green-400 to-green-600", 
    label: "Grocery",
    emoji: "🛒"
  },
  salon: { 
    icon: Scissors, 
    gradient: "from-pink-400 to-pink-600", 
    label: "Salon",
    emoji: "💇"
  },
  pharmacy: { 
    icon: Pill, 
    gradient: "from-red-400 to-red-600", 
    label: "Pharmacy",
    emoji: "💊"
  },
  restaurant: { 
    icon: Utensils, 
    gradient: "from-orange-400 to-orange-600", 
    label: "Restaurant",
    emoji: "🍽️"
  },
  family: { 
    icon: Users, 
    gradient: "from-purple-400 to-purple-600", 
    label: "Family",
    emoji: "👨‍👩‍👧‍👦"
  },
  other: { 
    icon: MapPin, 
    gradient: "from-slate-400 to-slate-600", 
    label: "Other",
    emoji: "📍"
  },
};

export default function DestinationCard({ destination, onSelect, onShare }) {
  const config = categoryConfig[destination.category] || categoryConfig.other;
  const Icon = config.icon;

  return (
    <Card
      onClick={() => onSelect(destination)}
      className="group cursor-pointer border-0 transition-all duration-300 hover:scale-105 bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl overflow-hidden relative"
    >
      {/* Decorative gradient bar */}
      <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${config.gradient}`}></div>
      
      {/* Hover effect overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
      
      {/* Share Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onShare(destination);
        }}
        className="absolute top-4 right-4 z-10 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 text-slate-600 hover:text-blue-600"
        title="Share Trip Details"
      >
        <Share2 className="w-5 h-5" />
      </button>

      <div className="relative p-8">
        <div className="flex flex-col space-y-6">
          {/* Icon and emoji */}
          <div className="flex items-center justify-between">
            <div className={`w-20 h-20 bg-gradient-to-br ${config.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-all duration-300`}>
              <Icon className="w-11 h-11 text-white" />
            </div>
            <div className="text-5xl group-hover:scale-125 transition-transform duration-300">
              {config.emoji}
            </div>
          </div>
          
          {/* Content */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 bg-gradient-to-r ${config.gradient} text-white text-sm font-semibold rounded-full`}>
                {config.label}
              </span>
            </div>
            
            <h3 className="text-3xl font-black text-slate-800 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-800 group-hover:to-slate-600 transition-all duration-300">
              {destination.name}
            </h3>
            
            <p className="text-lg text-slate-600 leading-relaxed line-clamp-2">
              {destination.address}
            </p>
          </div>

          {/* Call to action */}
          <div className={`flex items-center justify-between pt-4 border-t-2 border-slate-100 group-hover:border-transparent transition-colors duration-300`}>
            <span className="text-xl font-bold text-slate-700 group-hover:text-slate-900">
              Call Uber
            </span>
            <div className={`w-12 h-12 bg-gradient-to-br ${config.gradient} rounded-full flex items-center justify-center group-hover:translate-x-2 transition-transform duration-300 shadow-md`}>
              <ArrowRight className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}