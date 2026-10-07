import React, { useEffect, useState } from 'react';
import { DollarSign, CheckCircle2, ShieldCheck, Download, ExternalLink } from 'lucide-react';
import { apiFetch } from '../../lib/api.ts';

export function AdminPayments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ payments: any[] }>('/api/admin/payments')
      .then(res => {
        setPayments(res.payments || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="py-20 text-center text-xs text-slate-500">Loading payment ledger...</div>;
  }

  const totalInr = payments.reduce((sum, p) => sum + (p.amountInr || 0), 0);

  return (
    <div className="space-y-8 pb-12 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Payments, Subscriptions & Razorpay Transactions
          </h1>
          <p className="text-xs text-slate-500">
            Real-time ledger of completed fees, invoices, and payment gateway signatures.
          </p>
        </div>

        <div className="px-5 py-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-right">
          <div className="text-[10px] text-emerald-800 font-semibold uppercase">Total Revenue Collected</div>
          <div className="text-xl font-extrabold text-emerald-700">₹{totalInr.toLocaleString('en-IN')}</div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Invoice #</th>
                <th className="px-6 py-3.5">Subscriber</th>
                <th className="px-6 py-3.5">Subscribed Plan</th>
                <th className="px-6 py-3.5">Amount</th>
                <th className="px-6 py-3.5">Razorpay Payment ID</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map(pay => (
                <tr key={pay.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-6 py-4 font-mono font-bold text-slate-900">
                    {pay.invoiceNumber}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{pay.userName}</div>
                    <div className="text-[11px] text-slate-400">{pay.userEmail}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {pay.planName}
                  </td>
                  <td className="px-6 py-4 font-bold text-emerald-700">
                    ₹{pay.amountInr.toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-4 font-mono text-[11px] text-slate-500">
                    {pay.razorpayPaymentId}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(pay.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Completed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
