import React from 'react';

export function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="space-y-2 border-b border-slate-200 pb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-500">
          Last revised: October 2026 • Compliance: Digital Personal Data Protection (DPDP) Act & FERPA/COPPA principles
        </p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">1. Student Privacy Commitment</h2>
          <p>
            MORNI CREATIVE LAB is committed to preserving the privacy, dignity, and security of learners, educators, and partner schools. We do not monetize student personal data, sell student information to third-party ad networks, or use student submissions for commercial advertisement targeting.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">2. Data We Collect</h2>
          <p>
            We collect only necessary educational information: student names, institutional school emails, enrolled program progress, uploaded project artifacts, quiz scores, and teacher feedback notes.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">3. Artificial Intelligence Safety (MORNI MITR)</h2>
          <p>
            When students converse with MORNI MITR AI, queries are transmitted over encrypted HTTPS to our server-side API proxy. Student questions are processed strictly to generate immediate pedagogical responses and are not stored in public training pools.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">4. Institutional Rights</h2>
          <p>
            Partner schools retain complete sovereignty over student accounts and may request account deletion or data portability at any time through our verified Administrative Panel.
          </p>
        </section>
      </div>
    </div>
  );
}
