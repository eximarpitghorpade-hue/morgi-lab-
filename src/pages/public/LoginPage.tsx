import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { LogIn, Key, Mail, Shield, AlertCircle, ArrowRight, UserCheck } from 'lucide-react';
import { apiFetch } from '../../lib/api.ts';

interface LoginPageProps {
  navigate: (path: string) => void;
}

export function LoginPage({ navigate }: LoginPageProps) {
  const { login, switchUser, demoUsers } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      // Direct user according to role
      const userRes = await apiFetch<{ user: any }>('/api/auth/me');
      if (userRes.user?.role === 'FOUNDER_ADMIN') navigate('/admin');
      else if (userRes.user?.role === 'TEACHER') navigate('/teacher');
      else navigate('/student');
    } else {
      setError(result.error || 'Invalid credentials.');
    }
  };

  const handleQuickLogin = async (demoEmail: string, role: string) => {
    setIsLoading(true);
    setError(null);
    await switchUser(demoEmail);
    setIsLoading(false);
    if (role === 'FOUNDER_ADMIN') navigate('/admin');
    else if (role === 'TEACHER') navigate('/teacher');
    else navigate('/student');
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    try {
      const res = await apiFetch<{ message: string }>('/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email: forgotEmail }),
      });
      setForgotMsg(res.message);
    } catch (err: any) {
      setForgotMsg(err.message || 'Error requesting reset.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 font-bold text-2xl shadow-md">
          🦚
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Sign In to Morni Creative Lab
        </h1>
        <p className="text-xs text-slate-500">
          Access your personalized student portal, teacher dashboard, or administrative panel.
        </p>
      </div>

      {/* Main Login Card */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@school.edu.in"
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">Password</label>
              <button
                type="button"
                onClick={() => setForgotPasswordOpen(true)}
                className="text-[11px] font-semibold text-amber-700 hover:text-amber-800"
              >
                Forgot?
              </button>
            </div>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{isLoading ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        {/* 1-Click Role Switcher Demo Buttons for Reviewer */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
            One-Click Reviewer Test Access
          </div>

          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@mornicreativelab.com', 'FOUNDER_ADMIN')}
              className="w-full p-2 bg-purple-50 hover:bg-purple-100 text-purple-900 rounded-xl border border-purple-200 text-xs font-semibold flex items-center justify-between transition"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-600" />
                <span>Founder / Admin (Arpit Ghorpade)</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-purple-600" />
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('teacher.sunita@mornicreativelab.com', 'TEACHER')}
              className="w-full p-2 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded-xl border border-blue-200 text-xs font-semibold flex items-center justify-between transition"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span>Teacher Mentor (Sunita Rao)</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('aarav@student.mornicreativelab.com', 'STUDENT')}
              className="w-full p-2 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl border border-amber-200 text-xs font-semibold flex items-center justify-between transition"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-600" />
                <span>Student Learner (Aarav Sharma)</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotPasswordOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-slate-200">
            <h3 className="font-bold text-base text-slate-900">Reset Your Password</h3>
            <p className="text-xs text-slate-600">
              Enter your registered email address and we'll dispatch a secure recovery token.
            </p>

            {forgotMsg ? (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200">
                {forgotMsg}
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-3">
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  placeholder="name@school.edu.in"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition"
                >
                  Send Reset Link
                </button>
              </form>
            )}

            <button
              onClick={() => {
                setForgotPasswordOpen(false);
                setForgotMsg(null);
              }}
              className="w-full py-1.5 text-slate-500 hover:text-slate-800 text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
