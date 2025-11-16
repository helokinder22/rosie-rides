import React, { useState } from "react";
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
  X
} from "lucide-react";

const categories = [
  { value: "doctor", label: "Doctor", icon: Stethoscope, emoji: "🏥" },
  { value: "grocery", label: "Grocery Store", icon: ShoppingCart, emoji: "🛒" },
  { value: "salon", label: "Hair Salon", icon: Scissors, emoji: "💇" },
  { value: "pharmacy", label: "Pharmacy", icon: Pill, emoji: "💊" },
  { value: "restaurant", label: "Restaurant", icon: Utensils, emoji: "🍽️" },
  { value: "family", label: "Family/Friends", icon: Users, emoji: "👨‍👩‍👧‍👦" },
  { value: "other", label: "Other", icon: MapPin, emoji: "📍" },
];

export default function DestinationForm({ destination, onSave, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    name: destination?.name || "",
    address: destination?.address || "",
    category: destination?.category || "other",
    notes: destination?.notes || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
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
        <form onSubmit={handleSubmit} className="space-y-8">
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
              className="h-16 text-xl px-6 border-3 border-slate-200 focus:border-purple-400 rounded-2xl shadow-sm"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="address" className="text-2xl font-bold text-slate-700 flex items-center gap-2">
              <span>📍</span> Address
            </Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="123 Main St, City, State 12345"
              required
              className="h-16 text-xl px-6 border-3 border-slate-200 focus:border-purple-400 rounded-2xl shadow-sm"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="category" className="text-2xl font-bold text-slate-700 flex items-center gap-2">
              <span>🏷️</span> Category
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger className="h-16 text-xl px-6 border-3 border-slate-200 focus:border-purple-400 rounded-2xl shadow-sm">
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
              className="min-h-32 text-xl px-6 py-4 border-3 border-slate-200 focus:border-purple-400 rounded-2xl shadow-sm"
            />
          </div>

          <div className="flex gap-4 pt-6">
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
              type="submit"
              disabled={isLoading}
              className="flex-1 h-20 text-2xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-2xl font-bold shadow-lg"
            >
              <Save className="w-7 h-7 mr-3" />
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}