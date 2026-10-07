import React from 'react';

export function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="space-y-2 border-b border-slate-200 pb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
          Terms of Service
        </h1>
        <p className="text-xs text-slate-500">
          Last updated: October 2026 • Governing Law: Jurisdiction of New Delhi, India
        </p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the MORNI CREATIVE LAB website and learning management systems, you agree to be bound by these Terms of Service.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">2. Academic Integrity & Authentic Work</h2>
          <p>
            Students must submit their own original work for projects and assignments. Submitting automated AI outputs directly as final graded work is strictly prohibited. MORNI MITR is provided as an intellectual guide, not a homework-completion substitute.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">3. Verified Digital Credentials</h2>
          <p>
            Certificates issued by Morni Creative Lab are non-transferable and subject to revocation if plagiarism or falsified submissions are detected during academic review.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">4. Payments & Subscriptions</h2>
          <p>
            Subscriptions are processed through licensed payment partners (e.g. Razorpay). All fees are quoted in Indian Rupees (INR) unless otherwise noted.
          </p>
        </section>
      </div>
    </div>
  );
}
