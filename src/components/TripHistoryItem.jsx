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
      <CardContent className="p-4 sm:p-6 flex items-start gap-3 sm:gap-4">
        <button
          onClick={onToggleComplete}
          className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors"
          title={trip.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {trip.completed ? (
            <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
          ) : (
            <Circle className="w-6 h-6 sm:w-7 sm:h-7 text-slate-300 hover:text-slate-400" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full">
              {trip.category || 'Ride'}
            </span>
            {trip.completed && (
              <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider rounded-full">
                Completed
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-500 text-xs sm:text-sm font-medium mb-2">
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {format(date, "MMM d, yyyy")}
            </div>
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {format(date, "h:mm a")}
            </div>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1 break-words">{trip.destination_name}</h3>
          <div className="flex items-start text-slate-600">
            <MapPin className="w-4 h-4 mr-1 mt-0.5 shrink-0 text-slate-400" />
            <p className="text-xs sm:text-sm break-words">{trip.destination_address}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
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