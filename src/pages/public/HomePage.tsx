import React, { useEffect, useState } from 'react';
import {
  ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Video, Award,
  Users, Building2, Terminal, Palette, Cpu, Play
} from 'lucide-react';
import { apiFetch } from '../../lib/api.ts';
import type { Program } from '../../types/index.ts';

interface HomePageProps {
  navigate: (path: string) => void;
  openMorniMitr?: () => void;
}

export function HomePage({ navigate, openMorniMitr }: HomePageProps) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [stats, setStats] = useState<any>({
    studentsEnrolled: 735,
    activeMentors: 43,
    partnerSchools: 3,
    creativePrograms: 4,
    projectsReviewed: 890,
    verifiedCertificates: 210,
  });

  useEffect(() => {
    apiFetch<{ programs: Program[] }>('/api/public/programs')
      .then(data => setPrograms(data.programs || []))
      .catch(() => {});

    apiFetch<{ stats: any }>('/api/public/stats')
      .then(data => {
        if (data.stats) setStats(data.stats);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20">
        {/* Subtle decorative background gradient */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-amber-200/40 via-indigo-100/40 to-transparent blur-3xl -z-10 rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold shadow-xs">
            <span>🦚</span>
            <span>Experiential Creative Technology & Design Academy</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-950 tracking-tight leading-[1.08]">
            Learn. Create.{' '}
            <span className="bg-gradient-to-r from-amber-600 to-indigo-600 bg-clip-text text-transparent">
              Build Real Skills.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            A production-grade educational platform bridging physical computing, digital product design, 2D animation, and creative coding with verified credentials.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/programs')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Start Learning</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/book-demo')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-300 shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <span>Book a Demo</span>
            </button>
          </div>

          {/* Trust badges */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              1-on-1 Mentor Reviews
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              Verifiable Blockchain-Style Certificates
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              MORNI MITR AI Companion
            </span>
          </div>
        </div>
      </section>

      {/* Real Statistics Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="text-center p-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.studentsEnrolled}+</div>
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">Active Students</div>
          </div>
          <div className="text-center p-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.partnerSchools}</div>
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">Partner Schools</div>
          </div>
          <div className="text-center p-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.projectsReviewed}+</div>
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">Reviewed Submissions</div>
          </div>
          <div className="text-center p-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.verifiedCertificates}+</div>
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">Issued Certificates</div>
          </div>
        </div>
      </section>

      {/* Programs Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-amber-700 uppercase tracking-widest">Studio Programs</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Curated for Hands-On Creativity
            </h2>
          </div>
          <button
            onClick={() => navigate('/programs')}
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
          >
            <span>Explore all programs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {programs.map(program => (
            <div
              key={program.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition group flex flex-col justify-between"
            >
              <div>
                <div className="h-44 overflow-hidden relative">
                  <img
                    src={program.thumbnailUrl}
                    alt={program.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-900/80 backdrop-blur-md text-white">
                    {program.category}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>{program.difficulty}</span>
                    <span>{program.durationWeeks} Weeks</span>
                  </div>
                  <h3 className="font-bold text-base text-slate-900 line-clamp-1 group-hover:text-amber-700 transition">
                    {program.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {program.description}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-amber-600">{program.totalXp} Total XP</span>
                <button
                  onClick={() => navigate(`/programs`)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold text-slate-800 transition"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works / Core LMS Journey */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-amber-400 font-bold text-xs uppercase tracking-widest">
              Pedagogical Engine
            </span>
            <h2 className="text-3xl font-bold tracking-tight">The 10-Stage Learning Architecture</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              From first exploration to verified portfolio mastery, every step is deliberate and authentic.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { step: '01', title: 'Program', desc: 'Select industry-grade creative discipline' },
              { step: '02', title: 'Skill', desc: 'Master foundational craft competencies' },
              { step: '03', title: 'Level', desc: 'Progress through Novice, Explorer, Specialist' },
              { step: '04', title: 'Lesson', desc: 'Video, technical reading, and micro-checks' },
              { step: '05', title: 'Activity', desc: 'Hands-on practice challenges with AI hints' },
              { step: '06', title: 'Project', desc: 'Build tangible artifacts & prototypes' },
              { step: '07', title: 'Submission', desc: 'Upload design tokens, schematics, renders' },
              { step: '08', title: 'Review', desc: 'Human teacher rubric score & feedback' },
              { step: '09', title: 'XP & Streak', desc: 'Earn verified XP and streak bonuses' },
              { step: '10', title: 'Certificate', desc: 'Earn verifiable digital credential' },
            ].map(item => (
              <div
                key={item.step}
                className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 flex flex-col justify-between"
              >
                <div className="text-amber-400 font-mono font-bold text-xs">{item.step}</div>
                <div className="my-2">
                  <div className="font-bold text-sm text-white">{item.title}</div>
                  <div className="text-[11px] text-slate-400 leading-tight mt-1">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Morni Mitr AI Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-indigo-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold text-white">
              <span>🦚</span> Powered by Google GenAI (Server-Side)
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Meet MORNI MITR — Your Creative Thinking Mentor
            </h2>
            <p className="text-amber-100 text-sm sm:text-base leading-relaxed">
              Stuck on breadboard wiring? Confused about WCAG contrast or animation timing? Morni Mitr provides analogies, hints, and practice suggestions — without giving away graded answers.
            </p>
            <div className="pt-2 flex items-center gap-3">
              {openMorniMitr && (
                <button
                  onClick={openMorniMitr}
                  className="px-6 py-3 rounded-xl bg-white text-slate-950 font-bold text-sm hover:bg-amber-50 transition shadow"
                >
                  Chat with Morni Mitr
                </button>
              )}
              <button
                onClick={() => navigate('/resources')}
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition"
              >
                Explore Lab Resources
              </button>
            </div>
          </div>

          <div className="w-full md:w-80 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 text-xs space-y-3">
            <div className="font-bold text-amber-200 uppercase tracking-wider text-[11px]">
              Mentor Philosophy
            </div>
            <div className="p-3 bg-white/10 rounded-xl space-y-1">
              <span className="font-semibold text-white">Prompt:</span>
              <p className="text-amber-100 italic">"Can you explain why 8pt grid helps developers?"</p>
            </div>
            <div className="p-3 bg-white/15 rounded-xl space-y-1">
              <span className="font-semibold text-amber-300">Morni Mitr:</span>
              <p className="text-slate-100">
                "Think of it like LEGO bricks. When all components share a common factor (8px), margins and padding align naturally with Tailwind's 4-unit rhythm!"
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
