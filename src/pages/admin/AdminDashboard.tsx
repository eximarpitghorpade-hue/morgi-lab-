import React, { useEffect, useState } from 'react';
import {
  Users, Building2, BookOpen, CheckSquare, Award, DollarSign,
  TrendingUp, ArrowRight, ShieldCheck, History, Clock
} from 'lucide-react';
import { apiFetch } from '../../lib/api.ts';

interface AdminDashboardProps {
  onNavigateSection: (section: string) => void;
}

export function AdminDashboard({ onNavigateSection }: AdminDashboardProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/api/admin/overview')
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="py-20 text-center text-xs text-slate-500">Loading master analytics...</div>;
  }

  if (!data) return null;

  const { kpis, recentAuditLogs, recentPayments, recentLeads } = data;

  return (
    <div className="space-y-8 pb-12 animate-in fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/30">
            <span>🛡️</span> Founder / Master Admin Panel
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Institutional Oversight & Real-Time Ledger
          </h1>
          <p className="text-xs text-slate-400 max-w-lg">
            Directly monitoring database-backed academic progression, schools, revenue, and security events.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigateSection('schools')}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition"
          >
            Manage Schools
          </button>
          <button
            onClick={() => onNavigateSection('curriculum')}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl border border-slate-700 transition"
          >
            Curriculum Builder
          </button>
        </div>
      </div>

      {/* Real KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">Total Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            ₹{kpis.totalRevenueInr.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold">Verified Completed Payments</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">Enrolled Students</span>
            <Users className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{kpis.totalStudents}</div>
          <div className="text-[10px] text-slate-500 font-semibold">{kpis.totalTeachers} Faculty Mentors</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">Partner Schools</span>
            <Building2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{kpis.totalSchools}</div>
          <div className="text-[10px] text-indigo-600 font-semibold">{kpis.totalPrograms} Programs Active</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">Issued Certificates</span>
            <Award className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{kpis.totalCertificates}</div>
          <div className="text-[10px] text-purple-600 font-semibold">{kpis.approvedSubmissions} Submissions Approved</div>
        </div>
      </div>

      {/* Middle Grid: Recent Leads & Recent Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Recent Institutional Leads (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900">Recent Institutional Inquiries</h3>
            <button
              onClick={() => onNavigateSection('leads')}
              className="text-xs font-bold text-amber-700 hover:underline"
            >
              View All Leads ({kpis.leadsCount} new)
            </button>
          </div>

          <div className="space-y-3">
            {recentLeads?.map((lead: any) => (
              <div key={lead.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{lead.name}</span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-100 text-amber-800">
                    {lead.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600">{lead.organization || lead.email}</div>
                <p className="text-[11px] text-slate-500 line-clamp-1 italic">"{lead.message}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Security Audit Trail (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <History className="w-4 h-4 text-purple-600" />
              <span>Real-Time Audit Trail (Immutable Events)</span>
            </h3>
            <button
              onClick={() => onNavigateSection('audit-logs')}
              className="text-xs font-bold text-purple-700 hover:underline"
            >
              Full Security Log
            </button>
          </div>

          <div className="space-y-2 max-h-[420px] overflow-y-auto">
            {recentAuditLogs?.map((log: any) => (
              <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{log.action}</span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600">{log.details}</div>
                <div className="text-[10px] text-slate-400">
                  User: {log.userName} ({log.userRole})
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
