import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar, Clock, ArrowUpRight, CheckCircle, Circle, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
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

export default function TripHistoryItem({ trip, onToggleComplete, onDelete }) {
  const date = new Date(trip.trip_date || trip.created_date);

  return (
    <Card className="mb-4 border-0 bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6 flex items-center justify-between">
        <button
          onClick={onToggleComplete}
          className="flex-shrink-0 mr-4 w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors"
          title={trip.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {trip.completed ? (
            <CheckCircle className="w-7 h-7 text-green-600" />
          ) : (
            <Circle className="w-7 h-7 text-slate-300 hover:text-slate-400" />
          )}
        </button>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full">
              {trip.category || 'Ride'}
            </span>
            {trip.completed && (
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider rounded-full">
                Completed
              </span>
            )}
            <div className="flex items-center text-slate-500 text-sm font-medium">
              <Calendar className="w-3 h-3 mr-1" />
              {format(date, "MMM d, yyyy")}
              <Clock className="w-3 h-3 ml-3 mr-1" />
              {format(date, "h:mm a")}
            </div>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-1">{trip.destination_name}</h3>
          <div className="flex items-center text-slate-600">
            <MapPin className="w-4 h-4 mr-1 shrink-0 text-slate-400" />
            <p className="text-sm truncate">{trip.destination_address}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Trip?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this trip to {trip.destination_name}? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete} className="bg-red-600 hover:bg-red-700">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}