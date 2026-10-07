import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  BookOpen, CheckCircle2, Lock, Play, FileText, HelpCircle,
  Clock, Award, ArrowRight, ChevronRight, AlertCircle, Sparkles
} from 'lucide-react';
import { apiFetch } from '../../lib/api.ts';

interface StudentLearningProps {
  openMorniMitr?: () => void;
}

export function StudentLearning({ openMorniMitr }: StudentLearningProps) {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState<string>('prg_uiux');
  const [curriculumData, setCurriculumData] = useState<any>(null);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [completing, setCompleting] = useState(false);
  const [lessonFeedback, setLessonFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load student enrollments
  useEffect(() => {
    apiFetch<{ enrollments: any[] }>('/api/student/enrollments')
      .then(res => {
        setEnrollments(res.enrollments || []);
        if (res.enrollments && res.enrollments.length > 0) {
          setSelectedProgramId(res.enrollments[0].programId);
        }
      })
      .catch(() => {});
  }, []);

  // Load program curriculum with sequential unlocking
  const loadCurriculum = (pId: string) => {
    apiFetch(`/api/student/programs/${pId}/curriculum`)
      .then(res => {
        setCurriculumData(res);
        // Find first unlocked or active lesson
        let foundLesson: any = null;
        for (const skill of res.curriculum || []) {
          for (const lvl of skill.levels || []) {
            for (const lsn of lvl.lessons || []) {
              if (lsn.isUnlocked && !lsn.isCompleted && !foundLesson) {
                foundLesson = lsn;
              }
            }
          }
        }
        if (!foundLesson && res.curriculum?.[0]?.levels?.[0]?.lessons?.[0]) {
          foundLesson = res.curriculum[0].levels[0].lessons[0];
        }
        setActiveLesson(foundLesson);
      })
      .catch(err => {
        console.error('Failed to load curriculum:', err);
      });
  };

  useEffect(() => {
    if (selectedProgramId) {
      loadCurriculum(selectedProgramId);
    }
  }, [selectedProgramId]);

  const handleCompleteLesson = async () => {
    if (!activeLesson) return;
    setCompleting(true);
    setError(null);
    setLessonFeedback(null);

    try {
      const res = await apiFetch(`/api/student/lessons/${activeLesson.id}/complete`, {
        method: 'POST',
        body: JSON.stringify({
          quizAnswers: activeLesson.type === 'quiz' ? quizAnswers : undefined,
          timeSpentMinutes: 15,
        }),
      });

      // Confetti celebration
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {}

      setLessonFeedback(res.message || 'Lesson completed successfully! XP has been awarded.');
      // Refresh curriculum to unlock next sequential lesson
      loadCurriculum(selectedProgramId);
    } catch (err: any) {
      setError(err.message || 'Failed to complete lesson.');
    } finally {
      setCompleting(false);
    }
  };

  if (!curriculumData) {
    return (
      <div className="py-20 text-center text-slate-500 text-xs">
        <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin mx-auto mb-2" />
        Loading curriculum...
      </div>
    );
  }

  const { program, enrollment, curriculum } = curriculumData;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Program Selector Tabs */}
      {enrollments.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {enrollments.map(enr => (
            <button
              key={enr.id}
              onClick={() => setSelectedProgramId(enr.programId)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedProgramId === enr.programId
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {enr.program?.title || 'Program'}
            </button>
          ))}
        </div>
      )}

      {/* Program Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 uppercase tracking-wider">
            {program.category}
          </span>
          <h1 className="text-2xl font-bold text-slate-900">{program.title}</h1>
          <p className="text-xs text-slate-600 max-w-xl">{program.description}</p>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center min-w-[140px]">
          <div className="text-2xl font-extrabold text-amber-600">{enrollment?.progressPercent || 0}%</div>
          <div className="text-[10px] font-semibold text-slate-500 uppercase mt-0.5">Program Progress</div>
        </div>
      </div>

      {/* Main Two-Column Layout: Curriculum Tree vs Lesson Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Curriculum Tree (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-5 max-h-[750px] overflow-y-auto">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900">Curriculum Tree</h3>
            <span className="text-[11px] text-slate-500 font-medium">Sequential Unlocks</span>
          </div>

          <div className="space-y-6">
            {curriculum.map((skill: any, sIdx: number) => (
              <div key={skill.id} className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold text-xs">
                    {sIdx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{skill.title}</h4>
                    <p className="text-[10px] text-slate-400">{skill.description}</p>
                  </div>
                </div>

                {skill.levels?.map((lvl: any) => (
                  <div key={lvl.id} className="ml-4 pl-3 border-l-2 border-slate-100 space-y-2">
                    <div className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                      <span>{lvl.title}</span>
                      <span className="text-[10px] text-amber-700 font-normal">+{lvl.xpReward} XP</span>
                    </div>

                    <div className="space-y-1">
                      {lvl.lessons?.map((lsn: any) => {
                        const isCurrent = activeLesson?.id === lsn.id;
                        const isLocked = !lsn.isUnlocked;

                        return (
                          <button
                            key={lsn.id}
                            disabled={isLocked}
                            onClick={() => {
                              setActiveLesson(lsn);
                              setLessonFeedback(null);
                              setError(null);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition ${
                              isCurrent
                                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                                : isLocked
                                ? 'opacity-40 cursor-not-allowed bg-slate-50 text-slate-400'
                                : lsn.isCompleted
                                ? 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                                : 'bg-white border border-slate-200 text-slate-800 hover:bg-amber-50'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              {lsn.isCompleted ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                              ) : isLocked ? (
                                <Lock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                              ) : (
                                <Play className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                              )}
                              <span className="truncate">{lsn.title}</span>
                            </div>
                            <span className="text-[10px] ml-1 uppercase">{lsn.type}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Active Lesson Interactive Player / Workspace (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          {activeLesson ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 uppercase">
                      {activeLesson.type}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3 h-3 text-amber-600" /> {activeLesson.durationMinutes} min
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{activeLesson.title}</h2>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                    +{activeLesson.xpAward} XP
                  </span>
                  {openMorniMitr && (
                    <button
                      onClick={openMorniMitr}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 transition"
                    >
                      <span>🦚 Ask AI</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Feedback or Error messages */}
              {lessonFeedback && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{lessonFeedback}</span>
                </div>
              )}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span>{error}</span>
                </div>
              )}

              {/* Lesson Media: Video if applicable */}
              {activeLesson.type === 'video' && activeLesson.videoUrl && (
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 shadow-md">
                  <iframe
                    src={activeLesson.videoUrl}
                    title={activeLesson.title}
                    className="w-full h-full border-0"
                    allowFullScreen
                  />
                </div>
              )}

              {/* Lesson Written Content */}
              <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed space-y-4">
                <div className="whitespace-pre-wrap">{activeLesson.content}</div>

                {activeLesson.instructions && (
                  <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl text-xs space-y-1">
                    <span className="font-bold text-amber-900 uppercase tracking-wider text-[10px]">
                      Activity Instructions
                    </span>
                    <p className="text-slate-800">{activeLesson.instructions}</p>
                  </div>
                )}
              </div>

              {/* Interactive Quiz Component if Quiz Type */}
              {activeLesson.type === 'quiz' && activeLesson.quizQuestions && (
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-6">
                  <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-amber-600" />
                      <span>Knowledge Check Quiz</span>
                    </h3>
                    <span className="text-[11px] text-slate-500">50% required to pass</span>
                  </div>

                  <div className="space-y-6">
                    {activeLesson.quizQuestions.map((q: any, qIdx: number) => (
                      <div key={q.id} className="space-y-3">
                        <div className="font-semibold text-xs text-slate-900">
                          {qIdx + 1}. {q.prompt}
                        </div>
                        <div className="space-y-2">
                          {q.options?.map((opt: any) => {
                            const isSelected = quizAnswers[q.id] === opt.id;
                            return (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => setQuizAnswers({ ...quizAnswers, [q.id]: opt.id })}
                                className={`w-full text-left p-3 rounded-xl border text-xs transition flex items-center justify-between ${
                                  isSelected
                                    ? 'bg-amber-100/70 border-amber-500 font-semibold text-amber-950'
                                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                                }`}
                              >
                                <span>{opt.text}</span>
                                {isSelected && <span className="w-2 h-2 rounded-full bg-amber-600" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Action Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  {activeLesson.isCompleted ? 'Status: Completed' : 'Status: Ready to complete'}
                </span>

                <button
                  onClick={handleCompleteLesson}
                  disabled={completing}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{completing ? 'Validating...' : activeLesson.isCompleted ? 'Mark Again' : 'Complete & Unlock Next'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-slate-400 text-xs">
              Select a lesson from the curriculum tree on the left to begin.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
