import { Router } from 'express';
import { db } from '../../db/database.ts';
import { requireAuth, requireRole, type AuthenticatedRequest } from '../auth.ts';
import type { Submission, SubmissionStatus } from '../../types/index.ts';

const router = Router();

// Student only guard
router.use(requireAuth);
router.use(requireRole('STUDENT', 'FOUNDER_ADMIN'));

// Student Dashboard Summary
router.get('/dashboard', (req: AuthenticatedRequest, res) => {
  const studentId = req.user!.id;
  const data = db.getData();

  const enrollments = data.enrollments.filter(e => e.studentId === studentId);
  const activeEnrollment = enrollments.find(e => e.status === 'active') || enrollments[0];
  const program = activeEnrollment
    ? data.programs.find(p => p.id === activeEnrollment.programId)
    : null;

  const currentSkill = activeEnrollment?.currentSkillId
    ? data.skills.find(s => s.id === activeEnrollment.currentSkillId)
    : null;
  const currentLevel = activeEnrollment?.currentLevelId
    ? data.levels.find(l => l.id === activeEnrollment.currentLevelId)
    : null;
  const currentLesson = activeEnrollment?.currentLessonId
    ? data.lessons.find(ls => ls.id === activeEnrollment.currentLessonId)
    : null;

  const totalXp = db.getStudentTotalXp(studentId);
  const streak = data.streaks[studentId] || { currentStreak: 1, longestStreak: 1, totalDaysActive: 1 };
  
  // Pending projects/assignments
  const studentSubmissions = data.submissions.filter(s => s.studentId === studentId);
  const submittedProjectIds = studentSubmissions.map(s => s.projectId);
  const pendingProjects = data.projects.filter(p => !submittedProjectIds.includes(p.id));

  // Recent teacher feedback
  const reviewedSubmissions = studentSubmissions
    .filter(s => s.reviewedAt && s.feedback)
    .sort((a, b) => new Date(b.reviewedAt!).getTime() - new Date(a.reviewedAt!).getTime())
    .slice(0, 3);

  // Upcoming Live Classes
  const upcomingClasses = data.liveClasses
    .filter(c => c.status === 'upcoming' || c.status === 'live')
    .slice(0, 3);

  // Student certificates
  const certificates = data.certificates.filter(c => c.studentId === studentId);

  // Unread notifications count
  const unreadNotifications = data.notifications.filter(n => n.userId === studentId && !n.read).length;

  res.json({
    student: req.user,
    activeEnrollment,
    program,
    currentSkill,
    currentLevel,
    currentLesson,
    totalXp,
    streak,
    pendingProjectsCount: pendingProjects.length,
    pendingProjects,
    recentFeedback: reviewedSubmissions,
    upcomingClasses,
    certificates,
    unreadNotifications,
  });
});

// Student Enrollments
router.get('/enrollments', (req: AuthenticatedRequest, res) => {
  const studentId = req.user!.id;
  const data = db.getData();
  const enrollments = data.enrollments.filter(e => e.studentId === studentId);
  const enriched = enrollments.map(e => ({
    ...e,
    program: data.programs.find(p => p.id === e.programId),
  }));
  res.json({ enrollments: enriched });
});

// Enroll in a program
router.post('/enroll', (req: AuthenticatedRequest, res) => {
  const studentId = req.user!.id;
  const { programId } = req.body;
  if (!programId) return res.status(400).json({ error: 'Program ID is required' });

  try {
    const enrollment = db.enrollStudent(studentId, programId);
    res.json({ success: true, enrollment });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to enroll' });
  }
});

