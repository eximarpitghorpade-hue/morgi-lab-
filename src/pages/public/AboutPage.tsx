import React from 'react';
import { ShieldCheck, Heart, Sparkles, Award } from 'lucide-react';

interface AboutPageProps {
  navigate: (path: string) => void;
}

export function AboutPage({ navigate }: AboutPageProps) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
          Our Foundation
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight">
          About Morni Creative Lab
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Founded with a clear conviction: the next generation of problem solvers will not emerge from multiple-choice tests, but from building real prototypes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4 text-slate-700 text-xs sm:text-sm leading-relaxed">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Craft, Code, and Creativity in One Unified Studio
          </h2>
          <p>
            Morni Creative Lab was founded by <strong>Arpit Ghorpade</strong> to bridge the gap between traditional theoretical education and real-world technology design.
          </p>
          <p>
            Too often, students learn coding without visual context, or visual art without understanding computation. In the real world, the most impactful products—from accessible medical devices to breathtaking animations—are born at the intersection of design, engineering, and storytelling.
          </p>
          <p>
            Our physical maker labs and cloud-connected learning platform provide structured progressive journeys where every student earns verified skills through practical artifact creation.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80"
              alt="Arpit Ghorpade"
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-amber-500/20"
            />
            <div>
              <h3 className="font-bold text-base text-slate-900">Arpit Ghorpade</h3>
              <p className="text-xs text-amber-700 font-semibold">Founder & Vision Lead</p>
              <p className="text-[11px] text-slate-500">Morni Creative Lab</p>
            </div>
          </div>
          <blockquote className="text-xs text-slate-600 italic border-l-2 border-amber-500 pl-4 py-1 leading-relaxed">
            "We built Morni Creative Lab so no child is ever told that being creative and being technical are opposites. When a child solders a circuit or animates their first character, they discover their own agency to shape the future."
          </blockquote>
        </div>
      </div>

      {/* Core Values */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 text-center">Core Academic Tenets</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <ShieldCheck className="w-6 h-6 text-amber-600" />
            <h3 className="font-bold text-sm text-slate-900">Authentic Assessment</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              No multiple-choice illusions. Mastery is proven solely through functional prototypes, verifiable code, and human studio critiques.
            </p>
          </div>
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <Heart className="w-6 h-6 text-indigo-600" />
            <h3 className="font-bold text-sm text-slate-900">Pedagogical AI Guardianship</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              MORNI MITR AI provides guided hints and analogies. It never solves graded assignments for the student, preserving genuine intellectual struggle.
            </p>
          </div>
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <Award className="w-6 h-6 text-emerald-600" />
            <h3 className="font-bold text-sm text-slate-900">Verifiable Credentials</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every certificate issued is immutably verifiable via our public ledger route, providing indisputable proof of student work.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
