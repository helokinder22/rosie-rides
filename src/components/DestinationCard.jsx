import React from "react";
import {
  Stethoscope,
  ShoppingCart,
  Scissors,
  Pill,
  Utensils,
  Users,
  MapPin,
  Home,
  Share2,
  Coffee,
  Dumbbell,
  Hospital,
  Building2,
  Landmark,
  Music,
  Trees,
  PawPrint,
  ShoppingBag,
  Church,
  Mountain,
  Star,
  Train,
  Plane,
  Bus,
  GraduationCap
} from "lucide-react";

const categoryConfig = {
  airport: { icon: Plane, color: "#1B4965", label: "Airport" },
  bus_station: { icon: Bus, color: "#2E8B57", label: "Bus Station" },
  coffeeshop: { icon: Coffee, color: "#967959", label: "Coffee Shop" },
  dentist: { icon: Stethoscope, color: "#85318F", label: "Dentist" },
  doctor: { icon: Stethoscope, color: "#4596A3", label: "Doctor" },
  family: { icon: Users, color: "#7580F2", label: "Family" },
  friend: { icon: Users, color: "#EAB308", label: "Friend" },
  friends: { icon: Users, color: "#4596A3", label: "Friends" },
  grocery: { icon: ShoppingCart, color: "#D96934", label: "Grocery" },
  gym: { icon: Dumbbell, color: "#D63D85", label: "Gym" },
  hike: { icon: Mountain, color: "#61A850", label: "Hike" },
  home: { icon: Home, color: "#4596A3", label: "Home" },
  hospital: { icon: Hospital, color: "#84B4C4", label: "Hospital" },
  hotel: { icon: Building2, color: "#84B4C4", label: "Hotel" },
  museum: { icon: Landmark, color: "#7635B0", label: "Museum" },
  music: { icon: Music, color: "#D63D85", label: "Music" },
  other: { icon: MapPin, color: "#767676", label: "Other" },
  park: { icon: Trees, color: "#61A850", label: "Park" },
  poi: { icon: Star, color: "#F2B44E", label: "Point of Interest" },
  petcare: { icon: PawPrint, color: "#9BBF30", label: "Pet Care" },
  pharmacy: { icon: Pill, color: "#B83030", label: "Pharmacy" },
  restaurant: { icon: Utensils, color: "#D96934", label: "Restaurant" },
  salon: { icon: Scissors, color: "#D63D85", label: "Salon" },
  school: { icon: GraduationCap, color: "#4A6FA5", label: "School" },
  shop: { icon: ShoppingBag, color: "#2364AA", label: "Shop" },
  station: { icon: Train, color: "#2364AA", label: "Station" },
  train_station: { icon: Train, color: "#2364AA", label: "Train Station" },
  temple: { icon: Church, color: "#F2B44E", label: "Temple/Church" },
};

export default function DestinationCard({ destination, onSelect, onShare }) {
  const config = categoryConfig[destination.category] || categoryConfig.other;
  const Icon = config.icon;

  return (
    <button
      onClick={() => onSelect(destination)}
      className="group relative w-full aspect-square rounded-2xl shadow-lg overflow-hidden transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/50"
      style={{ backgroundColor: config.color }}
    >
      {/* Share */}
      <span
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation();
          onShare(destination);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.stopPropagation();
            onShare(destination);
          }
        }}
        className="absolute top-2 right-2 z-10 p-2 bg-white/25 backdrop-blur-sm rounded-full hover:bg-white/40 transition-colors"
        title="Share Trip Details"
      >
        <Share2 className="w-4 h-4 text-white" />
      </span>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 text-center">
        <Icon className="w-12 h-12 sm:w-14 sm:h-14 text-white drop-shadow-md" strokeWidth={1.75} />
        <span className="text-white text-sm sm:text-base font-bold uppercase tracking-wide leading-tight line-clamp-3 drop-shadow-sm">
          {destination.name}
        </span>
      </div>
    </button>
  );
}