// Program Curriculum with Sequential Unlocking
router.get('/programs/:programId/curriculum', (req: AuthenticatedRequest, res) => {
  const studentId = req.user!.id;
  const { programId } = req.params;
  const data = db.getData();

  const program = data.programs.find(p => p.id === programId);
  if (!program) return res.status(404).json({ error: 'Program not found' });

  const skills = data.skills
    .filter(s => s.programId === programId)
    .sort((a, b) => a.order - b.order);

  const studentProgress = data.progress.filter(
    p => p.studentId === studentId && p.programId === programId
  );
  const completedLessonIds = new Set(studentProgress.filter(p => p.completed).map(p => p.lessonId));

  // Determine unlocked state sequentially
  let previousLessonCompleted = true; // First lesson is unlocked

  const curriculum = skills.map(skill => {
    const levels = data.levels
      .filter(l => l.skillId === skill.id)
      .sort((a, b) => a.levelNumber - b.levelNumber);

    const enrichedLevels = levels.map(level => {
      const lessons = data.lessons
        .filter(ls => ls.levelId === level.id)
        .sort((a, b) => a.order - b.order);

      const enrichedLessons = lessons.map(lesson => {
        const isCompleted = completedLessonIds.has(lesson.id);
        const isUnlocked = previousLessonCompleted;
        // The next lesson requires this one to be completed
        previousLessonCompleted = isCompleted;

        const progressRecord = studentProgress.find(p => p.lessonId === lesson.id);

        return {
          ...lesson,
          isCompleted,
          isUnlocked,
          score: progressRecord?.score,
          completedAt: progressRecord?.completedAt,
        };
      });

      return {
        ...level,
        lessons: enrichedLessons,
        isCompleted: enrichedLessons.every(l => l.isCompleted),
      };
    });

    return {
      ...skill,
      levels: enrichedLevels,
    };
  });

  const enrollment = data.enrollments.find(e => e.studentId === studentId && e.programId === programId);

  res.json({
    program,
    enrollment,
    curriculum,
  });
});

