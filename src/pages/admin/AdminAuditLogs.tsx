import React, { useEffect, useState } from 'react';
import { History, Shield, Search, Filter } from 'lucide-react';
import { apiFetch } from '../../lib/api.ts';
import type { AuditLog } from '../../types/index.ts';

export function AdminAuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  useEffect(() => {
    apiFetch<{ auditLogs: AuditLog[] }>('/api/admin/audit-logs?limit=200')
      .then(res => {
        setLogs(res.auditLogs || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="py-20 text-center text-xs text-slate-500">Loading immutable audit logs...</div>;
  }

  const filtered = logs.filter(l => {
    const matchesAction = actionFilter === 'ALL' || l.action === actionFilter;
    const matchesSearch = l.details.toLowerCase().includes(search.toLowerCase()) ||
                          l.userName.toLowerCase().includes(search.toLowerCase()) ||
                          l.action.toLowerCase().includes(search.toLowerCase());
    return matchesAction && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12 animate-in fade-in">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          System Security & Audit Trail
        </h1>
        <p className="text-xs text-slate-500">
          Immutable event log of user logins, role modifications, submission grading, IDOR attempts, and administrative actions.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Filter bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filter by user, action, or details..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <span className="text-xs text-slate-400 font-medium">
            Showing {filtered.length} audit records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Timestamp</th>
                <th className="px-6 py-3.5">Action Event</th>
                <th className="px-6 py-3.5">Operator</th>
                <th className="px-6 py-3.5">Entity</th>
                <th className="px-6 py-3.5">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(log => {
                const isSecurityAlert = log.action.includes('UNAUTHORIZED') || log.action.includes('IDOR');
                return (
                  <tr key={log.id} className={`transition ${isSecurityAlert ? 'bg-red-50/50' : 'hover:bg-slate-50/80'}`}>
                    <td className="px-6 py-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>

                    <td className="px-6 py-4 font-mono font-bold text-slate-900">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isSecurityAlert
                          ? 'bg-red-100 text-red-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {log.action}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">{log.userName}</div>
                      <div className="text-[10px] text-slate-400 uppercase">{log.userRole}</div>
                    </td>

                    <td className="px-6 py-4 font-mono text-[11px] text-slate-500">
                      {log.entityType} ({log.entityId.slice(0, 12)})
                    </td>

                    <td className="px-6 py-4 text-slate-700 max-w-md">
                      {log.details}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
