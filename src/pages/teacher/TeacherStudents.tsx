import React, { useEffect, useState } from 'react';
import { Users, BookOpen, Trophy, Flame, Award, Search } from 'lucide-react';
import { apiFetch } from '../../lib/api.ts';

export function TeacherStudents() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    apiFetch<{ students: any[] }>('/api/teacher/students')
      .then(res => {
        setStudents(res.students || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="py-20 text-center text-xs text-slate-500">Loading student roster...</div>;
  }

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    (s.schoolName && s.schoolName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-8 pb-12 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Assigned Student Roster
          </h1>
          <p className="text-xs text-slate-500">
            Track student milestones, verified XP, program progress, and submission counts.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search students..."
            className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Student</th>
                <th className="px-6 py-3.5">School</th>
                <th className="px-6 py-3.5">Active Program</th>
                <th className="px-6 py-3.5">Progress</th>
                <th className="px-6 py-3.5">XP & Streak</th>
                <th className="px-6 py-3.5">Submissions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(st => (
                <tr key={st.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={st.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'}
                        alt={st.name}
                        className="w-9 h-9 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{st.name}</div>
                        <div className="text-[11px] text-slate-400">{st.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {st.schoolName || 'Open Cohort'}
                  </td>

                  <td className="px-6 py-4 font-medium text-slate-800">
                    {st.activeProgramTitle}
                  </td>

                  <td className="px-6 py-4">
                    <div className="w-24 space-y-1">
                      <div className="text-[10px] font-bold text-amber-700">{st.progressPercent}%</div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full"
                          style={{ width: `${st.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="font-bold text-amber-700">{st.totalXp} XP</div>
                    <div className="text-[10px] text-orange-600 flex items-center gap-0.5">
                      <Flame className="w-3 h-3" /> {st.streak}d streak
                    </div>
                  </td>

                  <td className="px-6 py-4 font-semibold text-slate-700">
                    {st.submissionsCount} submitted
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
