import React, { useEffect, useState } from 'react';
import {
  Flame, Trophy, BookOpen, Clock, CheckCircle2, ArrowRight,
  Video, Sparkles, Award, AlertCircle, FileText
} from 'lucide-react';
import { apiFetch } from '../../lib/api.ts';
import { CertificateView } from '../../components/certificate/CertificateView.tsx';
import type { Certificate } from '../../types/index.ts';

interface StudentDashboardProps {
  onNavigateSection: (section: string) => void;
  openMorniMitr?: () => void;
}

export function StudentDashboard({ onNavigateSection, openMorniMitr }: StudentDashboardProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeCert, setActiveCert] = useState<Certificate | null>(null);

  useEffect(() => {
    apiFetch('/api/student/dashboard')
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load student dashboard:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-500 text-xs">
        <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin mx-auto mb-2" />
        Loading your creative dashboard...
      </div>
    );
  }

  if (!data) return null;

  const {
    student,
    program,
    currentSkill,
    currentLevel,
    currentLesson,
    totalXp,
    streak,
    pendingProjects,
    recentFeedback,
    upcomingClasses,
    certificates,
    activeEnrollment,
  } = data;

  return (
    <div className="space-y-8 animate-in fade-in pb-12">
      {/* Welcome & Top Stats Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold text-white">
            <span>🦚</span> Welcome back, {student.name.split(' ')[0]}!
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {program ? program.title : 'Creative Technology Journey'}
          </h1>
          <p className="text-xs text-amber-100 max-w-lg">
            {currentSkill ? `Current Skill: ${currentSkill.title} • ${currentLevel?.title || 'Level 1'}` : 'Begin your first skill in the learning tab.'}
          </p>
        </div>

        {/* Gamification metric pills */}
        <div className="flex items-center gap-3">
          <div className="bg-white/15 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 text-center min-w-[90px]">
            <div className="flex items-center justify-center gap-1 text-amber-300 font-bold text-lg">
              <Trophy className="w-4 h-4" />
              <span>{totalXp}</span>
            </div>
            <div className="text-[10px] uppercase font-semibold text-white/80">Total XP</div>
          </div>

          <div className="bg-white/15 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 text-center min-w-[90px]">
            <div className="flex items-center justify-center gap-1 text-orange-300 font-bold text-lg">
              <Flame className="w-4 h-4" />
              <span>{streak.currentStreak}</span>
            </div>
            <div className="text-[10px] uppercase font-semibold text-white/80">Day Streak</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Active Learning & Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Learning Progression Card */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-600" />
              <h2 className="font-bold text-base text-slate-900">Active Course Progress</h2>
            </div>
            <button
              onClick={() => onNavigateSection('learning')}
              className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
            >
              <span>View Full Syllabus</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {program ? (
            <div className="space-y-4">
              {/* Progress bar */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className="text-slate-600">Completion Milestone</span>
                  <span className="text-amber-700">{activeEnrollment?.progressPercent || 0}% Complete</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${activeEnrollment?.progressPercent || 0}%` }}
                  />
                </div>
              </div>

              {/* Up Next Lesson Box */}
              <div className="p-5 bg-amber-50/60 rounded-2xl border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                    Next Lesson to Complete
                  </span>
                  <h3 className="font-bold text-sm text-slate-900">
                    {currentLesson ? currentLesson.title : 'Foundations of Modern Typography in Product Design'}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-600" /> {currentLesson?.durationMinutes || 20} min
                    </span>
                    <span>•</span>
                    <span className="text-amber-700 font-semibold">+{currentLesson?.xpAward || 50} XP</span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigateSection('learning')}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 flex-shrink-0"
                >
                  <span>Resume Lesson</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-3">
              <p className="text-xs text-slate-600">You are not actively enrolled in any program yet.</p>
              <button
                onClick={() => onNavigateSection('learning')}
                className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl"
              >
                Enroll in a Program
              </button>
            </div>
          )}

          {/* Pending Projects Section */}
          <div className="pt-2">
            <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Pending Assignments ({pendingProjects?.length || 0})</span>
            </h3>

            {pendingProjects && pendingProjects.length > 0 ? (
              <div className="space-y-2">
                {pendingProjects.map((proj: any) => (
                  <div
                    key={proj.id}
                    className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{proj.title}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{proj.brief}</div>
                    </div>
                    <button
                      onClick={() => onNavigateSection('projects')}
                      className="px-3 py-1 bg-white border border-slate-300 hover:border-amber-400 font-semibold text-slate-700 rounded-lg text-xs"
                    >
                      Submit
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>All current assignments are submitted and up to date! Great discipline.</span>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Mentor Feedback & Live Classes */}
        <div className="space-y-6">
          {/* Recent Teacher Feedback Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Mentor Feedback</span>
              </h3>
              <button
                onClick={() => onNavigateSection('projects')}
                className="text-[11px] text-amber-700 hover:underline font-semibold"
              >
                All Submissions
              </button>
            </div>

            {recentFeedback && recentFeedback.length > 0 ? (
              <div className="space-y-3">
                {recentFeedback.map((sub: any) => (
                  <div key={sub.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 truncate">{sub.title}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {sub.score}/{sub.maxScore}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 italic">"{sub.feedback}"</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No reviewed submissions yet.</p>
            )}
          </div>

          {/* Upcoming Live Classes Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <Video className="w-4 h-4 text-indigo-600" />
                <span>Upcoming Studio Sessions</span>
              </h3>
              <button
                onClick={() => onNavigateSection('live-classes')}
                className="text-[11px] text-indigo-700 hover:underline font-semibold"
              >
                Schedule
              </button>
            </div>

            {upcomingClasses && upcomingClasses.length > 0 ? (
              <div className="space-y-3">
                {upcomingClasses.map((cls: any) => (
                  <div key={cls.id} className="p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-1 text-xs">
                    <div className="font-bold text-slate-900 leading-snug">{cls.title}</div>
                    <div className="text-[11px] text-indigo-700 font-medium">
                      {cls.date} • {cls.startTime} - {cls.endTime}
                    </div>
                    <div className="text-[10px] text-slate-500">Mentor: {cls.teacherName}</div>
                    <a
                      href={cls.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-1 text-[11px] font-bold text-indigo-600 hover:underline"
                    >
                      Join Meeting Link →
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No scheduled live classes today.</p>
            )}
          </div>

          {/* Quick Morni Mitr Banner */}
          {openMorniMitr && (
            <div className="p-5 bg-gradient-to-br from-amber-500 to-indigo-600 rounded-3xl text-white space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">🦚</span>
                <span className="font-bold text-sm">Need help right now?</span>
              </div>
              <p className="text-xs text-amber-100">
                Ask MORNI MITR for hints, analogies, or practice questions to unblock your project.
              </p>
              <button
                onClick={openMorniMitr}
                className="w-full py-2 bg-white text-slate-950 font-bold text-xs rounded-xl shadow-xs hover:bg-amber-50 transition"
              >
                Ask Morni Mitr AI
              </button>
            </div>
          )}
        </div>
      </div>

      {activeCert && (
        <CertificateView certificate={activeCert} onClose={() => setActiveCert(null)} />
      )}
    </div>
  );
}
