import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { Navbar } from './components/layout/Navbar.tsx';
import { Footer } from './components/layout/Footer.tsx';
import { PortalLayout } from './components/layout/PortalLayout.tsx';
import { MorniMitrModal } from './components/morni-mitr/MorniMitrModal.tsx';

// Public Pages
import { HomePage } from './pages/public/HomePage.tsx';
import { ProgramsPage } from './pages/public/ProgramsPage.tsx';
import { HowItWorksPage } from './pages/public/HowItWorksPage.tsx';
import { ForStudentsPage } from './pages/public/ForStudentsPage.tsx';
import { ForTeachersPage } from './pages/public/ForTeachersPage.tsx';
import { ForSchoolsPage } from './pages/public/ForSchoolsPage.tsx';
import { ResourcesPage } from './pages/public/ResourcesPage.tsx';
import { AboutPage } from './pages/public/AboutPage.tsx';
import { ContactPage } from './pages/public/ContactPage.tsx';
import { BookDemoPage } from './pages/public/BookDemoPage.tsx';
import { LoginPage } from './pages/public/LoginPage.tsx';
import { VerifyCertificatePage } from './pages/public/VerifyCertificatePage.tsx';
import { PrivacyPage } from './pages/public/PrivacyPage.tsx';
import { TermsPage } from './pages/public/TermsPage.tsx';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard.tsx';
import { StudentLearning } from './pages/student/StudentLearning.tsx';
import { StudentProjects } from './pages/student/StudentProjects.tsx';
import { StudentLiveClasses } from './pages/student/StudentLiveClasses.tsx';
import { StudentLeaderboard } from './pages/student/StudentLeaderboard.tsx';
import { StudentAchievements } from './pages/student/StudentAchievements.tsx';
import { StudentCertificates } from './pages/student/StudentCertificates.tsx';
import { StudentProfile } from './pages/student/StudentProfile.tsx';

// Teacher Pages
import { TeacherDashboard } from './pages/teacher/TeacherDashboard.tsx';
import { TeacherSubmissions } from './pages/teacher/TeacherSubmissions.tsx';
import { TeacherStudents } from './pages/teacher/TeacherStudents.tsx';
import { TeacherLiveClasses } from './pages/teacher/TeacherLiveClasses.tsx';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard.tsx';
import { AdminSchools } from './pages/admin/AdminSchools.tsx';
import { AdminUsers } from './pages/admin/AdminUsers.tsx';
import { AdminCurriculum } from './pages/admin/AdminCurriculum.tsx';
import { AdminCertificates } from './pages/admin/AdminCertificates.tsx';
import { AdminPayments } from './pages/admin/AdminPayments.tsx';
import { AdminLeads } from './pages/admin/AdminLeads.tsx';
import { AdminAiSettings } from './pages/admin/AdminAiSettings.tsx';
import { AdminAuditLogs } from './pages/admin/AdminAuditLogs.tsx';

