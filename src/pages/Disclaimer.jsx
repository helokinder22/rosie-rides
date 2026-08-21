import React from "react";
import { Button } from "@/components/ui/button";
import { Home, ShieldAlert, Menu, User, LogOut, CreditCard, Crown, Settings, Sparkles, History, Smartphone } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import PageMenuHeader from "@/components/PageMenuHeader";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

export default function Disclaimer() {
  const navigate = useNavigate();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me(),
  });

  return (
    <div className="min-h-screen bg-slate-100 relative overflow-y-auto">
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <PageMenuHeader />

        <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-slate-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
              <ShieldAlert className="w-8 h-8 text-slate-600" />
            </div>
            <h2 className="text-4xl font-black text-slate-900">
              Disclaimer
            </h2>
          </div>

            <div className="prose prose-slate prose-xl max-w-none">
              <p className="text-xl text-slate-700 leading-relaxed font-medium">
                This application is an independent entity and is not affiliated with any ride-sharing or transportation companies.
              </p>
              <p className="text-xl text-slate-700 leading-relaxed font-medium mt-4">
                The app serves merely as a user-friendly interface for accessing transportation services. We do not assume any liability for actions or decisions made by transportation providers or their drivers.
              </p>
              <p className="text-xl text-slate-700 leading-relaxed font-medium mt-4">
                Users are encouraged to review each service provider's terms of service and policies for complete information regarding their services.
              </p>
              <p className="text-xl text-slate-700 leading-relaxed font-medium mt-4">
                Rosie Rides is currently an experimental project and is offered "as is" without warranties of any kind. The creator reserves the right to modify, suspend, or discontinue the app at any time and without prior notice.
              </p>

              <div className="mt-8 pt-8 border-t border-slate-200">
                <p className="text-xl text-slate-600 text-center">
                  Questions? Contact us at{' '}
                  <a href="mailto:info@rosierides.com" className="font-bold hover:underline" style={{ color: '#0091a2' }}>
                    info@rosierides.com
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="text-center py-8 text-gray-500 text-sm">
            © 2026 Rosie Rides. All rights reserved.
          </div>
        </div>
      </div>
    );
  }