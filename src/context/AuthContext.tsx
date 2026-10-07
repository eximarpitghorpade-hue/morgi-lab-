import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserRole } from '../types/index.ts';

interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  schoolName?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  demoUsers: DemoUser[];
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchUser: (email: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const FALLBACK_DEMO_USERS: DemoUser[] = [
  {
    id: 'u-student-1',
    name: 'Aarav Sharma',
    email: 'student@mornilab.edu',
    role: 'STUDENT',
    schoolName: 'Delhi Public School, R.K. Puram',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
  },
  {
    id: 'u-teacher-1',
    name: 'Pooja Kulkarni',
    email: 'teacher@mornilab.edu',
    role: 'TEACHER',
    schoolName: 'Kendriya Vidyalaya IIT Powai',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
  },
  {
    id: 'u-admin-1',
    name: 'Dr. Vikram Malhotra',
    email: 'admin@mornilab.edu',
    role: 'FOUNDER_ADMIN',
    schoolName: 'Morni Creative Lab HQ',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('mcl_token'));
  const [isLoading, setIsLoading] = useState(true);
  const [demoUsers, setDemoUsers] = useState<DemoUser[]>(FALLBACK_DEMO_USERS);

  // Fetch demo users for review switcher
  useEffect(() => {
    fetch('/api/auth/demo-users')
      .then(res => res.json())
      .then(data => {
        if (data.users && data.users.length > 0) setDemoUsers(data.users);
      })
      .catch(() => {
        // Retain FALLBACK_DEMO_USERS if static host (e.g. GitHub Pages)
      });
  }, []);

  // Check existing token on mount
  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    if (token.startsWith('gh-demo-token-')) {
      const email = token.replace('gh-demo-token-', '');
      const found = FALLBACK_DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase()) || FALLBACK_DEMO_USERS[0];
      setUser({
        ...found,
        xp: 1450,
        streakDays: 14,
        gradeLevel: 'Grade 9',
        completedLessonsCount: 18,
        badges: ['Fast Coder', 'Robotics Pioneer'],
        createdAt: new Date().toISOString(),
      } as any);
      setIsLoading(false);
      return;
    }

    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Session expired');
        return res.json();
      })
      .then(data => {
        setUser(data.user);
      })
      .catch(() => {
        // If static host or server offline, gracefully fallback rather than get stuck
        const savedUserStr = localStorage.getItem('mcl_user_cached');
        if (savedUserStr) {
          try {
            setUser(JSON.parse(savedUserStr));
          } catch {
            setToken(null);
            setUser(null);
            localStorage.removeItem('mcl_token');
          }
        } else {
          setToken(null);
          setUser(null);
          localStorage.removeItem('mcl_token');
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const data = await res.json();
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('mcl_token', data.token);
        localStorage.setItem('mcl_user_cached', JSON.stringify(data.user));
        return { success: true };
      }
      const data = await res.json().catch(() => ({}));
      // Check fallback user if static deployment
      const fallback = FALLBACK_DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (fallback) {
        const fakeToken = `gh-demo-token-${fallback.email}`;
        const mockUserObj: any = {
          ...fallback,
          xp: 1450,
          streakDays: 14,
          gradeLevel: 'Grade 9',
          completedLessonsCount: 18,
          badges: ['Fast Coder', 'Robotics Pioneer'],
          createdAt: new Date().toISOString(),
        };
        setToken(fakeToken);
        setUser(mockUserObj);
        localStorage.setItem('mcl_token', fakeToken);
        localStorage.setItem('mcl_user_cached', JSON.stringify(mockUserObj));
        return { success: true };
      }
      return { success: false, error: data.error || 'Login failed' };
    } catch {
      // Fallback for GitHub Pages without backend
      const fallback = FALLBACK_DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (fallback) {
        const fakeToken = `gh-demo-token-${fallback.email}`;
        const mockUserObj: any = {
          ...fallback,
          xp: 1450,
          streakDays: 14,
          gradeLevel: 'Grade 9',
          completedLessonsCount: 18,
          badges: ['Fast Coder', 'Robotics Pioneer'],
          createdAt: new Date().toISOString(),
        };
        setToken(fakeToken);
        setUser(mockUserObj);
        localStorage.setItem('mcl_token', fakeToken);
        localStorage.setItem('mcl_user_cached', JSON.stringify(mockUserObj));
        return { success: true };
      }
      return { success: false, error: 'Network error' };
    }
  };

  const switchUser = async (email: string) => {
    try {
      const res = await fetch('/api/auth/switch-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.token) {
          setToken(data.token);
          setUser(data.user);
          localStorage.setItem('mcl_token', data.token);
          localStorage.setItem('mcl_user_cached', JSON.stringify(data.user));
          return;
        }
      }
    } catch {
      // Fallback if backend server not running
    }
    const fallback = FALLBACK_DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (fallback) {
      const fakeToken = `gh-demo-token-${fallback.email}`;
      const mockUserObj: any = {
        ...fallback,
        xp: 1450,
        streakDays: 14,
        gradeLevel: 'Grade 9',
        completedLessonsCount: 18,
        badges: ['Fast Coder', 'Robotics Pioneer'],
        createdAt: new Date().toISOString(),
      };
      setToken(fakeToken);
      setUser(mockUserObj);
      localStorage.setItem('mcl_token', fakeToken);
      localStorage.setItem('mcl_user_cached', JSON.stringify(mockUserObj));
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('mcl_token');
    localStorage.removeItem('mcl_user_cached');
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (err) {
      console.error('Error refreshing user:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        demoUsers,
        login,
        logout,
        switchUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
