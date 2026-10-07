import React, { useEffect, useState } from 'react';
import { Layers, Plus, BookOpen, Clock, Award, CheckCircle2, ChevronRight } from 'lucide-react';
import { apiFetch } from '../../lib/api.ts';

export function AdminCurriculum() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAddProgram, setShowAddProgram] = useState(false);

  // New program form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Design & Visual Arts' | 'Robotics & Coding' | 'Creative Writing' | 'Animation & 3D' | 'Digital Storytelling'>('Design & Visual Arts');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [durationWeeks, setDurationWeeks] = useState(8);
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = () => {
    apiFetch('/api/admin/curriculum/all')
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;
    setSaving(true);
    try {
      await apiFetch('/api/admin/programs', {
        method: 'POST',
        body: JSON.stringify({
          title,
          category,
          difficulty,
          durationWeeks,
          description,
        }),
      });
      setShowAddProgram(false);
      setTitle('');
      setDescription('');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to create program');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-xs text-slate-500">Loading curriculum data...</div>;
  }

  const { programs, skills, levels, lessons } = data;

  return (
    <div className="space-y-8 pb-12 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Curriculum Architecture & Content Builder
          </h1>
          <p className="text-xs text-slate-500">
            Define Programs, Skills, Sequential Levels, Interactive Lessons, and Capstone Projects.
          </p>
        </div>

        <button
          onClick={() => setShowAddProgram(true)}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>New Studio Program</span>
        </button>
      </div>

      {/* Programs List */}
      <div className="space-y-6">
        {programs.map((prog: any) => {
          const progSkills = skills.filter((s: any) => s.programId === prog.id);
          const progLessons = lessons.filter((l: any) => l.programId === prog.id);

          return (
            <div key={prog.id} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 uppercase">
                      {prog.category}
                    </span>
                    <span className="text-slate-400 text-xs">•</span>
                    <span className="text-xs text-slate-500">{prog.difficulty} • {prog.durationWeeks} Weeks</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{prog.title}</h3>
                  <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">{prog.description}</p>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="font-extrabold text-amber-700 text-lg">{prog.totalXp} XP</div>
                  <div className="text-[11px] text-slate-400">{progLessons.length} Total Lessons</div>
                </div>
              </div>

              {/* Skills and Levels Tree */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider">
                  Program Skills & Level Breakdown ({progSkills.length})
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {progSkills.map((sk: any) => {
                    const skLevels = levels.filter((l: any) => l.skillId === sk.id);
                    return (
                      <div key={sk.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                        <div className="font-bold text-slate-900 flex items-center justify-between">
                          <span>{sk.title}</span>
                          <span className="text-[10px] text-slate-400 font-mono">Skill #{sk.order}</span>
                        </div>
                        <p className="text-[11px] text-slate-600">{sk.description}</p>
                        <div className="pt-2 flex flex-wrap gap-1.5">
                          {skLevels.map((lvl: any) => (
                            <span key={lvl.id} className="px-2 py-1 rounded-md bg-white border border-slate-200 text-[10px] font-semibold text-slate-700">
                              {lvl.title} (+{lvl.xpReward} XP)
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Program Modal */}
      {showAddProgram && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-lg text-slate-900">Create New Studio Program</h3>

            <form onSubmit={handleCreateProgram} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Program Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Generative AI for Young Creators"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  >
                    <option value="Design & Visual Arts">Design & Visual Arts</option>
                    <option value="Robotics & Coding">Robotics & Coding</option>
                    <option value="Animation & 3D">Animation & 3D</option>
                    <option value="Creative Writing">Creative Writing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={e => setDifficulty(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Duration (Weeks)</label>
                <input
                  type="number"
                  min={1}
                  max={52}
                  value={durationWeeks}
                  onChange={e => setDurationWeeks(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Description *</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Summarize learning outcomes, capstone project, and target age group..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddProgram(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition"
                >
                  {saving ? 'Creating...' : 'Publish Program'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
