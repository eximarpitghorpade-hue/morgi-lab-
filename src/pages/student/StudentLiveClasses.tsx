import React, { useEffect, useState } from 'react';
import { Video, Calendar, Clock, User, ExternalLink, CheckCircle2 } from 'lucide-react';
import { apiFetch } from '../../lib/api.ts';
import type { LiveClass } from '../../types/index.ts';

export function StudentLiveClasses() {
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ liveClasses: LiveClass[] }>('/api/student/live-classes')
      .then(res => {
        setLiveClasses(res.liveClasses || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="py-20 text-center text-xs text-slate-500">Loading studio schedule...</div>;
  }

  const upcoming = liveClasses.filter(c => c.status === 'upcoming' || c.status === 'live');
  const past = liveClasses.filter(c => c.status === 'completed');

  return (
    <div className="space-y-8 pb-12 animate-in fade-in">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Live Studio Classes & Critiques
        </h1>
        <p className="text-xs text-slate-500">
          Join interactive live labs, teardown sessions, and group critiques with senior mentors.
        </p>
      </div>

      {/* Upcoming Classes */}
      <div className="space-y-4">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Scheduled & Upcoming Classes ({upcoming.length})</span>
        </h3>

        {upcoming.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcoming.map(cls => (
              <div
                key={cls.id}
                className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700">
                      {cls.programTitle}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-900">
                      {cls.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-base text-slate-900 leading-snug">{cls.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{cls.description}</p>

                  <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <Calendar className="w-3.5 h-3.5 text-amber-600" /> {cls.date}
                    </span>
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-amber-600" /> {cls.startTime} - {cls.endTime} IST
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" /> Mentor: {cls.teacherName}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">{cls.enrolledStudentsCount} Students Registered</span>
                  <a
                    href={cls.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Join Class Room</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic p-6 bg-white rounded-2xl border border-slate-200">
            No upcoming live classes right now. New masterclasses are posted weekly!
          </p>
        )}
      </div>

      {/* Completed Classes */}
      {past.length > 0 && (
        <div className="space-y-3 pt-4">
          <h3 className="font-bold text-sm text-slate-900">Completed Sessions</h3>
          <div className="space-y-2">
            {past.map(cls => (
              <div
                key={cls.id}
                className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900">{cls.title}</div>
                  <div className="text-[11px] text-slate-500">{cls.date} • Lead by {cls.teacherName}</div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700 self-start sm:self-auto">
                  Completed & Archived
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
