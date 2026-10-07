import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import {
  LayoutDashboard, BookOpen, Layers, CheckSquare, Video,
  Trophy, Award, Bell, User, Settings, LogOut, Menu, X,
  Users, Building2, Shield, DollarSign, FileText, Brain,
  Sparkles, History, ChevronRight
} from 'lucide-react';

interface PortalLayoutProps {
  currentSection: string;
  onNavigateSection: (section: string) => void;
  openMorniMitr?: () => void;
  unreadCount?: number;
  children: React.ReactNode;
}

export function PortalLayout({
  currentSection,
  onNavigateSection,
  openMorniMitr,
  unreadCount = 0,
  children,
}: PortalLayoutProps) {
  const { user, logout } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (!user) return null;

  // Navigation Items per Role
  let navItems: { id: string; label: string; icon: any; badge?: number }[] = [];

  if (user.role === 'STUDENT') {
    navItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'learning', label: 'My Learning & Skills', icon: BookOpen },
      { id: 'projects', label: 'Projects & Submissions', icon: CheckSquare },
      { id: 'live-classes', label: 'Live Classes', icon: Video },
      { id: 'gamification', label: 'Leaderboard & Streaks', icon: Trophy },
      { id: 'achievements', label: 'Badges & Achievements', icon: Award },
      { id: 'certificates', label: 'My Certificates', icon: Award },
      { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
      { id: 'profile', label: 'Profile & Settings', icon: User },
    ];
  } else if (user.role === 'TEACHER') {
    navItems = [
      { id: 'dashboard', label: 'Overview & Metrics', icon: LayoutDashboard },
      { id: 'submissions', label: 'Review Submissions', icon: CheckSquare },
      { id: 'students', label: 'Assigned Students', icon: Users },
      { id: 'live-classes', label: 'Live Classes & Attendance', icon: Video },
    ];
  } else if (user.role === 'FOUNDER_ADMIN') {
    navItems = [
      { id: 'dashboard', label: 'Master Dashboard', icon: LayoutDashboard },
      { id: 'schools', label: 'Partner Schools', icon: Building2 },
      { id: 'users', label: 'Users & Roles', icon: Users },
      { id: 'curriculum', label: 'Curriculum & Programs', icon: Layers },
      { id: 'submissions', label: 'Submissions Oversight', icon: CheckSquare },
      { id: 'live-classes', label: 'Live Classes & Attendance', icon: Video },
      { id: 'certificates', label: 'Certificates Ledger', icon: Award },
      { id: 'payments', label: 'Payments & Revenue', icon: DollarSign },
      { id: 'leads', label: 'Leads & Inquiries', icon: FileText },
      { id: 'ai-settings', label: 'Morni Mitr AI Config', icon: Brain },
      { id: 'audit-logs', label: 'Security & Audit Logs', icon: History },
    ];
  }

  const roleBadge = () => {
    switch (user.role) {
      case 'FOUNDER_ADMIN':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">FOUNDER ADMIN</span>;
      case 'TEACHER':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">TEACHER MENTOR</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">STUDENT</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xl">🦚</span>
          <span className="font-bold text-sm tracking-tight">MORNI LAB PORTAL</span>
        </div>
        <div className="flex items-center gap-2">
          {openMorniMitr && (
            <button
              onClick={openMorniMitr}
              className="p-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs"
            >
              🦚 AI
            </button>
          )}
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 text-slate-300 hover:text-white"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-30 h-screen w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-200 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* User Card */}
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <img
              src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'}
              alt={user.name}
              className="w-11 h-11 rounded-xl object-cover ring-2 ring-amber-500/50"
            />
            <div className="overflow-hidden">
              <h3 className="font-bold text-sm text-white truncate">{user.name}</h3>
              <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
              <div className="mt-1">{roleBadge()}</div>
            </div>
          </div>
          {user.schoolName && (
            <div className="mt-3 px-2 py-1 rounded bg-slate-800/80 text-[10px] text-slate-400 truncate">
              🏫 {user.schoolName}
            </div>
          )}
        </div>

        {/* Navigation Link List */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigateSection(item.id);
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge ? (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-red-500 text-white">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* Bottom AI Launcher & Logout */}
        <div className="p-3 border-t border-slate-800 space-y-2">
          {openMorniMitr && (
            <button
              onClick={openMorniMitr}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow transition"
            >
              <span>🦚 MORNI MITR AI</span>
            </button>
          )}
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-red-400 hover:bg-slate-800/60 rounded-xl transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
