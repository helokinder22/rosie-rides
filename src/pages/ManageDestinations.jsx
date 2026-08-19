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
import PageMenuHeader from "@/components/PageMenuHeader";
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
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const isPremium = user?.subscription_status === 'premium';
  const isFreeUntilNov30 = new Date() < new Date('2026-11-30');
  const isLimitReached = !isPremium && !isFreeUntilNov30 && destinations.length >= 2;

  console.log('ManageDestinations - User data:', user);
  console.log('ManageDestinations - isPremium:', isPremium);
  console.log('ManageDestinations - subscription_status:', user?.subscription_status);
  console.log('ManageDestinations - isLimitReached:', isLimitReached);

  const handleRefreshSubscription = async () => {
    console.log('Manual refresh clicked');
    try {
      const { data } = await base44.functions.invoke('checkSubscription', {});
      console.log('Subscription check result:', data);
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['destinations'] });
      alert(`Subscription status: ${data.subscription_status}`);
    } catch (error) {
      console.error('Failed to check subscription:', error);
      alert('Failed to check subscription');
    }
  };

  React.useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
    
    // Check if returning from subscription checkout
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('session_id')) {
      console.log('Detected session_id, manually checking subscription status...');
      
      // Manually check subscription status via Stripe API
      const checkStatus = async () => {
        try {
          const { data } = await base44.functions.invoke('checkSubscription', {});
          console.log('Subscription check result:', data);
          queryClient.invalidateQueries({ queryKey: ['user'] });
          queryClient.invalidateQueries({ queryKey: ['destinations'] });
        } catch (error) {
          console.error('Failed to check subscription:', error);
        }
      };
      
      // Check immediately and retry multiple times
      checkStatus();
      setTimeout(checkStatus, 2000);
      setTimeout(checkStatus, 4000);
      setTimeout(checkStatus, 6000);
      
      // Clean up URL
      setTimeout(() => {
        window.history.replaceState({}, '', window.location.pathname);
      }, 2000);
    }
  }, [queryClient]);

  const createMutation = useMutation({
    mutationFn: async (data) => {
      console.log('=== SAVE ATTEMPT START ===');
      console.log('Creating destination with data:', JSON.stringify(data));
      console.log('User authenticated:', user?.email);
      console.log('User object:', JSON.stringify(user));
      
      try {
        console.log('Calling base44.entities.Destination.create...');
        const result = await base44.entities.Destination.create(data);
        console.log('Create API SUCCESS:', JSON.stringify(result));
        console.log('=== SAVE ATTEMPT SUCCESS ===');
        return result;
      } catch (error) {
        console.error('=== SAVE ATTEMPT FAILED ===');
        console.error('Create error details:', error);
        console.error('Error message:', error.message);
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        console.error('Full error object:', JSON.stringify(error, null, 2));
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
        <PageMenuHeader />

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
              <div className="space-y-4 mb-8">
                <Button
                  size="lg"
                  onClick={() => navigate(createPageUrl("Subscription"))}
                  className="w-full h-16 sm:h-20 md:h-24 text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white rounded-3xl shadow-2xl border-4 border-white/30 transform hover:scale-105 transition-all duration-300"
                >
                  <Lock className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 mr-2 sm:mr-3 md:mr-4" />
                  Unlock More Destinations
                </Button>
                <Button
                  size="lg"
                  onClick={handleRefreshSubscription}
                  variant="outline"
                  className="w-full h-14 text-lg font-bold border-2 border-teal-600 text-teal-700 hover:bg-teal-50 rounded-2xl"
                >
                  Already Subscribed? Refresh Status
                </Button>
              </div>
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