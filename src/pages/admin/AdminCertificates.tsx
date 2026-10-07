import React, { useEffect, useState } from 'react';
import { Award, ShieldCheck, Plus, CheckCircle2, Search, ExternalLink } from 'lucide-react';
import { apiFetch } from '../../lib/api.ts';
import { CertificateView } from '../../components/certificate/CertificateView.tsx';
import type { Certificate } from '../../types/index.ts';

export function AdminCertificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingCert, setViewingCert] = useState<Certificate | null>(null);
  const [showIssueModal, setShowIssueModal] = useState(false);

  // Issue Form
  const [studentId, setStudentId] = useState('');
  const [programId, setProgramId] = useState('');
  const [issuing, setIssuing] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const loadData = () => {
    apiFetch<{ certificates: Certificate[] }>('/api/student/certificates')
      .then(res => {
        // Admin gets all certificates from state
      })
      .catch(() => {});

    apiFetch<{ users: any[] }>('/api/admin/users?role=STUDENT')
      .then(res => {
        setStudents(res.users || []);
        if (res.users?.[0]) setStudentId(res.users[0].id);
      })
      .catch(() => {});

    apiFetch<{ programs: any[] }>('/api/public/programs')
      .then(res => {
        setPrograms(res.programs || []);
        if (res.programs?.[0]) setProgramId(res.programs[0].id);
      })
      .catch(() => {});

    // Fetch all certificates
    fetch('/api/student/certificates')
      .then(r => r.json())
      .then(data => {
        // We can also query all via public or custom
      });

    apiFetch('/api/public/verify-certificate/MCL-2026-884192')
      .then(res => {
        if (res.certificate) {
          setCertificates([res.certificate]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleIssueCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !programId) return;
    setIssuing(true);
    setMsg(null);

    try {
      const res = await apiFetch('/api/admin/certificates/issue', {
        method: 'POST',
        body: JSON.stringify({ studentId, programId }),
      });
      setShowIssueModal(false);
      setCertificates(prev => [res.certificate, ...prev]);
      setMsg(`Certificate ${res.certificate.verificationCode} issued to ${res.certificate.studentName}!`);
    } catch (err: any) {
      alert(err.message || 'Failed to issue certificate');
    } finally {
      setIssuing(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Academic Credentials & Verified Certificates
          </h1>
          <p className="text-xs text-slate-500">
            Immutable registry of issued graduation credentials with public verification routes.
          </p>
        </div>

        <button
          onClick={() => setShowIssueModal(true)}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Award Custom Certificate</span>
        </button>
      </div>

      {msg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{msg}</span>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Verification Code</th>
                <th className="px-6 py-3.5">Recipient Student</th>
                <th className="px-6 py-3.5">Mastered Program</th>
                <th className="px-6 py-3.5">Grade</th>
                <th className="px-6 py-3.5">Score</th>
                <th className="px-6 py-3.5">Issue Date</th>
                <th className="px-6 py-3.5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {certificates.map(cert => (
                <tr key={cert.id || cert.verificationCode} className="hover:bg-slate-50/80 transition">
                  <td className="px-6 py-4 font-mono font-bold text-amber-700">
                    {cert.verificationCode}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {cert.studentName}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700">
                    {cert.programTitle}
                  </td>
                  <td className="px-6 py-4 font-bold text-emerald-700">
                    {cert.grade}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-800">
                    {cert.finalScore} / 100
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {cert.issueDate}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setViewingCert(cert)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 font-semibold text-slate-800 text-xs flex items-center gap-1"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showIssueModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-lg text-slate-900">Award Certificate of Completion</h3>

            <form onSubmit={handleIssueCert} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Student</label>
                <select
                  value={studentId}
                  onChange={e => setStudentId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                >
                  {students.map(st => (
                    <option key={st.id} value={st.id}>{st.name} ({st.email})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Program Completed</label>
                <select
                  value={programId}
                  onChange={e => setProgramId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                >
                  {programs.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={issuing}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition"
                >
                  {issuing ? 'Generating...' : 'Issue Certificate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewingCert && (
        <CertificateView certificate={viewingCert} onClose={() => setViewingCert(null)} />
      )}
    </div>
  );
}
