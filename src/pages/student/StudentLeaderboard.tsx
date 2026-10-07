import React, { useEffect, useState } from 'react';
import { Trophy, Flame, History, Award, CheckCircle2 } from 'lucide-react';
import { apiFetch } from '../../lib/api.ts';

export function StudentLeaderboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/api/student/gamification')
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="py-20 text-center text-xs text-slate-500">Loading gamification ledger...</div>;
  }

  if (!data) return null;

  const { totalXp, streak, transactions, leaderboard } = data;

  return (
    <div className="space-y-8 pb-12 animate-in fade-in">
      {/* Top Banner */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          XP Ledger & Studio Leaderboard
        </h1>
        <p className="text-xs text-slate-500">
          All experience points and streak bonuses are verified and immutably recorded server-side.
        </p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">{totalXp}</div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Verified Total XP</div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">{streak.currentStreak} Days</div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Current Continuous Streak</div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">{streak.totalDaysActive} Days</div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Total Lifetime Active Days</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Real Student Leaderboard (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-600" />
              <span>Cohort Leaderboard</span>
            </h3>
            <span className="text-[11px] text-slate-400">Ranked by Total XP</span>
          </div>

          <div className="space-y-2">
            {leaderboard?.map((st: any, idx: number) => {
              const isTop3 = idx < 3;
              return (
                <div
                  key={st.id}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs transition ${
                    idx === 0
                      ? 'bg-amber-50/70 border-amber-300'
                      : idx === 1
                      ? 'bg-slate-50 border-slate-300'
                      : idx === 2
                      ? 'bg-orange-50/40 border-orange-200'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                      idx === 0 ? 'bg-amber-500 text-slate-950' : idx === 1 ? 'bg-slate-300 text-slate-800' : idx === 2 ? 'bg-amber-700 text-white' : 'text-slate-400'
                    }`}>
                      {idx + 1}
                    </span>

                    <img
                      src={st.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'}
                      alt={st.name}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-200"
                    />

                    <div>
                      <div className="font-bold text-slate-900">{st.name}</div>
                      <div className="text-[10px] text-slate-500">{st.schoolName}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-extrabold text-amber-700 text-sm">{st.totalXp} XP</div>
                    <div className="text-[10px] text-orange-600 font-semibold flex items-center gap-0.5 justify-end">
                      <Flame className="w-3 h-3" /> {st.currentStreak}d streak
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Verified XP Transaction Ledger (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-600" />
              <span>Verified XP Transaction History</span>
            </h3>
            <span className="text-[11px] text-slate-400">{transactions?.length || 0} events</span>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {transactions?.map((tx: any) => (
              <div
                key={tx.id}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-900">{tx.description}</div>
                  <div className="text-[10px] text-slate-400">
                    Source: <span className="font-mono uppercase">{tx.source.replace('_', ' ')}</span> • {new Date(tx.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <span className="font-bold text-emerald-700 text-xs px-2 py-0.5 rounded bg-emerald-100">
                  +{tx.amount} XP
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
