import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Check, Shield, Star, Home, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useQuery } from "@tanstack/react-query";

export default function Subscription() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me(),
  });

  const handleSubscribe = async () => {
    setIsProcessing(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      await base44.auth.updateMe({ subscription_status: 'premium' });
      alert("🎉 Welcome to Premium! You now have unlimited access.");
      navigate(createPageUrl("Home"));
    } catch (error) {
      console.error("Subscription failed", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 relative">
      <Button
        variant="outline"
        size="lg"
        onClick={() => navigate(createPageUrl("Home"))}
        className="absolute top-6 left-6 h-14 px-6 text-lg border-2 border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold z-10"
      >
        <Home className="w-5 h-5 mr-2" />
        Back to Home
      </Button>

      <div className="text-center pt-8 pb-12">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="relative">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691a6204f2266bf3df80a940/6b6693db3_icon.png"
              alt="Rosie's Rides"
              className="w-24 h-24 rounded-3xl shadow-2xl transform rotate-3 hover:rotate-6 transition-transform duration-300"
            />
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-8 h-8 animate-pulse" style={{ color: '#00c2d1' }} />
            </div>
          </div>
        </div>
        <h1 className="text-5xl sm:text-6xl font-black mb-2" style={{ color: '#0091a2' }}>
          Rosie's Rides
        </h1>
      </div>

      <div className="max-w-4xl w-full mx-auto grid md:grid-cols-2 gap-8 items-center">

        <div className="text-slate-700 space-y-6">
          <h1 className="text-5xl font-black leading-tight">
            Unlock <span className="text-yellow-400">Premium</span> Features
          </h1>
          <p className="text-xl text-slate-600">
            Get unlimited access to all senior-friendly features and ensure your loved ones travel safely.
          </p>
          
          <div className="space-y-4 mt-8">
            <div className="flex items-center gap-4">
              <div className="bg-green-500/20 p-3 rounded-xl">
                <Shield className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Enhanced Safety</h3>
                <p className="text-slate-400">Real-time emergency alerts & location sharing</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="bg-blue-500/20 p-3 rounded-xl" style={{ boxShadow: '0 8px 20px rgba(0, 145, 162, 0.4)' }}>
                <Star className="w-8 h-8" style={{ color: '#007580' }} />
              </div>
              <div>
                <h3 className="text-xl font-bold">Unlimited Destinations</h3>
                <p className="text-slate-400">Save as many favorite places as you need</p>
              </div>
            </div>
          </div>
        </div>

        <Card className="bg-white border-0 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-yellow-400 to-orange-500" />
            <CardHeader className="text-center pt-10">
                <CardTitle className="text-3xl font-black text-slate-800">Senior Premium</CardTitle>
                <CardDescription className="text-lg">Everything you need for peace of mind</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
                <div className="flex justify-center items-baseline">
                    <span className="text-6xl font-black text-slate-900">$9.99</span>
                    <span className="text-xl text-slate-500 ml-2">/month</span>
                </div>
                
                <ul className="space-y-3 text-left max-w-xs mx-auto">
                    {['Unlimited Destinations', 'Emergency Alerts', 'Ad-free Experience', 'Family Dashboard'].map((feature) => (
                        <li key={feature} className="flex items-center gap-3">
                            <div className="bg-green-100 rounded-full p-1">
                                <Check className="w-4 h-4 text-green-600" />
                            </div>
                            <span className="text-slate-700 font-medium">{feature}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
            <CardFooter className="pb-10">
                <Button 
                    onClick={handleSubscribe} 
                    disabled={isProcessing}
                    className="w-full h-16 text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white shadow-lg rounded-xl transition-all hover:scale-105"
                >
                    {isProcessing ? "Processing..." : "Subscribe Now"}
                </Button>
            </CardFooter>
        </Card>

      </div>
    </div>
  );
}