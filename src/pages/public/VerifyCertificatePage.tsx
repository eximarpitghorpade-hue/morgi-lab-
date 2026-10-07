import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle, Search, Award, Printer } from 'lucide-react';
import { apiFetch } from '../../lib/api.ts';

interface VerifyCertificatePageProps {
  initialCode?: string;
  navigate: (path: string) => void;
}

export function VerifyCertificatePage({ initialCode = 'MCL-2026-884192', navigate }: VerifyCertificatePageProps) {
  const [code, setCode] = useState(initialCode);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyCode = async (searchCode: string) => {
    if (!searchCode.trim()) return;
    setLoading(true);
    setError(null);
    setVerificationResult(null);

    try {
      const data = await apiFetch<{ valid: boolean; certificate: any }>(
        `/api/public/verify-certificate/${encodeURIComponent(searchCode.trim().toUpperCase())}`
      );
      setVerificationResult(data.certificate);
    } catch (err: any) {
      setError(err.message || 'Verification failed. Certificate not found in ledger.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialCode) {
      verifyCode(initialCode);
    }
  }, [initialCode]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    verifyCode(code);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Public Cryptographic Credential Registry</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight">
          Verify Certificate Authenticity
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          Enter any 15-character Morni Creative Lab certificate verification code to inspect issuance records, scores, and mentor approvals directly from our database.
        </p>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearch} className="max-w-xl mx-auto flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            placeholder="e.g. MCL-2026-884192"
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-xs font-mono font-semibold tracking-wider text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !code.trim()}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition"
        >
          {loading ? 'Verifying...' : 'Verify'}
        </button>
      </form>

      {/* Error state */}
      {error && (
        <div className="max-w-xl mx-auto p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-bold">Credential Not Verified</div>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Verified Certificate Card */}
      {verificationResult && (
        <div className="bg-white rounded-3xl border-2 border-emerald-500/30 shadow-xl overflow-hidden p-8 sm:p-10 space-y-8 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  Verified Official Record
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  Tamper-Proof Credential Confirmed
                </h3>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-xs text-slate-400 font-semibold uppercase">Certificate ID</div>
              <div className="text-sm font-mono font-bold text-slate-900">{verificationResult.verificationCode}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 font-medium">Graduate / Recipient</span>
              <div className="font-bold text-slate-900 text-sm mt-0.5">{verificationResult.studentName}</div>
              {verificationResult.schoolName && (
                <div className="text-[11px] text-slate-500">{verificationResult.schoolName}</div>
              )}
            </div>

            <div>
              <span className="text-slate-400 font-medium">Program Mastered</span>
              <div className="font-bold text-slate-900 text-sm mt-0.5">{verificationResult.programTitle}</div>
              <div className="text-[11px] text-slate-500">{verificationResult.programCategory}</div>
            </div>

            <div>
              <span className="text-slate-400 font-medium">Grade & Final Score</span>
              <div className="font-bold text-emerald-700 text-sm mt-0.5">{verificationResult.grade}</div>
              <div className="text-[11px] text-slate-500">{verificationResult.finalScore} / 100 on rubric</div>
            </div>

            <div>
              <span className="text-slate-400 font-medium">Date of Issue</span>
              <div className="font-bold text-slate-900 text-sm mt-0.5">{verificationResult.issueDate}</div>
              <div className="text-[11px] text-emerald-700 font-semibold">Ledger Active</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
            <div>
              Signed by: <strong>{verificationResult.instructorName}</strong> & <strong>{verificationResult.founderSignature}</strong>
            </div>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" /> Print Verification Proof
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
