import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Home, Settings, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
    queryFn: () => base44.entities.Destination.list('-created_date'),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Destination.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['destinations'] });
      setShowForm(false);
      setEditingDestination(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Destination.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['destinations'] });
      setShowForm(false);
      setEditingDestination(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Destination.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['destinations'] });
    },
  });

  const handleSave = (data) => {
    if (editingDestination) {
      updateMutation.mutate({ id: editingDestination.id, data });
    } else {
      createMutation.mutate(data);
    }
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
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate(createPageUrl("Home"))}
            className="h-16 px-6 text-xl mb-8 border-3 border-white bg-white/90 hover:bg-white backdrop-blur-sm shadow-xl font-bold"
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
            <Button
              size="lg"
              onClick={() => setShowForm(true)}
              className="w-full h-24 text-3xl font-bold mb-8 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 rounded-3xl shadow-2xl border-4 border-white/50 transform hover:scale-105 transition-all duration-300"
            >
              ✨ Add New Destination
            </Button>

            <div className="animate-fade-in">
              <DestinationList
                destinations={destinations}
                onEdit={handleEdit}
                onDelete={(id) => deleteMutation.mutate(id)}
                isLoading={isLoading}
              />
            </div>
          </>
        )}
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