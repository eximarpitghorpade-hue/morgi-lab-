import React, { useEffect, useState } from 'react';
import {
  FileText, Upload, CheckCircle2, Clock, AlertCircle, Sparkles,
  Paperclip, ArrowRight, Eye, RefreshCw
} from 'lucide-react';
import { apiFetch } from '../../lib/api.ts';

interface StudentProjectsProps {
  openMorniMitr?: () => void;
}

export function StudentProjects({ openMorniMitr }: StudentProjectsProps) {
  const [projects, setProjects] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [activeSubmission, setActiveSubmission] = useState<any>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileType, setFileType] = useState('application/pdf');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadData = () => {
    apiFetch('/api/student/projects')
      .then(res => {
        setProjects(res.projects || []);
        setSubmissions(res.submissions || []);
        if (res.projects && res.projects.length > 0 && !selectedProject) {
          selectProject(res.projects[0], res.submissions || []);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadData();
  }, []);

  const selectProject = (proj: any, subsList = submissions) => {
    setSelectedProject(proj);
    const existingSub = subsList.find((s: any) => s.projectId === proj.id);
    setActiveSubmission(existingSub || null);
    if (existingSub) {
      setTitle(existingSub.title);
      setDescription(existingSub.description);
      if (existingSub.attachments && existingSub.attachments.length > 0) {
        setFileName(existingSub.attachments[0].fileName);
        setFileUrl(existingSub.attachments[0].url);
        setFileType(existingSub.attachments[0].fileType);
      }
    } else {
      setTitle(`Artifact: ${proj.title}`);
      setDescription('');
      setFileName('');
      setFileUrl('');
    }
    setSuccessMsg(null);
    setError(null);
  };

  const handleFileUploadSim = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate allowed file extensions
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type) && !file.name.endsWith('.docx')) {
      setError('Invalid file type. Supported formats: JPG, PNG, WEBP, PDF, DOCX.');
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setError('File size exceeds the 25MB laboratory threshold.');
      return;
    }

    setFileName(file.name);
    setFileType(file.type || 'application/pdf');
    // Generate object URL for preview/attachment
    setFileUrl(URL.createObjectURL(file));
    setError(null);
  };

  const handleSubmit = async (isDraft: boolean) => {
    if (!selectedProject) return;
    if (!title.trim() || !description.trim()) {
      setError('Please provide a title and explanation for your submission.');
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const attachments = fileName ? [{
        fileName,
        fileSize: 2048000,
        fileType,
        url: fileUrl || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800',
      }] : [];

      const res = await apiFetch(`/api/student/projects/${selectedProject.id}/submit`, {
        method: 'POST',
        body: JSON.stringify({
          title,
          description,
          attachments,
          isDraft,
        }),
      });

      setSuccessMsg(isDraft ? 'Project saved as draft!' : 'Project submitted for teacher review!');
      setActiveSubmission(res.submission);
      loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to submit project.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Projects, Assignments & Submissions
          </h1>
          <p className="text-xs text-slate-500">
            Submit your laboratory artifacts, receive rubric grading from teachers, and revise your work.
          </p>
        </div>

        {openMorniMitr && (
          <button
            onClick={openMorniMitr}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2 self-start"
          >
            <span>🦚 Mentor Hints</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Project List (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Assigned Studio Briefs</h3>

          <div className="space-y-2">
            {projects.map(proj => {
              const isSelected = selectedProject?.id === proj.id;
              const sub = submissions.find(s => s.projectId === proj.id);

              return (
                <button
                  key={proj.id}
                  onClick={() => selectProject(proj)}
                  className={`w-full text-left p-4 rounded-2xl border text-xs transition space-y-2 ${
                    isSelected
                      ? 'bg-amber-50/80 border-amber-500 shadow-xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 line-clamp-1">{proj.title}</span>
                    {sub ? (
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        sub.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : sub.status === 'revision_requested'
                          ? 'bg-orange-100 text-orange-800'
                          : sub.status === 'draft'
                          ? 'bg-slate-200 text-slate-700'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {sub.status.replace('_', ' ')}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800">
                        Pending
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{proj.brief}</p>
                  <div className="text-[10px] text-slate-400">Max Score: {proj.maxScore} pts</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Project Details & Submission Form (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {selectedProject ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              {/* Brief Section */}
              <div className="space-y-3 border-b border-slate-100 pb-5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
                  Assignment Specification
                </span>
                <h2 className="text-xl font-bold text-slate-900">{selectedProject.title}</h2>
                <p className="text-xs text-slate-600 leading-relaxed">{selectedProject.brief}</p>

                {selectedProject.requirements && (
                  <div className="space-y-1.5 pt-2">
                    <div className="text-xs font-bold text-slate-800">Deliverable Requirements:</div>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {selectedProject.requirements.map((req: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-amber-600 font-bold">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Existing Feedback Banner if Reviewed */}
              {activeSubmission && activeSubmission.feedback && (
                <div className={`p-5 rounded-2xl border text-xs space-y-2 ${
                  activeSubmission.status === 'approved'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-orange-50 border-orange-200 text-orange-900'
                }`}>
                  <div className="flex items-center justify-between font-bold">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      Teacher Review Score: {activeSubmission.score} / {activeSubmission.maxScore}
                    </span>
                    <span className="uppercase text-[10px] tracking-wider px-2 py-0.5 rounded bg-white font-bold">
                      {activeSubmission.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="italic leading-relaxed">"{activeSubmission.feedback}"</p>
                  {activeSubmission.status === 'revision_requested' && (
                    <div className="font-semibold text-orange-800 pt-1">
                      Action Required: Please adjust your deliverable according to the feedback above and click "Resubmit".
                    </div>
                  )}
                </div>
              )}

              {/* Alerts */}
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

              {/* Submission Form */}
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-slate-900">Your Deliverable</h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Deliverable Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. FitTrack Mobile Typography System Spec"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Design Rational & Execution Notes
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Explain your approach, modular scales used, testing methods, and decisions..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* File Upload Zone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Upload Artifact (JPG, PNG, WEBP, PDF, DOCX - max 25MB)
                  </label>
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-amber-400 transition bg-slate-50/50">
                    <input
                      type="file"
                      id="project-file-upload"
                      onChange={handleFileUploadSim}
                      accept=".jpg,.jpeg,.png,.webp,.pdf,.docx"
                      className="hidden"
                    />
                    <label htmlFor="project-file-upload" className="cursor-pointer block space-y-2">
                      <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div className="text-xs font-semibold text-slate-800">
                        {fileName ? (
                          <span className="text-emerald-700 font-bold flex items-center justify-center gap-1">
                            <Paperclip className="w-3.5 h-3.5" /> {fileName}
                          </span>
                        ) : (
                          <span>Click to browse laboratory file or drag and drop</span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400">PDF, PNG, JPG, or DOCX up to 25MB</p>
                    </label>
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => handleSubmit(true)}
                    className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition"
                  >
                    Save Draft
                  </button>

                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => handleSubmit(false)}
                    className="w-full sm:w-auto px-6 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{submitting ? 'Submitting...' : activeSubmission ? 'Resubmit Deliverable' : 'Submit for Review'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-slate-400 text-xs">
              Select an assignment on the left to view instructions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
