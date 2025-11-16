import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
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

export default function DestinationList({ destinations, onEdit, onDelete, isLoading }) {
  if (isLoading) {
    return <div className="text-2xl text-center text-slate-600">Loading...</div>;
  }

  if (destinations.length === 0) {
    return (
      <Card className="border-2">
        <CardContent className="py-16 text-center">
          <p className="text-2xl text-slate-600">No destinations yet. Add one above!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold text-slate-800 mb-6">Your Destinations</h2>
      {destinations.map((destination) => (
        <Card key={destination.id} className="border-2 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-2xl font-bold text-slate-800 mb-1 truncate">
                  {destination.name}
                </h3>
                <p className="text-lg text-slate-600 break-words">
                  {destination.address}
                </p>
                <p className="text-base text-slate-500 mt-1 capitalize">
                  {destination.category.replace(/_/g, ' ')}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => onEdit(destination)}
                  className="h-14 w-14 border-2"
                >
                  <Pencil className="w-6 h-6" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="lg"
                      className="h-14 w-14 border-2 hover:bg-red-50 hover:border-red-300"
                    >
                      <Trash2 className="w-6 h-6 text-red-600" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-2xl">Delete Destination?</AlertDialogTitle>
                      <AlertDialogDescription className="text-lg">
                        Are you sure you want to delete "{destination.name}"? This cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="h-14 text-lg">Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(destination.id)}
                        className="h-14 text-lg bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}