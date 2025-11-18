import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Send } from "lucide-react";
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
import { base44 } from "@/api/base44Client";

export default function EmergencyButton({ destination, className }) {
  const [isSending, setIsSending] = useState(false);

  const sendEmergencyAlert = async () => {
    setIsSending(true);
    
    try {
      // Get emergency contacts
      const contacts = await base44.entities.EmergencyContact.list();
      
      if (contacts.length === 0) {
        alert("No emergency contacts found. Please add contacts in settings.");
        setIsSending(false);
        return;
      }

      // Get current user
      const user = await base44.auth.me();
      
      // Get current location (simplified - using browser geolocation)
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      
      const currentLocation = `${position.coords.latitude}, ${position.coords.longitude}`;
      const mapsLink = `https://www.google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`;
      
      // Send email to each contact
      const emailPromises = contacts.map(contact => 
        base44.integrations.Core.SendEmail({
          to: contact.email,
          subject: `🚨 EMERGENCY ALERT from ${user.full_name}`,
          body: `
EMERGENCY ALERT

${user.full_name} has triggered an emergency alert.

Current Location: ${mapsLink}
Coordinates: ${currentLocation}

${destination ? `Destination: ${destination.name}
Address: ${destination.address}` : 'No destination set'}

Time: ${new Date().toLocaleString()}

This is an automated emergency alert. Please check on ${user.full_name}.
          `
        })
      );
      
      await Promise.all(emailPromises);
      
      alert(`Emergency alert sent to ${contacts.length} contact(s)!`);
    } catch (error) {
      console.error('Error sending emergency alert:', error);
      alert('Failed to send emergency alert. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="lg"
          className={`bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 shadow-2xl border-4 border-white/50 font-bold ${className}`}
        >
          <AlertTriangle className="w-8 h-8 mr-3" />
          EMERGENCY
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md rounded-3xl border-4 border-red-300">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-3xl font-black flex items-center gap-3 text-red-600">
            <AlertTriangle className="w-8 h-8" />
            Send Emergency Alert?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xl text-slate-700">
            This will immediately send your current location and destination to all your emergency contacts via email.
            {destination && (
              <div className="mt-4 p-4 bg-red-50 rounded-xl border-2 border-red-200">
                <p className="font-bold text-slate-800">Destination:</p>
                <p className="text-slate-600">{destination.name}</p>
                <p className="text-sm text-slate-500">{destination.address}</p>
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="h-16 text-xl rounded-2xl font-bold">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={sendEmergencyAlert}
            disabled={isSending}
            className="h-16 text-xl bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 rounded-2xl font-bold"
          >
            <Send className="w-6 h-6 mr-2" />
            {isSending ? "Sending..." : "Send Alert"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}