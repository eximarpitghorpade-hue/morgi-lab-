import React, { useEffect, useState } from 'react';
import { Mail, Phone, Building2, CheckCircle2, Clock, Check } from 'lucide-react';
import { apiFetch } from '../../lib/api.ts';
import type { Lead } from '../../types/index.ts';

export function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLeads = () => {
    apiFetch<{ leads: Lead[] }>('/api/admin/leads')
      .then(res => {
        setLeads(res.leads || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await apiFetch(`/api/admin/leads/${id}/status`, {
        method: 'POST',
        body: JSON.stringify({ status: newStatus }),
      });
      loadLeads();
    } catch (e) {
      alert('Failed to update lead status');
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-xs text-slate-500">Loading leads pipeline...</div>;
  }

  return (
    <div className="space-y-8 pb-12 animate-in fade-in">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Admissions, Demos & Partnership Inquiries
        </h1>
        <p className="text-xs text-slate-500">
          Inbound leads captured from Book Demo, Contact forms, and school outreach campaigns.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Contact Name</th>
                <th className="px-6 py-3.5">School / Institution</th>
                <th className="px-6 py-3.5">Type</th>
                <th className="px-6 py-3.5">Message / Inquiry</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Pipeline Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.map(lead => (
                <tr key={lead.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{lead.name}</div>
                    <div className="text-[11px] text-slate-400">{lead.email}</div>
                    {lead.phone && <div className="text-[10px] text-slate-400">{lead.phone}</div>}
                  </td>

                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-800">{lead.organization || 'Independent'}</div>
                    {lead.role && <div className="text-[10px] text-slate-500">{lead.role}</div>}
                    {lead.studentCountEstimate && (
                      <div className="text-[10px] text-amber-700 font-semibold">{lead.studentCountEstimate} students est.</div>
                    )}
                  </td>

                  <td className="px-6 py-4 font-mono uppercase text-[10px] font-bold text-slate-600">
                    {lead.type.replace('_', ' ')}
                  </td>

                  <td className="px-6 py-4 text-slate-600 max-w-xs truncate" title={lead.message}>
                    {lead.message}
                  </td>

                  <td className="px-6 py-4 text-slate-500">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4">
                    <select
                      value={lead.status}
                      onChange={e => updateStatus(lead.id, e.target.value)}
                      className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
                    >
                      <option value="new">New Inquiry</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                      <option value="converted">Converted Partner</option>
                      <option value="closed">Closed / Inactive</option>
                    </select>
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
