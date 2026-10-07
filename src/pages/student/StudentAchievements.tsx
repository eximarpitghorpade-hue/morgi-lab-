import React, { useEffect, useState } from 'react';
import { Award, Lock, CheckCircle2, Sparkles, Trophy } from 'lucide-react';
import { apiFetch } from '../../lib/api.ts';

export function StudentAchievements() {
  const [badges, setBadges] = useState<any[]>([]);
  const [totalXp, setTotalXp] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/api/student/gamification')
      .then(res => {
        setBadges(res.badges || []);
        setTotalXp(res.totalXp || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="py-20 text-center text-xs text-slate-500">Loading achievements...</div>;
  }

  const unlockedCount = badges.filter(b => b.unlocked).length;

  return (
    <div className="space-y-8 pb-12 animate-in fade-in">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Badges & Creative Milestones
        </h1>
        <p className="text-xs text-slate-500">
          Unlock honorary maker badges as your verified XP increases and projects are approved.
        </p>
      </div>

      {/* Progress header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase">Achievement Status</div>
          <div className="text-xl font-bold text-slate-900 mt-0.5">
            {unlockedCount} of {badges.length} Badges Unlocked
          </div>
        </div>

        <div className="w-full sm:w-64">
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-indigo-600 rounded-full"
              style={{ width: `${badges.length > 0 ? (unlockedCount / badges.length) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {badges.map(badge => (
          <div
            key={badge.id}
            className={`p-6 rounded-3xl border text-center space-y-4 transition flex flex-col justify-between ${
              badge.unlocked
                ? 'bg-white border-amber-300 shadow-sm'
                : 'bg-slate-50/70 border-slate-200 opacity-60'
            }`}
          >
            <div className="space-y-3">
              <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-2xl font-bold shadow-xs ${
                badge.unlocked
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-200 text-slate-400'
              }`}>
                {badge.unlocked ? '🏆' : <Lock className="w-6 h-6" />}
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                  {badge.category}
                </span>
                <h3 className="font-bold text-base text-slate-900 mt-0.5">{badge.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">{badge.description}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Req: {badge.xpRequired} XP</span>
              {badge.unlocked ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Unlocked
                </span>
              ) : (
                <span className="text-[10px] text-slate-400 font-semibold">
                  {Math.max(0, badge.xpRequired - totalXp)} XP needed
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
