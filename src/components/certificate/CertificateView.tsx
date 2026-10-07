import React from 'react';
import { Award, CheckCircle, Printer, X, ExternalLink, ShieldCheck } from 'lucide-react';
import type { Certificate } from '../../types/index.ts';

interface CertificateViewProps {
  certificate: Certificate;
  onClose: () => void;
}

export function CertificateView({ certificate, onClose }: CertificateViewProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden my-8">
        {/* Modal Controls (Hidden in Print) */}
        <div className="no-print bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <span className="font-semibold text-sm">Official Verifiable Academic Credential</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs rounded-lg flex items-center gap-1.5 transition shadow"
            >
              <Printer className="w-4 h-4" /> Print / Save as PDF
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-800 text-slate-300 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Canvas / Document */}
        <div className="p-8 sm:p-12 bg-gradient-to-br from-amber-50/40 via-white to-slate-50 relative">
          {/* Ornate border frame */}
          <div className="border-8 border-double border-amber-900/20 p-8 sm:p-12 rounded-xl relative bg-white shadow-sm">
            {/* Corner Decorative Ornaments */}
            <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-600/60" />
            <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-600/60" />
            <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-600/60" />
            <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-600/60" />

            {/* Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 text-amber-700 text-3xl mb-1 border border-amber-500/20">
                🦚
              </div>
              <h1 className="text-xs sm:text-sm font-bold tracking-[0.25em] text-amber-700 uppercase">
                Morni Creative Lab — Institute of Creative Technology
              </h1>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-serif">
                Certificate of Mastery & Completion
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Accredited Educational Credential • Verified Ledger ID: {certificate.verificationCode}
              </p>
            </div>

            {/* Recipient */}
            <div className="text-center my-8 space-y-3">
              <p className="text-sm text-slate-600 italic">This is proudly presented to</p>
              <div className="text-3xl sm:text-4xl font-bold text-slate-900 border-b-2 border-amber-300 inline-block px-8 pb-1 tracking-tight">
                {certificate.studentName}
              </div>
              <p className="text-sm text-slate-600 max-w-xl mx-auto pt-2 leading-relaxed">
                for successfully fulfilling all curriculum requirements, project milestones, live studio critiques, and practical assessments in
              </p>
              <div className="text-xl sm:text-2xl font-bold text-indigo-900">
                {certificate.programTitle}
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto py-4 bg-slate-50/80 rounded-xl border border-slate-200/80 text-center my-6">
              <div>
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Evaluation Grade</div>
                <div className="text-sm sm:text-base font-bold text-emerald-700">{certificate.grade}</div>
              </div>
              <div>
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Overall Score</div>
                <div className="text-sm sm:text-base font-bold text-slate-800">{certificate.finalScore} / 100</div>
              </div>
              <div>
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Issued Date</div>
                <div className="text-sm sm:text-base font-bold text-slate-800">{certificate.issueDate}</div>
              </div>
            </div>

            {/* Signatures & QR */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end pt-6 mt-6 border-t border-slate-200 text-center">
              <div className="space-y-1">
                <div className="h-10 flex items-center justify-center font-serif italic text-base text-slate-700 font-semibold border-b border-slate-300">
                  {certificate.instructorName.split(',')[0]}
                </div>
                <div className="text-[11px] font-bold text-slate-700 uppercase">{certificate.instructorName}</div>
                <div className="text-[10px] text-slate-500">Lead Academic Mentor</div>
              </div>

              {/* QR Verification Seal */}
              <div className="flex flex-col items-center justify-center space-y-1">
                <div className="w-16 h-16 p-1 bg-white border border-slate-200 rounded-lg shadow-xs flex items-center justify-center">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://mornicreativelab.edu/verify-certificate/${certificate.verificationCode}`}
                    alt="Certificate QR Verification"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-[10px] font-mono text-slate-600 font-semibold">{certificate.verificationCode}</div>
                <div className="text-[9px] text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Ledger Authenticated
                </div>
              </div>

              <div className="space-y-1">
                <div className="h-10 flex items-center justify-center font-serif italic text-base text-slate-700 font-semibold border-b border-slate-300">
                  Arpit Ghorpade
                </div>
                <div className="text-[11px] font-bold text-slate-700 uppercase">Arpit Ghorpade</div>
                <div className="text-[10px] text-slate-500">Founder & Academic Director</div>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Link Bar */}
        <div className="no-print bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between text-xs text-slate-600">
          <span>Public verification URL: <strong className="font-mono text-slate-900">/verify-certificate/{certificate.verificationCode}</strong></span>
          <a
            href={`/verify-certificate/${certificate.verificationCode}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-1"
          >
            <span>Verify Live Ledger</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
