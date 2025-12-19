import React from "react";
import { Button } from "@/components/ui/button";
import { Home, ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Disclaimer() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8">
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate(createPageUrl("Home"))}
            className="h-16 px-6 text-xl mb-8 border-4 border-slate-200 bg-white hover:bg-slate-50 shadow-xl font-bold text-slate-900"
          >
            <Home className="w-6 h-6 mr-3" />
            Back to Home
          </Button>

          <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-slate-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
                <ShieldAlert className="w-8 h-8 text-slate-600" />
              </div>
              <h1 className="text-4xl font-black text-slate-900">
                Disclaimer
              </h1>
            </div>

            <div className="prose prose-slate prose-xl max-w-none">
              <p className="text-xl text-slate-700 leading-relaxed font-medium">
                This application is an independent entity and is not affiliated with Uber Technologies, Inc.
              </p>
              <p className="text-xl text-slate-700 leading-relaxed font-medium mt-4">
                The app serves merely as a user-friendly interface for accessing Uber services. We do not assume any liability for actions or decisions made by Uber or its drivers.
              </p>
              <p className="text-xl text-slate-700 leading-relaxed font-medium mt-4">
                Users are encouraged to review Uber's terms of service and policies for complete information regarding their services.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center py-8 text-white text-sm opacity-70">
          © 2026 Rosie's Rides. All rights reserved.
        </div>
      </div>
    </div>
  );
}