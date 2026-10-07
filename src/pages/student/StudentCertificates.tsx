import React, { useEffect, useState } from 'react';
import { Award, ShieldCheck, Printer, ExternalLink, Calendar, CheckCircle2 } from 'lucide-react';
import { apiFetch } from '../../lib/api.ts';
import { CertificateView } from '../../components/certificate/CertificateView.tsx';
import type { Certificate } from '../../types/index.ts';

export function StudentCertificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingCert, setViewingCert] = useState<Certificate | null>(null);

  useEffect(() => {
    apiFetch<{ certificates: Certificate[] }>('/api/student/certificates')
      .then(res => {
        setCertificates(res.certificates || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="py-20 text-center text-xs text-slate-500">Loading certificate registry...</div>;
  }

  return (
    <div className="space-y-8 pb-12 animate-in fade-in">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Verified Academic Credentials
        </h1>
        <p className="text-xs text-slate-500">
          Certificates awarded upon achieving 100% curriculum completion and mentor approval.
        </p>
      </div>

      {certificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map(cert => (
            <div
              key={cert.id}
              className="bg-white rounded-3xl p-7 border border-slate-200 shadow-xs space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold">
                      🦚
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-500">
                      {cert.verificationCode}
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Official Award
                  </span>
                </div>

                <h3 className="font-bold text-lg text-slate-900">{cert.programTitle}</h3>

                <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Grade</span>
                    <div className="font-bold text-emerald-700">{cert.grade}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Issue Date</span>
                    <div className="font-bold text-slate-800">{cert.issueDate}</div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Public ledger verified & signed by Academic Director</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <a
                  href={`/verify-certificate/${cert.verificationCode}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
                >
                  <span>Verify Public Route</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => setViewingCert(cert)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>View & Print</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
          <Award className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-base text-slate-800">No Certificates Awarded Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Certificates are issued automatically once you complete all lessons and your capstone project is approved by your lead mentor.
          </p>
        </div>
      )}

      {viewingCert && (
        <CertificateView certificate={viewingCert} onClose={() => setViewingCert(null)} />
      )}
    </div>
  );
}
