import React, { useEffect, useState } from 'react';
import { Brain, Sparkles, CheckCircle2, AlertCircle, Save, History } from 'lucide-react';
import { apiFetch } from '../../lib/api.ts';

export function AdminAiSettings() {
  const [config, setConfig] = useState<any>(null);
  const [usageLogs, setUsageLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  useEffect(() => {
    apiFetch('/api/admin/ai/config')
      .then(res => {
        setConfig(res.config);
        setUsageLogs(res.recentUsage || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedMsg(null);

    try {
      const res = await apiFetch('/api/admin/ai/config', {
        method: 'POST',
        body: JSON.stringify(config),
      });
      setConfig(res.config);
      setSavedMsg('Morni Mitr AI mentor settings updated successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to save AI settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-xs text-slate-500">Loading AI settings...</div>;
  }

  if (!config) return null;

  return (
    <div className="space-y-8 pb-12 animate-in fade-in">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          MORNI MITR AI Configuration & Safety Guardrails
        </h1>
        <p className="text-xs text-slate-500">
          Control server-side model parameters, system prompts, daily student limits, and audit conversation topics.
        </p>
      </div>

      {savedMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{savedMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Settings Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <form onSubmit={handleSave} className="space-y-5">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <div className="font-bold text-slate-900 text-xs sm:text-sm">Enable MORNI MITR Assistant</div>
                <div className="text-[11px] text-slate-500">When disabled, students see a maintenance notice.</div>
              </div>
              <input
                type="checkbox"
                checked={config.enabled}
                onChange={e => setConfig({ ...config, enabled: e.target.checked })}
                className="w-5 h-5 accent-amber-600 rounded cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Active AI Model</label>
              <input
                type="text"
                disabled
                value="gemini-3.8-flash (Google GenAI Server-Side)"
                className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Daily Student Prompt Quota (Rate Limiting)
              </label>
              <input
                type="number"
                min={5}
                max={200}
                value={config.dailyStudentLimit}
                onChange={e => setConfig({ ...config, dailyStudentLimit: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pedagogical System Prompt & Guardrails
              </label>
              <textarea
                rows={6}
                value={config.systemPrompt}
                onChange={e => setConfig({ ...config, systemPrompt: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Includes rule: Never do homework or write complete graded assignments for students.
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Updating...' : 'Save AI Configuration'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Usage Logs (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <History className="w-4 h-4 text-amber-600" />
              <span>Recent AI Mentor Prompts</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-semibold">{usageLogs.length} logged</span>
          </div>

          <div className="space-y-3 max-h-[450px] overflow-y-auto">
            {usageLogs.map((log: any) => (
              <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800 line-clamp-1">{log.topic}</span>
                  <span className="text-[10px] text-slate-400 font-mono">~{log.tokenCount} tokens</span>
                </div>
                <p className="text-[11px] text-slate-600 italic line-clamp-2">"{log.prompt}"</p>
                <div className="text-[10px] text-slate-400">{new Date(log.createdAt).toLocaleTimeString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
