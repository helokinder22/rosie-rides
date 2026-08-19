import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Stethoscope, 
  ShoppingCart, 
  Scissors, 
  Pill, 
  Utensils, 
  Users, 
  MapPin,
  Save,
  X,
  Sparkles,
  Coffee,
  Dumbbell,
  Home,
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
  Bus
} from "lucide-react";
import AddressConfirmationMap from "./AddressConfirmationMap";
import { base44 } from "@/api/base44Client";



const categories = [
  { value: "airport", label: "Airport", icon: Plane, emoji: "✈️" },
  { value: "bus_station", label: "Bus Station", icon: Bus, emoji: "🚌" },
  { value: "coffeeshop", label: "Coffee Shop", icon: Coffee, emoji: "☕" },
  { value: "dentist", label: "Dentist", icon: Stethoscope, emoji: "🦷" },
  { value: "doctor", label: "Doctor", icon: Stethoscope, emoji: "🏥" },
  { value: "family", label: "Family/Friends", icon: Users, emoji: "👨‍👩‍👧‍👦" },
  { value: "friends", label: "Friends", icon: Users, emoji: "👥" },
  { value: "grocery", label: "Grocery Store", icon: ShoppingCart, emoji: "🛒" },
  { value: "gym", label: "Gym", icon: Dumbbell, emoji: "💪" },
  { value: "hike", label: "Hike", icon: Mountain, emoji: "🥾" },
  { value: "home", label: "Home", icon: Home, emoji: "🏠" },
  { value: "hospital", label: "Hospital", icon: Hospital, emoji: "🏥" },
  { value: "hotel", label: "Hotel", icon: Building2, emoji: "🏨" },
  { value: "museum", label: "Museum", icon: Landmark, emoji: "🏛️" },
  { value: "music", label: "Music Venue", icon: Music, emoji: "🎵" },
  { value: "other", label: "Other", icon: MapPin, emoji: "📍" },
  { value: "park", label: "Park", icon: Trees, emoji: "🌳" },
  { value: "petcare", label: "Pet Care", icon: PawPrint, emoji: "🐾" },
  { value: "pharmacy", label: "Pharmacy", icon: Pill, emoji: "💊" },
  { value: "poi", label: "Point of Interest", icon: Star, emoji: "⭐" },
  { value: "restaurant", label: "Restaurant", icon: Utensils, emoji: "🍽️" },
  { value: "salon", label: "Hair Salon", icon: Scissors, emoji: "💇" },
  { value: "shop", label: "Shop", icon: ShoppingBag, emoji: "🛍️" },
  { value: "station", label: "Station", icon: Train, emoji: "🚉" },
  { value: "train_station", label: "Train Station", icon: Train, emoji: "🚆" },
  { value: "temple", label: "Temple/Church", icon: Church, emoji: "⛪" },
];

