import React, { useState } from 'react';
import { Download, FileText, ExternalLink, Search, Sparkles } from 'lucide-react';

interface ResourcesPageProps {
  navigate: (path: string) => void;
  openMorniMitr?: () => void;
}

export function ResourcesPage({ navigate, openMorniMitr }: ResourcesPageProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const materials = [
    {
      id: 'res_1',
      title: 'Mobile UI Wireframe Kit & 8pt Grid Specimen',
      category: 'Design Template',
      format: 'FIGMA (.fig)',
      size: '12.4 MB',
      description: 'Pre-configured auto-layout frames, WCAG-tested neutral colors, and mobile navbar tokens.',
    },
    {
      id: 'res_2',
      title: 'Microcontroller Pinout Cheat Sheet & Sensor Wiring',
      category: 'Hardware Guide',
      format: 'PDF',
      size: '3.8 MB',
      description: 'Pin-by-pin schematics for ultrasonic distance sensors, servo controllers, and I2C LCD screens.',
    },
    {
      id: 'res_3',
      title: '12 Principles of Animation Reference Flipbook',
      category: 'Asset Pack',
      format: 'ZIP',
      size: '45.1 MB',
      description: '24fps looping character rigs illustrating squash & stretch, anticipation, and follow-through.',
    },
    {
      id: 'res_4',
      title: 'Creative Coding 2D Canvas Physics Starter Kit',
      category: 'Code Boilerplate',
      format: 'ZIP',
      size: '1.2 MB',
      description: 'Clean JavaScript template with delta-time game loop, collision physics, and particle emitter.',
    },
    {
      id: 'res_5',
      title: 'Project Submission Rubric & Self-Review Checklist',
      category: 'Academic Checklist',
      format: 'PDF',
      size: '540 KB',
      description: 'Use the exact rubric our teachers use to inspect contrast, hierarchy, and code modularity.',
    },
  ];

  const handleDownload = (title: string) => {
    setDownloadNotice(`Downloading "${title}" starter pack...`);
    setTimeout(() => setDownloadNotice(null), 4000);
  };

  const categories = ['All', 'Design Template', 'Hardware Guide', 'Asset Pack', 'Code Boilerplate', 'Academic Checklist'];

  const filtered = activeCategory === 'All'
    ? materials
    : materials.filter(m => m.category === activeCategory);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
          Open Maker Library
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight">
          Learning Resources & Starter Kits
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Free starter files, cheat sheets, schematics, and design templates created by Morni Creative Lab mentors.
        </p>
      </div>

      {downloadNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium text-center animate-in fade-in">
          {downloadNotice}
        </div>
      )}

      {/* Category Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeCategory === cat
                ? 'bg-amber-600 text-white font-bold'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Resources List */}
      <div className="space-y-4">
        {filtered.map(mat => (
          <div
            key={mat.id}
            className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-amber-300 transition"
          >
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                  {mat.format}
                </span>
                <span className="text-[11px] font-semibold text-amber-700">
                  {mat.category}
                </span>
                <span className="text-slate-400 text-xs">•</span>
                <span className="text-[11px] text-slate-400">{mat.size}</span>
              </div>
              <h3 className="font-bold text-base text-slate-900">{mat.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{mat.description}</p>
            </div>

            <button
              onClick={() => handleDownload(mat.title)}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition flex-shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Pack</span>
            </button>
          </div>
        ))}
      </div>

      {/* Morni Mitr Assistance Callout */}
      {openMorniMitr && (
        <div className="p-6 bg-gradient-to-r from-amber-50 to-indigo-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🦚</span>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Need help understanding any starter kit?</h4>
              <p className="text-xs text-slate-600">Morni Mitr can explain the syntax, pins, or design tokens step by step.</p>
            </div>
          </div>
          <button
            onClick={openMorniMitr}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition flex-shrink-0"
          >
            Ask Morni Mitr
          </button>
        </div>
      )}
    </div>
  );
}
