import React, { useEffect, useState } from 'react';
import { Search, Filter, BookOpen, Clock, Award, ArrowRight, Check } from 'lucide-react';
import { apiFetch } from '../../lib/api.ts';
import type { Program } from '../../types/index.ts';

interface ProgramsPageProps {
  navigate: (path: string) => void;
}

export function ProgramsPage({ navigate }: ProgramsPageProps) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  useEffect(() => {
    apiFetch<{ programs: Program[] }>('/api/public/programs')
      .then(data => {
        setPrograms(data.programs || []);
        if (data.programs && data.programs.length > 0) {
          setSelectedProgram(data.programs[0]);
        }
      })
      .catch(() => {});
  }, []);

  const categories = ['All', 'Design & Visual Arts', 'Robotics & Coding', 'Animation & 3D'];

  const filteredPrograms = programs.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
          Academic Curriculum
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight">
          Creative Lab Programs
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Industry-aligned programs combining theoretical depth, laboratory assignments, weekly live studio critiques, and verifiable certificates.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-amber-600 text-white font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search programs or skills..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Grid of Programs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrograms.map(prog => (
          <div
            key={prog.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="h-48 overflow-hidden relative">
                <img
                  src={prog.thumbnailUrl}
                  alt={prog.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-900/80 text-white">
                  {prog.category}
                </span>
                <span className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950">
                  {prog.totalXp} XP
                </span>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600" /> {prog.durationWeeks} Weeks
                  </span>
                  <span>•</span>
                  <span>{prog.difficulty}</span>
                </div>

                <h3 className="font-bold text-lg text-slate-900 leading-snug">
                  {prog.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {prog.description}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                {prog.skillsCount} Core Skills
              </span>
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5"
              >
                <span>Enroll Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
