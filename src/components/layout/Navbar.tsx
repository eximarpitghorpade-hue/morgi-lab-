import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import {
  Menu, X, Sparkles, User, LogOut, Shield, GraduationCap,
  BookOpen, ChevronDown, Check
} from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
  openMorniMitr?: () => void;
}

export function Navbar({ currentPath, navigate, openMorniMitr }: NavbarProps) {
  const { user, logout, demoUsers, switchUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);

  const publicNavLinks = [
    { label: 'Home', path: '/' },
    { label: 'Programs', path: '/programs' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'For Students', path: '/for-students' },
    { label: 'For Teachers', path: '/for-teachers' },
    { label: 'For Schools', path: '/for-schools' },
    { label: 'Resources', path: '/resources' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const getPortalHome = () => {
    if (!user) return '/login';
    if (user.role === 'FOUNDER_ADMIN') return '/admin';
    if (user.role === 'TEACHER') return '/teacher';
    return '/student';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2.5 group focus:outline-none text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white text-xl shadow-md group-hover:scale-105 transition-transform duration-200">
                🦚
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-slate-900 group-hover:text-amber-700 transition">
                  MORNI <span className="text-amber-600 font-bold">CREATIVE LAB</span>
                </span>
                <span className="block text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
                  Creative EdTech Institute
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {publicNavLinks.map(link => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    isActive
                      ? 'text-amber-700 bg-amber-50 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center gap-3">
            {/* Reviewer / Fast Role Switcher Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 flex items-center gap-1.5 transition"
                title="Quickly switch between Founder, Teacher, and Student roles for full feature testing"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Role: {user ? user.role.replace('_', ' ') : 'Guest'}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {roleSwitcherOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in">
                  <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Quick Role Switcher (Review Mode)
                  </div>
                  {demoUsers.map(u => {
                    const isCurrent = user?.id === u.id;
                    return (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => {
                          switchUser(u.email);
                          setRoleSwitcherOpen(false);
                          if (u.role === 'FOUNDER_ADMIN') navigate('/admin');
                          else if (u.role === 'TEACHER') navigate('/teacher');
                          else navigate('/student');
                        }}
                        className={`w-full px-3 py-2 text-left flex items-center justify-between text-xs hover:bg-amber-50 transition ${
                          isCurrent ? 'bg-amber-50/80 font-bold text-amber-900' : 'text-slate-700'
                        }`}
                      >
                        <div>
                          <div className="font-semibold text-slate-900">{u.name}</div>
                          <div className="text-[10px] text-slate-500">
                            {u.role} {u.schoolName ? `• ${u.schoolName}` : ''}
                          </div>
                        </div>
                        {isCurrent && <Check className="w-4 h-4 text-amber-600" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Morni Mitr AI Quick Launcher button */}
            {openMorniMitr && (
              <button
                type="button"
                onClick={openMorniMitr}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white flex items-center gap-1.5 shadow-sm transition"
              >
                <span>🦚 Morni Mitr AI</span>
              </button>
            )}

            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-full text-xs font-semibold text-slate-800 transition"
                >
                  <img
                    src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'}
                    alt={user.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span>{user.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <div className="font-bold text-xs text-slate-900">{user.name}</div>
                      <div className="text-[10px] text-slate-500 truncate">{user.email}</div>
                      <div className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800">
                        {user.role}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        navigate(getPortalHome());
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <GraduationCap className="w-4 h-4 text-amber-600" /> Go to Portal
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                        navigate('/');
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-slate-100"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/login')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/book-demo')}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition shadow-sm"
                >
                  Book a Demo
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          <div className="grid grid-cols-2 gap-1.5 mb-3">
            {publicNavLinks.map(link => (
              <button
                key={link.path}
                onClick={() => {
                  navigate(link.path);
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-2 text-left rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
            {user ? (
              <button
                onClick={() => {
                  navigate(getPortalHome());
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs text-center"
              >
                Go to {user.role === 'FOUNDER_ADMIN' ? 'Admin Panel' : user.role === 'TEACHER' ? 'Teacher Dashboard' : 'Student Portal'}
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    navigate('/login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-xs font-bold border border-slate-300 rounded-xl text-slate-800 text-center"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    navigate('/book-demo');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-xs font-bold bg-slate-900 rounded-xl text-white text-center"
                >
                  Book a Demo
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
