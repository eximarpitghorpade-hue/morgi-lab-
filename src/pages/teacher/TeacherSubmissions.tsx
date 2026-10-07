import React, { useEffect, useState } from 'react';
import { CheckSquare, Sparkles, AlertCircle, CheckCircle2, ArrowRight, ExternalLink } from 'lucide-react';
import { apiFetch } from '../../lib/api.ts';

export function TeacherSubmissions() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [selectedSub, setSelectedSub] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Review Form
  const [status, setStatus] = useState<string>('approved');
  const [score, setScore] = useState<number>(90);
  const [feedback, setFeedback] = useState<string>('');
  const [teacherNotes, setTeacherNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadSubmissions = () => {
    apiFetch<{ submissions: any[] }>('/api/teacher/submissions')
      .then(res => {
        setSubmissions(res.submissions || []);
        if (res.submissions && res.submissions.length > 0 && !selectedSub) {
          selectSubmission(res.submissions[0]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const selectSubmission = (sub: any) => {
    setSelectedSub(sub);
    setStatus(sub.status === 'draft' || sub.status === 'under_review' ? 'approved' : sub.status);
    setScore(sub.score || 90);
    setFeedback(sub.feedback || '');
    setTeacherNotes(sub.teacherNotes || '');
    setSuccessMsg(null);
    setError(null);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;
    if (!feedback.trim()) {
      setError('Constructive mentor feedback is required before submitting review.');
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await apiFetch(`/api/teacher/submissions/${selectedSub.id}/review`, {
        method: 'POST',
        body: JSON.stringify({
          status,
          score,
          feedback,
          teacherNotes,
        }),
      });

      setSuccessMsg(`Submission updated to "${status}" and feedback dispatched to student.`);
      setSelectedSub(res.submission);
      loadSubmissions();
    } catch (err: any) {
      setError(err.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-xs text-slate-500">Loading submissions...</div>;
  }

  return (
    <div className="space-y-8 pb-12 animate-in fade-in">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Review Student Submissions
        </h1>
        <p className="text-xs text-slate-500">
          Inspect student deliverables, verify rubric criteria, award XP, or request revisions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Submissions List (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4 max-h-[750px] overflow-y-auto">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900">Submissions Queue</h3>
            <span className="text-[11px] text-slate-400">{submissions.length} total</span>
          </div>

          <div className="space-y-2">
            {submissions.map(sub => {
              const isSelected = selectedSub?.id === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => selectSubmission(sub)}
                  className={`w-full text-left p-3.5 rounded-2xl border text-xs transition space-y-1.5 ${
                    isSelected
                      ? 'bg-indigo-50/80 border-indigo-500 shadow-xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 line-clamp-1">{sub.studentName}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      sub.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : sub.status === 'revision_requested'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {sub.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="font-medium text-slate-700 line-clamp-1">{sub.title}</div>
                  <div className="text-[10px] text-slate-400">{sub.projectTitle}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Review Workspace (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          {selectedSub ? (
            <div className="space-y-6">
              {/* Submission Information */}
              <div className="space-y-3 border-b border-slate-100 pb-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                      {selectedSub.projectTitle}
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 mt-1">{selectedSub.title}</h2>
                  </div>
                  <div className="text-left sm:text-right text-xs">
                    <div className="font-bold text-slate-900">{selectedSub.studentName}</div>
                    <div className="text-[11px] text-slate-400">{selectedSub.studentEmail}</div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
                  <div className="font-bold text-slate-800 uppercase text-[10px]">Student Submission Notes:</div>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{selectedSub.description}</p>
                </div>

                {/* Attachments */}
                {selectedSub.attachments && selectedSub.attachments.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-700">Uploaded Artifacts:</div>
                    <div className="space-y-1.5">
                      {selectedSub.attachments.map((att: any) => (
                        <div
                          key={att.id}
                          className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-slate-500 uppercase text-[10px]">{att.fileType.split('/')[1] || 'FILE'}</span>
                            <span className="font-bold text-slate-900">{att.fileName}</span>
                          </div>
                          <a
                            href={att.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1"
                          >
                            <span>Inspect Deliverable</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Status & Messages */}
              {successMsg && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{successMsg}</span>
                </div>
              )}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span>{error}</span>
                </div>
              )}

              {/* Evaluation Form */}
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <h3 className="font-bold text-sm text-slate-900">Mentor Evaluation & Rubric</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Decision / Status</label>
                    <select
                      value={status}
                      onChange={e => setStatus(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                    >
                      <option value="approved">Approve & Award XP</option>
                      <option value="revision_requested">Request Revision (Feedback required)</option>
                      <option value="rejected">Reject Submission</option>
                      <option value="under_review">Keep Under Review</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Score (out of {selectedSub.maxScore})
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={selectedSub.maxScore}
                      value={score}
                      onChange={e => setScore(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Student Feedback (Visible to Student) *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={feedback}
                    onChange={e => setFeedback(e.target.value)}
                    placeholder="Provide constructive feedback on contrast, code modularity, execution, or what to refine..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Internal Teacher Notes (Private, for faculty only)
                  </label>
                  <input
                    type="text"
                    value={teacherNotes}
                    onChange={e => setTeacherNotes(e.target.value)}
                    placeholder="Candidate for portfolio feature or special mentorship..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2"
                  >
                    <CheckSquare className="w-4 h-4" />
                    <span>{submitting ? 'Recording Evaluation...' : 'Submit Evaluation & Send Feedback'}</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="py-20 text-center text-slate-400 text-xs">
              Select a submission from the left queue to inspect and evaluate.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
