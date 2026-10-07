import React from 'react';
import { Sparkles, Trophy, BookOpen, Flame, Award, ArrowRight } from 'lucide-react';

interface ForStudentsPageProps {
  navigate: (path: string) => void;
}

export function ForStudentsPage({ navigate }: ForStudentsPageProps) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
          Student Experience
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight">
          Built for Young Innovators & Makers
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Forget boring multiple-choice worksheets. Build tangible prototypes, learn real tools like Figma and Arduino, and build an exceptional portfolio.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
            <Trophy className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Gamified Skill Mastery</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Earn verified XP for every lesson, maintain daily learning streaks, unlock achievement badges, and climb the school leaderboard.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-700 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">MORNI MITR AI Mentor</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Get instant analogies, hints, and practice suggestions whenever you're stuck on a circuit, typography rule, or coding challenge.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Verifiable Credentials</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Graduate with verifiable digital certificates featuring tamper-proof ledger codes recognized by creative schools and competitions.
          </p>
        </div>
      </div>

      <div className="p-8 bg-amber-50 border border-amber-200 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="font-bold text-lg text-slate-900">Ready to start building?</h3>
          <p className="text-xs text-slate-600">Select a program and begin with Level 1 today.</p>
        </div>
        <button
          onClick={() => navigate('/programs')}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition flex items-center gap-2 flex-shrink-0"
        >
          <span>Explore Programs</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
