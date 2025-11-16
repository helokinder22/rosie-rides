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
  MapPin 
} from "lucide-react";

const categories = [
  { value: "doctor", label: "Doctor", icon: Stethoscope },
  { value: "grocery", label: "Grocery Store", icon: ShoppingCart },
  { value: "salon", label: "Hair Salon", icon: Scissors },
  { value: "pharmacy", label: "Pharmacy", icon: Pill },
  { value: "restaurant", label: "Restaurant", icon: Utensils },
  { value: "family", label: "Family/Friends", icon: Users },
  { value: "other", label: "Other", icon: MapPin },
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
    <Card className="border-2 shadow-xl">
      <CardHeader className="pb-6">
        <CardTitle className="text-4xl">
          {destination ? "Edit Destination" : "Add New Destination"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <Label htmlFor="name" className="text-2xl font-semibold">
              Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Dr. Smith, Whole Foods"
              required
              className="h-16 text-xl px-6 border-2"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="address" className="text-2xl font-semibold">
              Address
            </Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="123 Main St, City, State 12345"
              required
              className="h-16 text-xl px-6 border-2"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="category" className="text-2xl font-semibold">
              Category
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger className="h-16 text-xl px-6 border-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <SelectItem key={cat.value} value={cat.value} className="text-xl py-4">
                      <div className="flex items-center gap-3">
                        <Icon className="w-6 h-6" />
                        {cat.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label htmlFor="notes" className="text-2xl font-semibold">
              Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any additional notes..."
              className="min-h-32 text-xl px-6 py-4 border-2"
            />
          </div>

          <div className="flex gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 h-16 text-xl border-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 h-16 text-xl bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? "Saving..." : "Save Destination"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}