function MainApp() {
  const { user, isLoading } = useAuth();
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname || '/');
  const [morniMitrOpen, setMorniMitrOpen] = useState(false);
  const [activePortalSection, setActivePortalSection] = useState('dashboard');

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 text-xs">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 font-bold text-2xl flex items-center justify-center mx-auto animate-bounce">
            🦚
          </div>
          <p className="font-semibold text-slate-700">Connecting to Morni Creative Lab...</p>
        </div>
      </div>
    );
  }

  // --- Route Handlers ---

  // Verification route: /verify-certificate/:code
  if (currentPath.startsWith('/verify-certificate')) {
    const parts = currentPath.split('/verify-certificate/');
    const certCode = parts[1] || 'MCL-2026-884192';
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar currentPath={currentPath} navigate={navigate} openMorniMitr={() => setMorniMitrOpen(true)} />
        <main className="flex-1">
          <VerifyCertificatePage initialCode={certCode} navigate={navigate} />
        </main>
        <Footer navigate={navigate} />
        <MorniMitrModal isOpen={morniMitrOpen} onClose={() => setMorniMitrOpen(false)} />
      </div>
    );
  }

  // Student Portal
  if (currentPath.startsWith('/student')) {
    if (!user) {
      return (
        <div className="min-h-screen flex flex-col bg-slate-50">
          <Navbar currentPath="/login" navigate={navigate} />
          <main className="flex-1">
            <LoginPage navigate={navigate} />
          </main>
          <Footer navigate={navigate} />
        </div>
      );
    }

    return (
      <PortalLayout
        currentSection={activePortalSection}
        onNavigateSection={setActivePortalSection}
        openMorniMitr={() => setMorniMitrOpen(true)}
      >
        {activePortalSection === 'dashboard' && (
          <StudentDashboard
            onNavigateSection={setActivePortalSection}
            openMorniMitr={() => setMorniMitrOpen(true)}
          />
        )}
        {activePortalSection === 'learning' && (
          <StudentLearning openMorniMitr={() => setMorniMitrOpen(true)} />
        )}
        {activePortalSection === 'projects' && (
          <StudentProjects openMorniMitr={() => setMorniMitrOpen(true)} />
        )}
        {activePortalSection === 'live-classes' && <StudentLiveClasses />}
        {activePortalSection === 'gamification' && <StudentLeaderboard />}
        {activePortalSection === 'achievements' && <StudentAchievements />}
        {activePortalSection === 'certificates' && <StudentCertificates />}
        {activePortalSection === 'profile' && <StudentProfile />}
        {activePortalSection === 'notifications' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Notifications</h2>
            <p className="text-xs text-slate-500">Live notifications are active and synchronized with your mentor reviews.</p>
          </div>
        )}
        <MorniMitrModal isOpen={morniMitrOpen} onClose={() => setMorniMitrOpen(false)} />
      </PortalLayout>
    );
  }

  // Teacher Dashboard
  if (currentPath.startsWith('/teacher')) {
    if (!user || (user.role !== 'TEACHER' && user.role !== 'FOUNDER_ADMIN')) {
      return (
        <div className="min-h-screen flex flex-col bg-slate-50">
          <Navbar currentPath="/login" navigate={navigate} />
          <main className="flex-1">
            <LoginPage navigate={navigate} />
          </main>
          <Footer navigate={navigate} />
        </div>
      );
    }

    return (
      <PortalLayout
        currentSection={activePortalSection}
        onNavigateSection={setActivePortalSection}
        openMorniMitr={() => setMorniMitrOpen(true)}
      >
        {activePortalSection === 'dashboard' && (
          <TeacherDashboard onNavigateSection={setActivePortalSection} />
        )}
        {activePortalSection === 'submissions' && <TeacherSubmissions />}
        {activePortalSection === 'students' && <TeacherStudents />}
        {activePortalSection === 'live-classes' && <TeacherLiveClasses />}
        <MorniMitrModal isOpen={morniMitrOpen} onClose={() => setMorniMitrOpen(false)} />
      </PortalLayout>
    );
  }

  // Founder/Admin Panel
  if (currentPath.startsWith('/admin')) {
    if (!user || user.role !== 'FOUNDER_ADMIN') {
      return (
        <div className="min-h-screen flex flex-col bg-slate-50">
          <Navbar currentPath="/login" navigate={navigate} />
          <main className="flex-1">
            <LoginPage navigate={navigate} />
          </main>
          <Footer navigate={navigate} />
        </div>
      );
    }

    return (
      <PortalLayout
        currentSection={activePortalSection}
        onNavigateSection={setActivePortalSection}
        openMorniMitr={() => setMorniMitrOpen(true)}
      >
        {activePortalSection === 'dashboard' && (
          <AdminDashboard onNavigateSection={setActivePortalSection} />
        )}
        {activePortalSection === 'schools' && <AdminSchools />}
        {activePortalSection === 'users' && <AdminUsers />}
        {activePortalSection === 'curriculum' && <AdminCurriculum />}
        {activePortalSection === 'submissions' && <TeacherSubmissions />}
        {activePortalSection === 'live-classes' && <TeacherLiveClasses />}
        {activePortalSection === 'certificates' && <AdminCertificates />}
        {activePortalSection === 'payments' && <AdminPayments />}
        {activePortalSection === 'leads' && <AdminLeads />}
        {activePortalSection === 'ai-settings' && <AdminAiSettings />}
        {activePortalSection === 'audit-logs' && <AdminAuditLogs />}
        <MorniMitrModal isOpen={morniMitrOpen} onClose={() => setMorniMitrOpen(false)} />
      </PortalLayout>
    );
  }

  // Public Routes
  let content = <HomePage navigate={navigate} openMorniMitr={() => setMorniMitrOpen(true)} />;
  if (currentPath === '/programs') content = <ProgramsPage navigate={navigate} />;
  else if (currentPath === '/how-it-works') content = <HowItWorksPage navigate={navigate} />;
  else if (currentPath === '/for-students') content = <ForStudentsPage navigate={navigate} />;
  else if (currentPath === '/for-teachers') content = <ForTeachersPage navigate={navigate} />;
  else if (currentPath === '/for-schools') content = <ForSchoolsPage navigate={navigate} />;
  else if (currentPath === '/resources') content = <ResourcesPage navigate={navigate} openMorniMitr={() => setMorniMitrOpen(true)} />;
  else if (currentPath === '/about') content = <AboutPage navigate={navigate} />;
  else if (currentPath === '/contact') content = <ContactPage navigate={navigate} />;
  else if (currentPath === '/book-demo') content = <BookDemoPage navigate={navigate} />;
  else if (currentPath === '/login') content = <LoginPage navigate={navigate} />;
  else if (currentPath === '/privacy') content = <PrivacyPage />;
  else if (currentPath === '/terms') content = <TermsPage />;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar currentPath={currentPath} navigate={navigate} openMorniMitr={() => setMorniMitrOpen(true)} />
      <main className="flex-1">
        {content}
      </main>
      <Footer navigate={navigate} />

      {/* Floating Morni Mitr AI launcher button */}
      <button
        onClick={() => setMorniMitrOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white p-3.5 rounded-full shadow-2xl flex items-center gap-2 group transition-all duration-200 border-2 border-white/60 focus:outline-none"
        title="Open Morni Mitr AI Mentor"
      >
        <span className="text-xl group-hover:scale-110 transition-transform">🦚</span>
        <span className="font-bold text-xs pr-1 hidden sm:inline-block">Morni Mitr AI</span>
      </button>

      <MorniMitrModal isOpen={morniMitrOpen} onClose={() => setMorniMitrOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
