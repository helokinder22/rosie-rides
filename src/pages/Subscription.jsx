import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Check, Crown, Shield, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Subscription() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const isAuth = await base44.auth.isAuthenticated();
      setIsAuthenticated(isAuth);
      if (isAuth) {
        const userData = await base44.auth.me();
        setUser(userData);
        // Redirect if already premium
        if (userData.subscription_status === 'premium') {
            navigate(createPageUrl("Home"));
        }
      }
    } catch (error) {
      console.error("Auth check failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async () => {
    if (!isAuthenticated) {
      base44.auth.redirectToLogin(createPageUrl("Subscription"));
      return;
    }

    // Mock Payment Process
    setIsProcessing(true);
    
    // Simulate network delay for payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      await base44.auth.updateMe({ subscription_status: 'premium' });
      alert("Payment successful! Welcome to Premium.");
      navigate(createPageUrl("Home"));
    } catch (error) {
      console.error("Payment failed", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-white bg-slate-900">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8 items-center">
        
        <div className="text-white space-y-6">
          <h1 className="text-5xl font-black leading-tight">
            Unlock <span className="text-yellow-400">Premium</span> Features
          </h1>
          <p className="text-xl text-slate-300">
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
              <div className="bg-purple-500/20 p-3 rounded-xl">
                <Crown className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Priority Support</h3>
                <p className="text-slate-400">24/7 dedicated assistance line</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-blue-500/20 p-3 rounded-xl">
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
                    onClick={handleAction} 
                    disabled={isProcessing}
                    className="w-full h-16 text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white shadow-lg rounded-xl transition-all hover:scale-105"
                >
                    {isProcessing ? "Processing..." : isAuthenticated ? "Subscribe Now" : "Sign Up & Subscribe"}
                </Button>
                {!isAuthenticated && (
                    <p className="text-center text-sm text-slate-400 mt-4 w-full">
                        Already have an account? <button onClick={() => base44.auth.redirectToLogin()} className="text-blue-500 underline font-semibold">Log in</button>
                    </p>
                )}
            </CardFooter>
        </Card>

      </div>
    </div>
  );
}