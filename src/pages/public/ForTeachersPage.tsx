import React from 'react';
import { Users, CheckSquare, Video, ShieldCheck, ArrowRight } from 'lucide-react';

interface ForTeachersPageProps {
  navigate: (path: string) => void;
}

export function ForTeachersPage({ navigate }: ForTeachersPageProps) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
          Educator System
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight">
          Supercharge Your Creative Classroom
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          The Morni Teacher Dashboard gives educators real-time visibility into student submissions, rubric-based grading, live class scheduling, and attendance recording.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <CheckSquare className="w-6 h-6 text-amber-600" />
          <h3 className="font-bold text-base text-slate-900">Rubric-Based Project Reviews</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Grade submissions with quantitative scores, provide detailed qualitative mentor notes, and request structured revisions with clear action items.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <Users className="w-6 h-6 text-indigo-600" />
          <h3 className="font-bold text-base text-slate-900">Assigned Student Roster & Tracking</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Monitor real-time progress percentages, streaks, and completed levels across your assigned school cohort without manual spreadsheets.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <Video className="w-6 h-6 text-emerald-600" />
          <h3 className="font-bold text-base text-slate-900">Live Studio Critiques & Attendance</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Schedule live workshops directly from your dashboard, sync meeting links, and mark attendance status (Present, Absent, Late, Excused) with one click.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <ShieldCheck className="w-6 h-6 text-purple-600" />
          <h3 className="font-bold text-base text-slate-900">Strict Data Privacy & Access Control</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Server-side authorization guarantees teachers only access students in their assigned schools and classes, protecting private student records.
          </p>
        </div>
      </div>

      <div className="p-8 bg-slate-900 text-white rounded-3xl text-center space-y-4">
        <h2 className="text-2xl font-bold">Are you a creative educator or maker lead?</h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Sign in to your Teacher Dashboard or connect with our academic team to join our network of certified creative educators.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition"
          >
            Teacher Sign In
          </button>
          <button
            onClick={() => navigate('/contact')}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl transition"
          >
            Inquire About Mentorship
          </button>
        </div>
      </div>
    </div>
  );
}
