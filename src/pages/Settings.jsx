import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Home, Settings as SettingsIcon, Sparkles, Menu, User, LogOut, CreditCard, Crown, ShieldAlert, History, Smartphone, CheckCircle } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import PageMenuHeader from "@/components/PageMenuHeader";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

export default function Settings() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me(),
  });

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const updateFontSizeMutation = useMutation({
    mutationFn: async (fontSize) => {
      await base44.auth.updateMe({ font_size: fontSize });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      setIsSaving(false);
      // Reload page to apply new font size
      window.location.reload();
    },
  });

  const handleFontSizeChange = async (fontSize) => {
    setIsSaving(true);
    updateFontSizeMutation.mutate(fontSize);
  };

  const fontSizes = [
    { value: 'small', label: 'Small', description: 'Compact text for more content' },
    { value: 'medium', label: 'Medium', description: 'Default comfortable reading' },
    { value: 'large', label: 'Large', description: 'Easier to read' },
    { value: 'extra-large', label: 'Extra Large', description: 'Maximum readability' }
  ];

  const currentFontSize = user?.font_size || 'medium';
  const isPremium = user?.subscription_status === 'premium';

  return (
    <div className="min-h-screen bg-slate-100 relative overflow-y-auto">
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <PageMenuHeader />

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-4 border-white/50 mb-8">
          <h2 className="text-4xl sm:text-5xl font-black mb-6 text-center" style={{ color: '#0091a2' }}>
            Settings
          </h2>
        </div>

        <Card className="bg-white border-0 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-3xl font-black text-slate-800">Font Size</CardTitle>
            <CardDescription className="text-lg">
              Choose your preferred text size for the entire app
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {fontSizes.map((size) => (
              <button
                key={size.value}
                onClick={() => handleFontSizeChange(size.value)}
                disabled={isSaving}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  currentFontSize === size.value
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800 text-lg">{size.label}</div>
                    <div className="text-slate-600 text-sm">{size.description}</div>
                  </div>
                  {currentFontSize === size.value && (
                    <CheckCircle className="w-6 h-6 text-teal-600" />
                  )}
                </div>
              </button>
            ))}
            {isSaving && (
              <p className="text-center text-slate-600 text-sm">Saving and applying changes...</p>
            )}
          </CardContent>
        </Card>

        <div className="text-center py-8 text-gray-500 text-sm">
          © 2026 Rosie Rides. All rights reserved.
        </div>
      </div>
    </div>
  );
}