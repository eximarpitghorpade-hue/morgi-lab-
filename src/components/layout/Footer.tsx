import React from 'react';
import { ShieldCheck, Mail, Phone, MapPin, Award, ExternalLink } from 'lucide-react';

interface FooterProps {
  navigate: (path: string) => void;
}

export function Footer({ navigate }: FooterProps) {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-bold text-lg">
                🦚
              </div>
              <span className="font-extrabold text-white text-base tracking-tight">
                MORNI <span className="text-amber-400 font-bold">CREATIVE LAB</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs max-w-sm">
              Empowering next-generation creators, coders, and makers with experiential education, verified credentials, and studio-grade project learning.
            </p>
            <div className="pt-2 flex flex-col gap-1 text-[11px] text-slate-500">
              <span className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-500/80" /> Innovation Wing, Tech Park, New Delhi & Mumbai
              </span>
              <span className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-500/80" /> admissions@mornicreativelab.com
              </span>
            </div>
          </div>

          {/* Programs */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Programs
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => navigate('/programs')} className="hover:text-amber-400 transition">
                  UI/UX Design
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/programs')} className="hover:text-amber-400 transition">
                  Creative Robotics
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/programs')} className="hover:text-amber-400 transition">
                  2D Animation
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/programs')} className="hover:text-amber-400 transition">
                  Game Creative Coding
                </button>
              </li>
            </ul>
          </div>

          {/* Solutions & Portals */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Solutions
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => navigate('/for-students')} className="hover:text-amber-400 transition">
                  For Students
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/for-teachers')} className="hover:text-amber-400 transition">
                  For Teachers & Mentors
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/for-schools')} className="hover:text-amber-400 transition">
                  For Partner Schools
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/resources')} className="hover:text-amber-400 transition">
                  Learning Resources
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/verify-certificate/MCL-2026-884192')} className="text-amber-400 font-semibold hover:underline flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Certificate Verification
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Trust & Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => navigate('/about')} className="hover:text-amber-400 transition">
                  About the Lab
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/contact')} className="hover:text-amber-400 transition">
                  Contact Support
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/privacy')} className="hover:text-amber-400 transition">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/terms')} className="hover:text-amber-400 transition">
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Sub-footer */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} MORNI CREATIVE LAB PRIVATE LIMITED. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Production Engine Active
            </span>
            <span>Razorpay Verified</span>
            <span>WCAG 2.1 AA Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
