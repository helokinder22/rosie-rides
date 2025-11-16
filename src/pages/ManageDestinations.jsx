import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8">
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate(createPageUrl("Home"))}
            className="h-16 px-6 text-xl mb-6 border-2"
          >
            <ArrowLeft className="w-6 h-6 mr-3" />
            Back to Home
          </Button>
          
          <h1 className="text-5xl font-bold text-slate-800 mb-3">
            Manage Destinations
          </h1>
          <p className="text-2xl text-slate-600">
            Add, edit, or remove your saved places
          </p>
        </div>

        {showForm ? (
          <DestinationForm
            destination={editingDestination}
            onSave={handleSave}
            onCancel={handleCancel}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        ) : (
          <>
            <Button
              size="lg"
              onClick={() => setShowForm(true)}
              className="w-full h-20 text-2xl mb-8 bg-green-600 hover:bg-green-700 rounded-2xl shadow-lg"
            >
              Add New Destination
            </Button>

            <DestinationList
              destinations={destinations}
              onEdit={handleEdit}
              onDelete={(id) => deleteMutation.mutate(id)}
              isLoading={isLoading}
            />
          </>
        )}
      </div>
    </div>
  );
}