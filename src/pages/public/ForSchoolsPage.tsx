import React from 'react';
import { Building2, Award, Users, BookOpen, ShieldCheck, ArrowRight } from 'lucide-react';

interface ForSchoolsPageProps {
  navigate: (path: string) => void;
}

export function ForSchoolsPage({ navigate }: ForSchoolsPageProps) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
          Institutional Lab Partnership
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight">
          Transform Your School into an Innovation Hub
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Plug-and-play creative technology curriculum aligned with NEP 2020, CBSE ATL mandates, ICSE, and IB design criteria.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <Building2 className="w-6 h-6 text-amber-600" />
          <h3 className="font-bold text-base text-slate-900">Custom Institutional Portal</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            School-branded login, cohort-based roster management, and automated student onboarding with customized roll-out schedules.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <Award className="w-6 h-6 text-indigo-600" />
          <h3 className="font-bold text-base text-slate-900">Co-Branded Verified Certificates</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Award students official graduation certificates carrying both your school’s crest and Morni Creative Lab’s tamper-proof ledger validation code.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <Users className="w-6 h-6 text-emerald-600" />
          <h3 className="font-bold text-base text-slate-900">Teacher Professional Development</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Upskill your in-house computer science and arts faculty with masterclass training, lesson plans, and real-time mentor co-pilot support.
          </p>
        </div>
      </div>

      {/* Partner Schools Showcase */}
      <div className="p-8 bg-slate-100 rounded-3xl border border-slate-200 space-y-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center">
          Active Institutional Partners
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="font-bold text-slate-900 text-sm">Delhi Public Academy</div>
            <div className="text-[11px] text-slate-500">240 Enrolled Students • New Delhi</div>
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="font-bold text-slate-900 text-sm">St. Xavier's International</div>
            <div className="text-[11px] text-slate-500">185 Enrolled Students • Mumbai</div>
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="font-bold text-slate-900 text-sm">Cambridge Global School</div>
            <div className="text-[11px] text-slate-500">310 Enrolled Students • Bengaluru</div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="p-8 bg-gradient-to-r from-amber-500 to-indigo-600 rounded-3xl text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
        <div>
          <h3 className="text-xl font-bold">Request a School Innovation Lab Demo</h3>
          <p className="text-xs text-amber-100 mt-1">Our academic director will curate a demo tailored to your curriculum.</p>
        </div>
        <button
          onClick={() => navigate('/book-demo')}
          className="px-6 py-3 bg-white text-slate-950 font-bold text-xs rounded-xl shadow transition hover:bg-amber-50 flex-shrink-0"
        >
          Book Institutional Demo
        </button>
      </div>
    </div>
  );
}