// Complete Lesson (with quiz evaluation and server-side XP award)
router.post('/lessons/:lessonId/complete', (req: AuthenticatedRequest, res) => {
  const studentId = req.user!.id;
  const { lessonId } = req.params;
  const { quizAnswers, timeSpentMinutes } = req.body;

  const data = db.getData();
  const lesson = data.lessons.find(l => l.id === lessonId);
  if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

  let score: number | undefined = undefined;

  // If Quiz, evaluate server-side
  if (lesson.type === 'quiz' && lesson.quizQuestions && lesson.quizQuestions.length > 0) {
    if (!quizAnswers || typeof quizAnswers !== 'object') {
      return res.status(400).json({ error: 'Quiz answers are required.' });
    }

    let correctCount = 0;
    lesson.quizQuestions.forEach(q => {
      const selectedOptionId = quizAnswers[q.id];
      const correctOption = q.options.find(o => o.isCorrect);
      if (correctOption && correctOption.id === selectedOptionId) {
        correctCount += 1;
      }
    });

    score = Math.round((correctCount / lesson.quizQuestions.length) * 100);
    if (score < 50) {
      return res.status(400).json({
        error: `Quiz score was ${score}%. You need at least 50% to pass and unlock the next lesson. Review the notes and try again!`,
        score,
      });
    }
  }

  try {
    const result = db.completeLesson(studentId, lessonId, score, timeSpentMinutes || 15);
    res.json({
      success: true,
      message: `Lesson "${lesson.title}" completed!`,
      ...result,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to complete lesson' });
  }
});

// Projects & Submissions
router.get('/projects', (req: AuthenticatedRequest, res) => {
  const studentId = req.user!.id;
  const data = db.getData();

  const enrollments = data.enrollments.filter(e => e.studentId === studentId);
  const programIds = enrollments.map(e => e.programId);

  const projects = data.projects.filter(p => programIds.includes(p.programId));
  const submissions = data.submissions.filter(s => s.studentId === studentId);

  res.json({ projects, submissions });
});

// Submit / Draft Project
router.post('/projects/:projectId/submit', (req: AuthenticatedRequest, res) => {
  const studentId = req.user!.id;
  const { projectId } = req.params;
  const { title, description, attachments, isDraft } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }

  const data = db.getData();
  const project = data.projects.find(p => p.id === projectId);
  if (!project) return res.status(404).json({ error: 'Project not found' });

  // Validate attachments
  const validatedAttachments = (attachments || []).map((att: any, idx: number) => ({
    id: att.id || `att_${Date.now()}_${idx}`,
    fileName: String(att.fileName || 'attachment.pdf').slice(0, 100),
    fileSize: Number(att.fileSize || 102400),
    fileType: String(att.fileType || 'application/pdf'),
    url: String(att.url || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800'),
  }));

  const existingIdx = data.submissions.findIndex(
    s => s.projectId === projectId && s.studentId === studentId
  );

  const status: SubmissionStatus = isDraft ? 'draft' : 'under_review';

  let submission: Submission;
  if (existingIdx !== -1) {
    // Resubmit / update draft
    const prev = data.submissions[existingIdx];
    submission = {
      ...prev,
      title,
      description,
      attachments: validatedAttachments,
      status: (isDraft ? 'draft' : 'under_review') as SubmissionStatus,
      version: isDraft ? prev.version : prev.version + 1,
      submittedAt: new Date().toISOString(),
    };
    data.submissions[existingIdx] = submission;
  } else {
    submission = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      projectId: project.id,
      projectTitle: project.title,
      lessonId: project.lessonId,
      programId: project.programId,
      studentId,
      studentName: req.user!.name,
      studentEmail: req.user!.email,
      teacherId: 'usr_teacher_1', // Assigned lead mentor
      status,
      title,
      description,
      attachments: validatedAttachments,
      maxScore: project.maxScore,
      submittedAt: new Date().toISOString(),
      version: 1,
    };
    data.submissions.push(submission);
  }

  if (!isDraft) {
    // Notify teacher
    db.createNotification({
      userId: 'usr_teacher_1',
      title: 'New Student Submission to Review',
      message: `${req.user!.name} submitted "${title}" for review.`,
      type: 'review',
      linkUrl: `/teacher/submissions`,
    });
    // Audit log
    db.logAudit({
      userId: studentId,
      userRole: 'STUDENT',
      userName: req.user!.name,
      action: 'PROJECT_SUBMITTED',
      entityType: 'Submission',
      entityId: submission.id,
      details: `Project "${project.title}" submitted by ${req.user!.name}`,
    });
  }

  db.save();
  res.json({ success: true, submission });
});

// Gamification: XP History, Badges, Streaks, Leaderboard
router.get('/gamification', (req: AuthenticatedRequest, res) => {
  const studentId = req.user!.id;
  const data = db.getData();

  const totalXp = db.getStudentTotalXp(studentId);
  const streak = data.streaks[studentId] || { currentStreak: 1, longestStreak: 1, totalDaysActive: 1 };
  const transactions = data.xpTransactions
    .filter(tx => tx.studentId === studentId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const unlockedBadgeIds = new Set(
    data.userBadges.filter(ub => ub.userId === studentId).map(ub => ub.badgeId)
  );

  const badges = data.badges.map(b => ({
    ...b,
    unlocked: unlockedBadgeIds.has(b.id),
  }));

  // Leaderboard of students
  const studentUsers = data.users.filter(u => u.role === 'STUDENT');
  const leaderboard = studentUsers.map(st => {
    const xp = db.getStudentTotalXp(st.id);
    const stStreak = data.streaks[st.id]?.currentStreak || 1;
    return {
      id: st.id,
      name: st.name,
      avatarUrl: st.avatarUrl,
      schoolName: st.schoolName || 'Creative Lab',
      totalXp: xp,
      currentStreak: stStreak,
    };
  }).sort((a, b) => b.totalXp - a.totalXp);

  res.json({
    totalXp,
    streak,
    transactions,
    badges,
    leaderboard,
  });
});

// Student Certificates
router.get('/certificates', (req: AuthenticatedRequest, res) => {
  const studentId = req.user!.id;
  const certificates = db.getData().certificates.filter(c => c.studentId === studentId);
  res.json({ certificates });
});

// Live Classes
router.get('/live-classes', (req: AuthenticatedRequest, res) => {
  const liveClasses = db.getData().liveClasses.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  res.json({ liveClasses });
});

// Notifications
router.get('/notifications', (req: AuthenticatedRequest, res) => {
  const studentId = req.user!.id;
  const notifications = db.getData().notifications.filter(n => n.userId === studentId);
  res.json({ notifications });
});

// Mark Notification as read
router.post('/notifications/:id/read', (req: AuthenticatedRequest, res) => {
  const studentId = req.user!.id;
  const { id } = req.params;
  const notif = db.getData().notifications.find(n => n.id === id && n.userId === studentId);
  if (notif) {
    notif.read = true;
    db.save();
  }
  res.json({ success: true });
});

export default router;
