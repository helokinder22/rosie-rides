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
  DialogClose,
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

  React.useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  const createMutation = useMutation({
    mutationFn: async (data) => {
      console.log('Creating destination with data:', JSON.stringify(data));
      console.log('User authenticated:', user?.email);
      
      try {
        const result = await base44.entities.Destination.create(data);
        console.log('Create API returned:', JSON.stringify(result));
        return result;
      } catch (error) {
        console.error('Create error details:', error);
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        throw error;
      }
    },
    onSuccess: (result) => {
      console.log('Destination created successfully with ID:', result.id);
      queryClient.invalidateQueries({ queryKey: ['destinations'] });
      navigate(createPageUrl("Home"));
    },
    onError: (error) => {
      console.error('Error creating destination:', error);
      const errorMsg = error.response?.data?.detail || error.response?.data?.message || error.message || 'Unknown error';
      alert(`Failed to save destination: ${errorMsg}\n\nPlease check browser console for details and contact support.`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Destination.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['destinations'] });
      navigate(createPageUrl("Home"));
    },
    onError: (error) => {
      alert('Failed to update destination. Please try again.');
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
    
    // Check if user is authenticated
    if (!user || !user.email) {
      alert('You are not logged in. Please log in and try again.');
      base44.auth.redirectToLogin(window.location.href);
      return;
    }
    
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
    <div className="min-h-screen bg-slate-100 relative overflow-y-auto">
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header with logo and buttons */}
        <div className="flex justify-between items-center mb-12">
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate(createPageUrl("Home"))}
            className="h-16 w-16 border-4 border-white/50 bg-white hover:bg-slate-50 shadow-xl rounded-2xl p-0"
          >
            <Home className="w-6 h-6" style={{ color: '#0091a2' }} />
          </Button>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691a6204f2266bf3df80a940/6b6693db3_icon.png"
                alt="Rosie Rides"
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl shadow-lg"
              />
              <div className="absolute -top-2 -right-2">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" style={{ color: '#00c2d1' }} />
              </div>
            </div>
            <h1 className="text-xl sm:text-3xl font-black" style={{ color: '#0091a2' }}>
              Rosie Rides
            </h1>
          </div>
          
          <div>
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
            <DialogContent className="bg-white border-0 rounded-3xl shadow-2xl max-w-sm max-h-[90vh] overflow-auto p-0">
              <DialogHeader className="p-6 rounded-t-3xl relative" style={{ backgroundColor: '#0091a2' }}>
                <DialogTitle className="text-3xl font-bold text-center text-white">Menu</DialogTitle>
                <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-slate-100 data-[state=open]:text-slate-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  <span className="sr-only">Close</span>
                </DialogClose>
              </DialogHeader>
              <div className="flex flex-col items-center space-y-6 py-8 px-6" ref={(el) => el?.parentElement?.scrollTo(0, 0)}>
                <div className="relative">
                  <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                    <User className="w-12 h-12" style={{ color: '#0091a2' }} />
                  </div>
                  {isPremium && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                      <Crown className="w-8 h-8 text-yellow-500" />
                    </div>
                  )}
                </div>

                <div className="text-center space-y-1">
                  <h3 className="text-2xl font-black text-slate-900">{user?.full_name || 'Guest User'}</h3>
                  <p className="text-slate-600 text-lg">{user?.email}</p>
                </div>

                <Link to={createPageUrl("Home")} className="w-full">
                  <Button 
                    className="w-full h-16 text-xl rounded-2xl text-white font-bold shadow-lg"
                    style={{ backgroundColor: '#0091a2' }}
                  >
                    <Home className="w-6 h-6 mr-2" />
                    Home
                  </Button>
                </Link>

                <Link to={createPageUrl("ManageSubscription")} className="w-full">
                  <Button 
                    variant="outline" 
                    className="w-full h-14 text-lg rounded-2xl border-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
                  >
                    <CreditCard className="w-5 h-5 mr-2" style={{ color: '#0091a2' }} />
                    Manage Subscription
                  </Button>
                </Link>

                <Link to={createPageUrl("EmergencyContacts")} className="w-full">
                  <Button 
                    variant="outline" 
                    className="w-full h-14 text-lg rounded-2xl border-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
                  >
                    <Settings className="w-5 h-5 mr-2" style={{ color: '#0091a2' }} />
                    Emergency Contacts
                  </Button>
                </Link>

                <Link to={createPageUrl("TripHistory")} className="w-full">
                  <Button 
                    variant="outline" 
                    className="w-full h-14 text-lg rounded-2xl border-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
                  >
                    <History className="w-5 h-5 mr-2" style={{ color: '#0091a2' }} />
                    Trip History
                  </Button>
                </Link>

                <Link to={createPageUrl("About")} className="w-full">
                  <Button 
                    variant="outline" 
                    className="w-full h-14 text-lg rounded-2xl border-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
                  >
                    <Sparkles className="w-5 h-5 mr-2" style={{ color: '#0091a2' }} />
                    About
                  </Button>
                </Link>

                <Link to={createPageUrl("AddToHomescreen")} className="w-full">
                  <Button 
                    variant="outline" 
                    className="w-full h-14 text-lg rounded-2xl border-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
                  >
                    <Smartphone className="w-5 h-5 mr-2" style={{ color: '#0091a2' }} />
                    Add to Homescreen
                  </Button>
                </Link>

                <Link to={createPageUrl("Disclaimer")} className="w-full">
                  <Button 
                    variant="outline" 
                    className="w-full h-14 text-lg rounded-2xl border-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
                  >
                    <ShieldAlert className="w-5 h-5 mr-2" style={{ color: '#0091a2' }} />
                    Disclaimer
                  </Button>
                </Link>

                <Button 
                  className="w-full h-14 text-lg rounded-2xl text-gray-700 font-bold"
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
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-4 border-white/50 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Settings className="w-9 h-9 text-white" />
            </div>
            <div>
              <h2 className="text-4xl font-black text-slate-800">
                Manage Places
              </h2>
              <p className="text-xl text-slate-600 flex items-center gap-2 mt-1">
                <Sparkles className="w-5 h-5" />
                Add, edit, or remove your destinations
              </p>
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
                className="w-full h-16 sm:h-20 md:h-24 text-xl sm:text-2xl md:text-3xl font-bold mb-8 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white rounded-3xl shadow-2xl border-4 border-white/30 transform hover:scale-105 transition-all duration-300"
              >
                <Lock className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 mr-2 sm:mr-3 md:mr-4" />
                Unlock More Destinations
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={() => setShowForm(true)}
                className="w-full h-16 sm:h-20 md:h-24 text-xl sm:text-2xl md:text-3xl font-bold mb-8 text-gray-700 rounded-3xl shadow-2xl border-4 border-white/30 transform hover:scale-105 transition-all duration-300"
                style={{ backgroundColor: '#fbab13' }}
              >
                <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 mr-2 sm:mr-2.5 md:mr-3 text-teal-600" />
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