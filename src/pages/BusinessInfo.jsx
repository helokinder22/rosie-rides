import React from "react";
import { Button } from "@/components/ui/button";
import { Car, Shield, Users, MapPin, Crown, Mail } from "lucide-react";

export default function BusinessInfo() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691a6204f2266bf3df80a940/6b6693db3_icon.png"
              alt="Rosie Rides"
              className="w-20 h-20 rounded-2xl shadow-lg"
            />
            <div>
              <h1 className="text-5xl font-black">Rosie Rides</h1>
              <p className="text-xl text-teal-100">Simplifying Transportation for Seniors</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        
        {/* About Section */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-slate-800 mb-6">About Rosie Rides</h2>
          <div className="prose prose-lg max-w-none text-slate-700">
            <p className="text-xl leading-relaxed mb-4">
              Rosie Rides is a user-friendly mobile web application designed specifically to help seniors and elderly individuals easily access ride-sharing services like Uber. We simplify the process of requesting transportation by providing a clean, intuitive interface that removes the complexity of traditional ride-sharing apps.
            </p>
            <p className="text-xl leading-relaxed">
              Our mission is to enhance mobility and independence for seniors by making transportation more accessible, safe, and convenient.
            </p>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-slate-800 mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-50 rounded-2xl p-6 border-2 border-slate-200">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <MapPin className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-800">1. Save Destinations</h3>
              <p className="text-slate-600 text-lg">
                Users save their frequently visited locations like doctors, grocery stores, family, and friends.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border-2 border-slate-200">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mb-4">
                <Car className="w-8 h-8 text-cyan-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-800">2. One-Tap Rides</h3>
              <p className="text-slate-600 text-lg">
                With a single tap, users can open the Uber app with their destination pre-filled, making ride requests quick and simple.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border-2 border-slate-200">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-800">3. Stay Safe</h3>
              <p className="text-slate-600 text-lg">
                Emergency contacts are automatically notified when rides are requested, providing peace of mind for families.
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-slate-800 mb-8">Key Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-slate-800">Saved Destinations</h3>
                <p className="text-slate-600">Store unlimited favorite locations for quick access</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-slate-800">Emergency Alerts</h3>
                <p className="text-slate-600">One-tap emergency notifications to family members</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-slate-800">Family Notifications</h3>
                <p className="text-slate-600">Automatic ride alerts to emergency contacts</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Crown className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-slate-800">Premium Options</h3>
                <p className="text-slate-600">Enhanced features for unlimited destinations</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="mb-16 bg-slate-50 rounded-3xl p-8 border-2 border-slate-200">
          <h2 className="text-4xl font-bold text-slate-800 mb-6">Subscription Service</h2>
          <div className="text-lg text-slate-700 space-y-4">
            <p>
              <strong>Free Plan:</strong> Access to core features with up to 2 saved destinations
            </p>
            <p>
              <strong>Premium Plan ($9.99/month):</strong> Unlimited saved destinations, priority support, and enhanced safety features
            </p>
            <p className="text-slate-600 mt-6">
              All payments are securely processed through Stripe. Users can cancel their subscription at any time.
            </p>
          </div>
        </section>

        {/* Contact Information */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-slate-800 mb-6">Contact Information</h2>
          <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-2xl p-8">
            <div className="flex items-start gap-4 mb-6">
              <Mail className="w-8 h-8 mt-1" />
              <div>
                <h3 className="text-2xl font-bold mb-2">Get in Touch</h3>
                <p className="text-xl text-teal-100 mb-4">For business inquiries, support, or questions:</p>
                <a href="mailto:support@rosierides.com" className="text-2xl font-bold underline hover:text-yellow-300 transition-colors">
                  support@rosierides.com
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Legal */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-slate-800 mb-6">Legal Information</h2>
          <div className="prose prose-lg max-w-none text-slate-700">
            <p className="text-lg">
              Rosie Rides is an independent application and is not affiliated with Uber Technologies, Inc. We provide a simplified interface for accessing third-party ride-sharing services. All ride transactions are processed directly through Uber's platform.
            </p>
            <p className="text-lg mt-4">
              <strong>Business Type:</strong> SaaS (Software as a Service)<br />
              <strong>Service Area:</strong> United States<br />
              <strong>Payment Processor:</strong> Stripe, Inc.
            </p>
          </div>
        </section>

        {/* Privacy & Security */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-slate-800 mb-6">Privacy & Security</h2>
          <div className="prose prose-lg max-w-none text-slate-700">
            <p className="text-lg">
              We take user privacy seriously. All user data is encrypted and stored securely. We never share personal information with third parties except as necessary to provide our services (e.g., processing payments through Stripe). Emergency contact information is only used for safety notifications as configured by the user.
            </p>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-lg">&copy; 2025-2026 Rosie Rides. All rights reserved.</p>
          <p className="text-slate-400 mt-2">Empowering seniors with accessible transportation</p>
        </div>
      </footer>
    </div>
  );
}