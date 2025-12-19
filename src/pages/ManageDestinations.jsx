import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Home, Settings, Sparkles, Lock, Menu, User, LogOut, CreditCard, Crown, ShieldAlert, History, Smartphone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import DestinationForm from "../components/DestinationForm";
import DestinationList from "../components/DestinationList";

export default function ManageDestinations() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editingDestination, setEditingDestination] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const { data: destinations, isLoading } = useQuery({
    queryKey: ['destinations'],
    queryFn: async () => {
      const data = await base44.entities.Destination.list('sort_order');
      return data.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    },
    initialData: [],
  });

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        return await base44.auth.me();
      } catch (error) {
        console.error('Failed to fetch user:', error);
        return null;
      }
    },
  });

  const isPremium = user?.subscription_status === 'premium';
  const isLimitReached = !isPremium && destinations.length >= 2;

  // Force authentication check on iPad
  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        await base44.auth.me();
        console.log('User authenticated successfully');
      } catch (error) {
        console.log('Auth check failed, redirecting to login');
        base44.auth.redirectToLogin(window.location.href);
      }
    };
    checkAuth();
    
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  const createMutation = useMutation({
    mutationFn: async (data) => {
      console.log('Creating destination with data:', JSON.stringify(data));
      
      try {
        const result = await base44.entities.Destination.create(data);
        console.log('Create API returned:', JSON.stringify(result));
        
        // Wait for database write to complete
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Verify it was saved by fetching it back
        const verification = await base44.entities.Destination.list();
        console.log('Verification fetch returned:', verification.length, 'destinations');
        console.log('All destinations:', JSON.stringify(verification));
        
        return result;
      } catch (error) {
        // If authentication error, force re-login
        if (error.message?.includes('auth') || error.status === 401 || error.message?.includes('Unauthorized')) {
          console.log('Authentication error, forcing re-login');
          base44.auth.redirectToLogin(window.location.href);
        }
        throw error;
      }
    },
    onSuccess: async (result) => {
      console.log('Destination created successfully with ID:', result.id);
      
      // Clear all React Query cache
      queryClient.clear();
      console.log('All cache cleared');
      
      // Force full page reload to home (iPad-friendly)
      window.location.href = window.location.origin + createPageUrl("Home");
    },
    onError: (error) => {
      console.error('Error creating destination:', error);
      console.error('Error details:', JSON.stringify(error));

      // Check if iOS Safari
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

      if (isIOS && !isStandalone) {
        alert('Failed to save. For best results on iPad/iPhone, please add this app to your home screen first. Go to About → Add to Homescreen for instructions.');
      } else {
        alert('Failed to save destination: ' + error.message);
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      console.log('Updating destination:', id, data);
      const result = await base44.entities.Destination.update(id, data);
      console.log('Update result:', result);
      return result;
    },
    onSuccess: async () => {
      console.log('Destination updated successfully');
      queryClient.removeQueries({ queryKey: ['destinations'] });
      await queryClient.refetchQueries({ queryKey: ['destinations'] });
      navigate(createPageUrl("Home"));
    },
    onError: (error) => {
      console.error('Error updating destination:', error);
      alert('Failed to update destination: ' + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Destination.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['destinations'] });
    },
  });

  const handleSave = async (data) => {
    console.log('handleSave called with data:', data);
    
    try {
      if (editingDestination) {
        console.log('Updating existing destination:', editingDestination.id);
        await updateMutation.mutateAsync({ id: editingDestination.id, data });
      } else {
        const newData = {
          ...data,
          sort_order: destinations.length
        };
        console.log('Creating new destination:', newData);
        await createMutation.mutateAsync(newData);
      }
      console.log('Save operation completed successfully');
    } catch (error) {
      console.error('handleSave error:', error);
      throw error;
    }
  };

  const handleReorder = async (reorderedDestinations) => {
    const updates = reorderedDestinations.map((dest, index) => 
      base44.entities.Destination.update(dest.id, { sort_order: index })
    );
    await Promise.all(updates);
    queryClient.invalidateQueries({ queryKey: ['destinations'] });
  };

  const handleEdit = (destination) => {
    setEditingDestination(destination);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingDestination(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-600 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Profile Menu */}
        <div className="absolute top-8 sm:top-12 right-4 z-10">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="secondary"
                className="h-16 w-16 rounded-2xl bg-white border-4 border-white/50 shadow-xl p-0 hover:bg-slate-50 transition-transform hover:scale-105"
                style={{ color: '#0091a2' }}
              >
                <Menu className="w-8 h-8" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white/95 backdrop-blur-xl border-0 rounded-3xl shadow-2xl max-w-sm">
              <DialogHeader className="rounded-t-3xl p-6 -m-6 mb-0" style={{ backgroundColor: '#0091a2' }}>
                <DialogTitle className="text-2xl font-bold text-center text-white">Menu</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center space-y-6 py-4">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10" style={{ color: '#0091a2' }} />
                </div>
                
                <div className="text-center space-y-1">
                  <h3 className="text-xl font-bold text-slate-900">{user?.full_name || 'Guest User'}</h3>
                  <p className="text-slate-500">{user?.email}</p>
                </div>

                <div className="w-full bg-slate-50 rounded-xl p-4 flex items-center justify-between border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isPremium ? 'bg-yellow-100 text-yellow-600' : 'bg-slate-200 text-slate-600'}`}>
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-slate-500">Plan</p>
                      <p className="font-bold text-slate-800">{isPremium ? 'Premium Member' : 'Free Plan'}</p>
                    </div>
                  </div>
                  {isPremium && <Crown className="w-5 h-5 text-yellow-500" />}
                </div>

                <Link to={createPageUrl("Home")} className="w-full">
                  <Button 
                    variant="outline" 
                    className="w-full h-12 text-lg rounded-xl border-2 border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    <Home className="w-5 h-5 mr-2" style={{ color: '#0091a2' }} />
                    Home
                  </Button>
                </Link>

                <Link to={createPageUrl("EmergencyContacts")} className="w-full">
                  <Button 
                    variant="outline" 
                    className="w-full h-12 text-lg rounded-xl border-2 border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    <Settings className="w-5 h-5 mr-2" style={{ color: '#0091a2' }} />
                    Emergency Contacts
                  </Button>
                </Link>

                <Link to={createPageUrl("TripHistory")} className="w-full">
                  <Button 
                    variant="outline" 
                    className="w-full h-12 text-lg rounded-xl border-2 border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    <History className="w-5 h-5 mr-2" style={{ color: '#0091a2' }} />
                    Trip History
                  </Button>
                </Link>

                <Link to={createPageUrl("About")} className="w-full">
                  <Button 
                    variant="outline" 
                    className="w-full h-12 text-lg rounded-xl border-2 border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    <Sparkles className="w-5 h-5 mr-2" style={{ color: '#0091a2' }} />
                    About
                  </Button>
                </Link>

                <Link to={createPageUrl("AddToHomescreen")} className="w-full">
                  <Button 
                    variant="outline" 
                    className="w-full h-12 text-lg rounded-xl border-2 border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    <Smartphone className="w-5 h-5 mr-2" style={{ color: '#0091a2' }} />
                    Add to Homescreen
                  </Button>
                </Link>

                <Link to={createPageUrl("Disclaimer")} className="w-full">
                  <Button 
                    variant="outline" 
                    className="w-full h-12 text-lg rounded-xl border-2 border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    <ShieldAlert className="w-5 h-5 mr-2" style={{ color: '#0091a2' }} />
                    Disclaimer
                  </Button>
                </Link>

                <Button 
                  className="w-full h-12 text-lg rounded-xl mt-2 text-gray-700 font-bold"
                  style={{ backgroundColor: '#ffc20c' }}
                  onClick={() => base44.auth.logout()}
                >
                  <LogOut className="w-5 h-5 mr-2" style={{ color: '#0091a2' }} />
                  Sign Out
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate(createPageUrl("Home"))}
            className="h-16 px-6 text-xl mb-8 border-4 border-slate-200 bg-white hover:bg-slate-50 shadow-xl font-bold text-slate-900"
          >
            <Home className="w-6 h-6 mr-3" />
            Back to Home
          </Button>
          
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-4 border-white/50">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Settings className="w-9 h-9 text-white" />
              </div>
              <div>
                <h1 className="text-5xl font-black text-slate-800">
                  Manage Places
                </h1>
                <p className="text-xl text-slate-600 flex items-center gap-2 mt-1">
                  <Sparkles className="w-5 h-5" />
                  Add, edit, or remove your destinations
                </p>
              </div>
            </div>
          </div>
        </div>

        {showForm ? (
          <div className="animate-slide-up">
            <DestinationForm
              destination={editingDestination}
              onSave={handleSave}
              onCancel={handleCancel}
              isLoading={createMutation.isPending || updateMutation.isPending}
            />
          </div>
        ) : (
          <>
            {isLimitReached ? (
              <Button
                size="lg"
                onClick={() => navigate(createPageUrl("Subscription"))}
                className="w-full h-24 text-3xl font-bold mb-8 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white rounded-3xl shadow-2xl border-4 border-white/30 transform hover:scale-105 transition-all duration-300"
              >
                <Lock className="w-10 h-10 mr-4" />
                Unlock More Destinations
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={() => setShowForm(true)}
                className="w-full h-24 text-3xl font-bold mb-8 text-gray-700 rounded-3xl shadow-2xl border-4 border-white/30 transform hover:scale-105 transition-all duration-300"
                style={{ backgroundColor: '#fbab13' }}
              >
                <Sparkles className="w-8 h-8 mr-3 text-teal-600" />
                Add New Destination
              </Button>
            )}

            <div className="animate-fade-in">
              <DestinationList
                destinations={destinations}
                onEdit={handleEdit}
                onDelete={(id) => deleteMutation.mutate(id)}
                onReorder={handleReorder}
                isLoading={isLoading}
              />
            </div>
          </>
        )}

        <div className="text-center py-8 text-gray-500 text-sm">
          © 2026 Rosie Rides. All rights reserved.
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}