export default function DestinationForm({ destination, onSave, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    name: destination?.name || "",
    number: destination?.number || "",
    street: destination?.street || "",
    city: destination?.city || "",
    state: destination?.state || "",
    zip: destination?.zip || "",
    country: destination?.country || "",
    category: destination?.category || "other",
    notes: destination?.notes || "",
  });

  const [fullAddress, setFullAddress] = useState("");
  const [aiQuery, setAiQuery] = useState("");
  const [isAiSearching, setIsAiSearching] = useState(false);

  useEffect(() => {
    const parts = [
      formData.number,
      formData.street,
      formData.city,
      formData.state,
      formData.zip,
      formData.country
    ].filter(Boolean);
    
    // Build address if we have at least street and city (or any 2 key parts)
    if (parts.length >= 2 && (formData.street || formData.city)) {
      setFullAddress(parts.join(", "));
    } else {
      setFullAddress("");
    }
  }, [formData.number, formData.street, formData.city, formData.state, formData.zip, formData.country]);





  const handleAiSearch = async () => {
    if (!aiQuery.trim()) return;
    
    setIsAiSearching(true);
    try {
      console.log('AI Search starting for:', aiQuery);
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Search the internet and find the full address for: "${aiQuery}". 
        
Return the information in JSON format with these fields:
- name: the business or place name
- number: street number
- street: street name (without the number)
- city: city name
- state: state/province (use 2-letter abbreviation if US/Canada)
- zip: postal/zip code
- country: country name

Be thorough and search for the actual address. If multiple locations exist, pick the most prominent one.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            name: { type: "string" },
            number: { type: "string" },
            street: { type: "string" },
            city: { type: "string" },
            state: { type: "string" },
            zip: { type: "string" },
            country: { type: "string" }
          },
          required: ["name", "street", "city"]
        }
      });

      console.log('AI Search result:', result);

      if (result && result.name) {
        setFormData({
          ...formData,
          name: result.name || formData.name,
          number: result.number || "",
          street: result.street || "",
          city: result.city || "",
          state: result.state || "",
          zip: result.zip || "",
          country: result.country || ""
        });
        setAiQuery("");
      } else {
        alert("Could not find that location. Please try being more specific or enter the address manually.");
      }
    } catch (error) {
      console.error("AI search failed:", error);
      alert("Search failed. Please enter the address manually.");
    } finally {
      setIsAiSearching(false);
    }
  };

  const handleSaveClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Save button clicked');
    console.log('Form data:', formData);
    
    // Validate required fields
    if (!formData.name || !formData.number || !formData.street || !formData.city) {
      alert('Please fill in: Name, Street Number, Street, and City');
      return;
    }
    
    const saveData = {
      ...formData,
      address: fullAddress
    };
    
    console.log('Calling onSave with:', saveData);
    await onSave(saveData);
  };

  return (
    <>
      <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"></div>
      
      <CardHeader className="pb-6 pt-8">
        <CardTitle className="text-5xl font-black text-slate-800 flex items-center gap-4">
          <span className="text-4xl">
            {destination ? "✏️" : "✨"}
          </span>
          {destination ? "Edit Destination" : "New Destination"}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
          <div className="space-y-3">
            <Label className="text-2xl font-bold text-slate-700 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-500" /> Ask AI for Address
            </Label>
            <div className="flex gap-3">
              <Input
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAiSearch();
                  }
                }}
                placeholder="e.g., 'Nearest Starbucks in Seattle' or 'CVS on 5th Avenue'"
                className="flex-1 h-16 text-xl px-6 border-4 border-purple-300 focus:border-purple-500 rounded-2xl shadow-sm"
              />
              <Button
                type="button"
                onClick={handleAiSearch}
                disabled={isAiSearching || !aiQuery.trim()}
                className="h-16 px-8 text-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-2xl font-bold"
              >
                {isAiSearching ? "Searching..." : <Sparkles className="w-6 h-6" />}
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="name" className="text-2xl font-bold text-slate-700 flex items-center gap-2">
              <span>📝</span> Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Dr. Smith, Whole Foods"
              required
              className="h-16 text-xl px-6 border-4 border-slate-300 focus:border-purple-500 rounded-2xl shadow-sm"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-2xl font-bold text-slate-700 flex items-center gap-2">
              <span>📍</span> Address
            </Label>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <Input
                  id="number"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  placeholder="123"
                  required
                  className="h-16 text-xl px-6 border-4 border-slate-300 focus:border-purple-500 rounded-2xl shadow-sm"
                />
                <Label htmlFor="number" className="text-sm text-slate-500 mt-1 block">Number</Label>
              </div>
              <div className="col-span-2">
                <Input
                  id="street"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  placeholder="Main Street"
                  required
                  className="h-16 text-xl px-6 border-4 border-slate-300 focus:border-purple-500 rounded-2xl shadow-sm"
                />
                <Label htmlFor="street" className="text-sm text-slate-500 mt-1 block">Street</Label>
              </div>
            </div>

            <div className="grid grid-cols-6 gap-4">
              <div className="col-span-3">
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="City"
                  required
                  className="h-16 text-xl px-6 border-4 border-slate-300 focus:border-purple-500 rounded-2xl shadow-sm"
                />
                <Label htmlFor="city" className="text-sm text-slate-500 mt-1 block">City</Label>
              </div>
              <div className="col-span-2">
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="State/Region"
                  className="h-16 text-xl px-6 border-4 border-slate-300 focus:border-purple-500 rounded-2xl shadow-sm"
                />
                <Label htmlFor="state" className="text-sm text-slate-500 mt-1 block">State/Region</Label>
              </div>
              <div className="col-span-1">
                <Input
                  id="zip"
                  value={formData.zip}
                  onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                  placeholder="12345"
                  className="h-16 text-xl px-6 border-4 border-slate-300 focus:border-purple-500 rounded-2xl shadow-sm"
                />
                <Label htmlFor="zip" className="text-sm text-slate-500 mt-1 block">ZIP/Postal</Label>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="Mexico, United States, Canada..."
                  className="h-16 text-xl px-6 border-4 border-slate-300 focus:border-purple-500 rounded-2xl shadow-sm"
                />
                <Label htmlFor="country" className="text-sm text-slate-500 mt-1 block">Country</Label>
              </div>
            </div>

            {fullAddress && (
              <div className="mt-4">
                <Label className="text-lg font-bold text-slate-600 mb-2 block">
                  📍 Location Preview
                </Label>
                <AddressConfirmationMap address={fullAddress} />
              </div>
            )}
          </div>



          <div className="space-y-3">
            <Label htmlFor="category" className="text-2xl font-bold text-slate-700 flex items-center gap-2">
              <span>🏷️</span> Category
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger className="h-16 text-xl px-6 border-4 border-slate-300 focus:border-purple-500 rounded-2xl shadow-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <SelectItem key={cat.value} value={cat.value} className="text-xl py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{cat.emoji}</span>
                        <Icon className="w-6 h-6" />
                        <span>{cat.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label htmlFor="notes" className="text-2xl font-bold text-slate-700 flex items-center gap-2">
              <span>💭</span> Notes <span className="text-sm font-normal text-slate-500">(Optional)</span>
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any additional notes..."
              className="min-h-32 text-xl px-6 py-4 border-4 border-slate-300 focus:border-purple-500 rounded-2xl shadow-sm"
            />
          </div>

          <div className="pb-24">
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-slate-200 p-4 shadow-2xl z-50">
              <div className="max-w-5xl mx-auto flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isLoading}
                  className="flex-1 h-20 text-2xl border-3 border-slate-300 hover:bg-slate-100 rounded-2xl font-bold shadow-lg"
                >
                  <X className="w-7 h-7 mr-3" />
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSaveClick}
                  disabled={isLoading}
                  className="flex-1 h-20 text-2xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-2xl font-bold shadow-lg"
                >
                  <Save className="w-7 h-7 mr-3" />
                  {isLoading ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          </div>

        </form>
      </CardContent>
    </Card>
    </>
  );
}