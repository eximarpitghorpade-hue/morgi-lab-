import React, { useEffect, useState } from 'react';
import {
  Users, CheckSquare, Video, Clock, ArrowRight, Award,
  Sparkles, CheckCircle2, AlertCircle
} from 'lucide-react';
import { apiFetch } from '../../lib/api.ts';

interface TeacherDashboardProps {
  onNavigateSection: (section: string) => void;
}

export function TeacherDashboard({ onNavigateSection }: TeacherDashboardProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/api/teacher/dashboard')
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="py-20 text-center text-xs text-slate-500">Loading educator studio metrics...</div>;
  }

  if (!data) return null;

  const { teacher, metrics, pendingReviews, upcomingClasses } = data;

  return (
    <div className="space-y-8 pb-12 animate-in fade-in">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold text-white">
            <span>🎓</span> Teacher Studio Command Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {teacher.name}!
          </h1>
          <p className="text-xs text-blue-100 max-w-lg">
            {teacher.schoolName ? `Lead Mentor for ${teacher.schoolName}` : 'Creative Arts & Technology Lead'}
          </p>
        </div>

        <button
          onClick={() => onNavigateSection('submissions')}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow transition flex items-center gap-2 self-start md:self-auto"
        >
          <CheckSquare className="w-4 h-4" />
          <span>Review Submissions ({metrics.pendingReviewsCount})</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Assigned Students</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{metrics.assignedStudentsCount}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Pending Reviews</div>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">{metrics.pendingReviewsCount}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Approved Submissions</div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">{metrics.totalReviewsCompleted}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Upcoming Classes</div>
          <div className="text-2xl font-extrabold text-indigo-600 mt-1">{metrics.upcomingClassesCount}</div>
        </div>
      </div>

      {/* Pending Reviews Queue */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">Submissions Awaiting Mentor Evaluation</h3>
            <p className="text-xs text-slate-500">Inspect deliverables, assign rubric marks, and give feedback.</p>
          </div>
          <button
            onClick={() => onNavigateSection('submissions')}
            className="text-xs font-bold text-indigo-700 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {pendingReviews && pendingReviews.length > 0 ? (
          <div className="space-y-3">
            {pendingReviews.map((sub: any) => (
              <div
                key={sub.id}
                className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{sub.title}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 uppercase">
                      {sub.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-slate-600 text-xs">
                    Student: <strong>{sub.studentName}</strong> • {sub.projectTitle}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Submitted: {new Date(sub.submittedAt).toLocaleDateString()}
                  </div>
                </div>

                <button
                  onClick={() => onNavigateSection('submissions')}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition self-start sm:self-auto"
                >
                  Review Work
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
            All assigned submissions have been reviewed!
          </div>
        )}
      </div>

      {/* Upcoming Studio Classes */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">Your Scheduled Live Classes</h3>
            <p className="text-xs text-slate-500">Launch meeting rooms and record student attendance.</p>
          </div>
          <button
            onClick={() => onNavigateSection('live-classes')}
            className="text-xs font-bold text-indigo-700 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>Manage Classes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {upcomingClasses && upcomingClasses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingClasses.map((cls: any) => (
              <div key={cls.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="font-bold text-slate-900 text-sm">{cls.title}</div>
                <div className="text-indigo-700 font-semibold">{cls.programTitle}</div>
                <div className="text-slate-500">{cls.date} • {cls.startTime} - {cls.endTime}</div>
                <a
                  href={cls.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 font-bold text-indigo-600 hover:underline"
                >
                  Launch Live Classroom Link →
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
            No active live sessions scheduled.
          </div>
        )}
      </div>
    </div>
  );
}
