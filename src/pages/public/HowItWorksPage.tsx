import React from 'react';
import {
  Compass, BookOpen, Layers, CheckCircle2, Award, ArrowRight,
  Sparkles, ShieldCheck, Flame, Video, FileText
} from 'lucide-react';

interface HowItWorksPageProps {
  navigate: (path: string) => void;
}

export function HowItWorksPage({ navigate }: HowItWorksPageProps) {
  const steps = [
    {
      num: '01',
      title: 'Program Selection',
      icon: Compass,
      desc: 'Students choose an experiential discipline (UI/UX Design, Creative Robotics, 2D Animation, or Game Dev).',
    },
    {
      num: '02',
      title: 'Skill Architecture',
      icon: Layers,
      desc: 'Each program is organized into modular skills, breaking vast disciplines into approachable competencies.',
    },
    {
      num: '03',
      title: 'Level Progression',
      icon: Award,
      desc: 'Skills contain graduated levels (Level 1 Novice, Level 2 Explorer, Level 3 Specialist) ensuring steady mastery.',
    },
    {
      num: '04',
      title: 'Interactive Lessons',
      icon: BookOpen,
      desc: 'High-density video walk-throughs, technical readings, and knowledge checks with sequential prerequisite unlocking.',
    },
    {
      num: '05',
      title: 'Lab Activities & Practice',
      icon: Flame,
      desc: 'Hands-on micro-activities with guidance from MORNI MITR AI, offering analogies and hints without answering for you.',
    },
    {
      num: '06',
      title: 'Assignments & Capstones',
      icon: FileText,
      desc: 'Students build tangible deliverables (design token specs, circuit schematics, animations, or interactive prototypes).',
    },
    {
      num: '07',
      title: 'Submission Engine',
      icon: CheckCircle2,
      desc: 'Submit drafts or final deliverables (PNG, JPG, PDF, DOCX) with file validation and student ownership verification.',
    },
    {
      num: '08',
      title: 'Human Teacher Review',
      icon: Sparkles,
      desc: 'Dedicated studio mentors review the work, assign rubric marks, leave constructive video/text feedback, or request revisions.',
    },
    {
      num: '09',
      title: 'XP, Streaks & Badges',
      icon: Award,
      desc: 'Server-side calculated progress and verified XP rewards reinforce daily learning habits and gamified milestones.',
    },
    {
      num: '10',
      title: 'Verified Certificate',
      icon: ShieldCheck,
      desc: 'Upon completing all program requirements, students earn a tamper-proof digital certificate with a public verification ledger code.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
          Academic Methodology
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight">
          How Morni Creative Lab Works
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          We reject passive video watching. Our proprietary 10-step pedagogical framework ensures genuine mastery through guided creation and human critique.
        </p>
      </div>

      <div className="space-y-6">
        {steps.map((st, i) => {
          const Icon = st.icon;
          return (
            <div
              key={st.num}
              className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-6 hover:border-amber-300 transition"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold text-lg font-mono flex-shrink-0">
                {st.num}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-amber-600" />
                  <h3 className="font-bold text-base text-slate-900">{st.title}</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-8 bg-slate-900 rounded-3xl text-white text-center space-y-4">
        <h2 className="text-2xl font-bold">Ready to Experience Real Creative Learning?</h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Join students across premier schools in India discovering robotics, design, and animation through studio projects.
        </p>
        <button
          onClick={() => navigate('/programs')}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-md transition"
        >
          Explore All Programs
        </button>
      </div>
    </div>
  );
}
