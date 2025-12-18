import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, GripVertical } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const categoryEmojis = {
  dentist: "🦷",
  doctor: "🏥",
  family: "👨‍👩‍👧‍👦",
  grocery: "🛒",
  gym: "💪",
  home: "🏠",
  hospital: "🏥",
  other: "📍",
  petcare: "🐾",
  pharmacy: "💊",
  restaurant: "🍽️",
  salon: "💇"
};

export default function DestinationList({ destinations, onEdit, onDelete, onReorder, isLoading }) {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-3xl text-white font-bold animate-pulse">Loading...</div>
      </div>
    );
  }

  if (destinations.length === 0) {
    return (
      <Card className="border-0 bg-white/95 backdrop-blur-sm shadow-xl">
        <CardContent className="py-20 text-center">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-3xl font-bold text-slate-700 mb-2">No destinations yet</p>
          <p className="text-xl text-slate-600">Add one above to get started!</p>
        </CardContent>
      </Card>
    );
  }

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(destinations);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    onReorder(items);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border-2 border-white/50">
        <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
          <span>📌</span>
          Your Destinations
          <span className="ml-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-xl font-bold">
            {destinations.length}
          </span>
        </h2>
      </div>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="destinations">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {destinations.map((destination, index) => (
                <Draggable key={destination.id} draggableId={destination.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="animate-slide-in"
                      style={{
                        ...provided.draggableProps.style,
                        animationDelay: `${index * 50}ms`
                      }}
                    >
                      <Card className={`border-0 bg-white/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 overflow-hidden group ${snapshot.isDragging ? 'shadow-2xl scale-105' : 'hover:scale-102'}`}>
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"></div>
                        
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4 mb-4">
                            <div
                              {...provided.dragHandleProps}
                              className="cursor-grab active:cursor-grabbing mt-2 hover:bg-slate-100 rounded-lg p-2 -ml-2 transition-colors"
                            >
                              <GripVertical className="w-6 h-6 text-slate-400" />
                            </div>
                            <div className="text-5xl group-hover:scale-110 transition-transform duration-300">
                              {categoryEmojis[destination.category] || categoryEmojis.other}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-3xl font-black text-slate-800 truncate">
                                  {destination.name}
                                </h3>
                              </div>
                              <p className="text-lg text-slate-600 break-words mb-1">
                                {destination.address}
                              </p>
                              <span className="inline-block px-3 py-1 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 text-sm font-semibold rounded-full capitalize">
                                {destination.category.replace(/_/g, ' ')}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex gap-3 pt-4 border-t-2 border-slate-100">
                            <Button
                              variant="outline"
                              size="lg"
                              onClick={() => onEdit(destination)}
                              className="flex-1 h-14 border-3 border-blue-200 hover:bg-blue-50 hover:border-blue-400 rounded-2xl shadow-md transition-all duration-200 text-lg font-bold"
                            >
                              <Pencil className="w-5 h-5 mr-2 text-blue-600" />
                              Edit
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="lg"
                                  className="flex-1 h-14 border-3 border-red-200 hover:bg-red-50 hover:border-red-400 rounded-2xl shadow-md transition-all duration-200 text-lg font-bold"
                                >
                                  <Trash2 className="w-5 h-5 mr-2 text-red-600" />
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="max-w-md rounded-3xl border-4 border-red-200">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-3xl font-black flex items-center gap-3">
                                    <span>⚠️</span> Delete Destination?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription className="text-xl text-slate-600">
                                    Are you sure you want to delete <strong>"{destination.name}"</strong>? This cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="h-16 text-xl rounded-2xl font-bold">
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => onDelete(destination.id)}
                                    className="h-16 text-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-2xl font-bold"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <style>{`
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-slide-in {
          animation: slide-in 0.4s ease-out backwards;
        }
        
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
}