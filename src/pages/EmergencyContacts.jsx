import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, UserPlus, Trash2, Users, AlertTriangle, Bell, Menu, User, LogOut, CreditCard, Crown, Settings, Sparkles, ShieldAlert, History, Smartphone } from "lucide-react";
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

export default function EmergencyContacts() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    relationship: "",
    notify_on_ride: true
  });

  const { data: contacts, isLoading } = useQuery({
    queryKey: ['emergencyContacts'],
    queryFn: () => base44.entities.EmergencyContact.list('-created_date'),
    initialData: [],
  });

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.EmergencyContact.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergencyContacts'] });
      setShowForm(false);
      setFormData({ name: "", email: "", phone: "", relationship: "", notify_on_ride: true });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.EmergencyContact.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergencyContacts'] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-slate-100 relative overflow-y-auto">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header with logo and buttons */}
        <div className="flex justify-between items-center mb-12">
          <div></div>

          <Link to={createPageUrl("Home")} className="flex items-center gap-2 sm:gap-3">
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
          </Link>
          
          <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="h-16 w-16 p-0 transition-transform hover:scale-105"
                style={{ color: '#0091a2' }}
              >
                <Menu className="w-8 h-8" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white border-0 rounded-3xl shadow-2xl max-w-sm max-h-[90vh] overflow-auto p-0">
              <DialogHeader className="p-6 rounded-t-3xl relative" style={{ backgroundColor: '#0091a2' }}>
                <DialogTitle className="text-3xl font-bold text-center text-white">Menu</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center space-y-6 py-8 px-6" ref={(el) => el?.parentElement?.scrollTo(0, 0)}>
                <div className="relative">
                  <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                    <User className="w-12 h-12" style={{ color: '#0091a2' }} />
                  </div>
                  {user?.subscription_status === 'premium' && (
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

                <Link to={createPageUrl("ManageDestinations")} className="w-full">
                  <Button 
                    variant="outline" 
                    className="w-full h-14 text-lg rounded-2xl border-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
                  >
                    <Settings className="w-5 h-5 mr-2" style={{ color: '#0091a2' }} />
                    Manage Destinations
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
            <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
              <AlertTriangle className="w-9 h-9 text-white" />
            </div>
            <div>
              <h2 className="text-4xl font-black text-slate-800">
                Emergency Contacts
              </h2>
              <p className="text-xl text-slate-600 flex items-center gap-2 mt-1">
                <Users className="w-5 h-5" />
                People to alert in case of emergency
              </p>
            </div>
          </div>
        </div>

        {showForm ? (
          <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm overflow-hidden mb-8">
            <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-red-500 via-orange-500 to-red-500"></div>
            <CardHeader className="pb-6 pt-8">
              <CardTitle className="text-4xl font-black text-slate-900">
                <span className="text-3xl mr-3">👤</span>
                Add Emergency Contact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-2xl font-bold text-slate-900">
                    Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    required
                    className="h-16 text-xl px-6 border-2 border-slate-400 focus:border-slate-600 rounded-2xl bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-2xl font-bold text-slate-900">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    required
                    className="h-16 text-xl px-6 border-2 border-slate-400 focus:border-slate-600 rounded-2xl bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-2xl font-bold text-slate-900">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                    className="h-16 text-xl px-6 border-2 border-slate-400 focus:border-slate-600 rounded-2xl bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="relationship" className="text-2xl font-bold text-slate-900">
                    Relationship
                  </Label>
                  <Input
                    id="relationship"
                    value={formData.relationship}
                    onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                    placeholder="e.g., Spouse, Child, Friend"
                    className="h-16 text-xl px-6 border-2 border-slate-400 focus:border-slate-600 rounded-2xl bg-white"
                  />
                </div>

                <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-2xl border-2 border-slate-200">
                  <input
                    type="checkbox"
                    id="notify_on_ride"
                    checked={formData.notify_on_ride}
                    onChange={(e) => setFormData({ ...formData, notify_on_ride: e.target.checked })}
                    className="w-6 h-6 rounded border-slate-300 text-red-600 focus:ring-red-500"
                  />
                  <Label htmlFor="notify_on_ride" className="text-xl font-bold text-slate-900 cursor-pointer flex items-center gap-2">
                    <Bell className="w-5 h-5 text-red-600" />
                    Notify this contact when I take a ride
                  </Label>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="flex-1 h-16 text-xl rounded-2xl font-bold border-2 border-slate-300 text-slate-800 hover:bg-slate-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="flex-1 h-16 text-xl bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white rounded-2xl font-bold"
                  >
                    {createMutation.isPending ? "Saving..." : "Save Contact"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Button
            size="lg"
            onClick={() => setShowForm(true)}
            className="w-full h-24 text-xl sm:text-2xl lg:text-3xl font-bold mb-8 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white rounded-3xl shadow-2xl border-4 border-white/30"
          >
            <UserPlus className="w-8 h-8 sm:w-10 sm:h-10 mr-2 sm:mr-4" />
            Add Emergency Contact
          </Button>
        )}

        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12 text-3xl text-white font-bold">Loading...</div>
          ) : contacts.length === 0 ? (
            <Card className="border-0 bg-white/95 backdrop-blur-sm shadow-xl">
              <CardContent className="py-20 text-center">
                <div className="text-6xl mb-4">👥</div>
                <p className="text-3xl font-bold text-slate-700 mb-2">No contacts yet</p>
                <p className="text-xl text-slate-600">Add emergency contacts to stay safe</p>
              </CardContent>
            </Card>
          ) : (
            contacts.map((contact) => (
              <Card key={contact.id} className="border-0 bg-white/95 backdrop-blur-sm hover:shadow-2xl transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-3xl font-black text-slate-800 mb-2">{contact.name}</h3>
                      <p className="text-lg text-slate-600">📧 {contact.email}</p>
                      {contact.phone && <p className="text-lg text-slate-600">📱 {contact.phone}</p>}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {contact.relationship && (
                          <span className="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                            {contact.relationship}
                          </span>
                        )}
                        {contact.notify_on_ride && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                            <Bell className="w-3 h-3" />
                            Ride Notifications
                          </span>
                        )}
                      </div>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="lg"
                          className="h-16 w-16 border-3 border-red-200 hover:bg-red-50 rounded-2xl"
                        >
                          <Trash2 className="w-7 h-7 text-red-600" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="max-w-md rounded-3xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-3xl font-black">Delete Contact?</AlertDialogTitle>
                          <AlertDialogDescription className="text-xl">
                            Remove {contact.name} from emergency contacts?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="h-16 text-xl rounded-2xl">Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteMutation.mutate(contact.id)}
                            className="h-16 text-xl bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="text-center py-8 text-gray-500 text-sm">
          © 2026 Rosie Rides. All rights reserved.
        </div>
      </div>
    </div>
  );
}