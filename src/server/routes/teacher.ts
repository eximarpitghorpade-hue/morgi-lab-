import { Router } from 'express';
import { db } from '../../db/database.ts';
import { requireAuth, requireRole, type AuthenticatedRequest } from '../auth.ts';

const router = Router();

// Guard: Only Teacher or Founder Admin
router.use(requireAuth);
router.use(requireRole('TEACHER', 'FOUNDER_ADMIN'));

// Teacher Dashboard Overview
router.get('/dashboard', (req: AuthenticatedRequest, res) => {
  const teacherId = req.user!.id;
  const isFounder = req.user!.role === 'FOUNDER_ADMIN';
  const data = db.getData();

  // Submissions assigned to this teacher or all if founder
  const submissions = data.submissions.filter(
    s => isFounder || !s.teacherId || s.teacherId === teacherId
  );

  const pendingReviews = submissions.filter(
    s => s.status === 'under_review' || s.status === 'draft'
  );

  const students = data.users.filter(u => u.role === 'STUDENT');
  const liveClasses = data.liveClasses.filter(
    c => isFounder || c.teacherId === teacherId
  );

  res.json({
    teacher: req.user,
    metrics: {
      assignedStudentsCount: students.length,
      pendingReviewsCount: pendingReviews.length,
      totalReviewsCompleted: submissions.filter(s => s.status === 'approved').length,
      upcomingClassesCount: liveClasses.filter(c => c.status === 'upcoming').length,
    },
    pendingReviews: pendingReviews.slice(0, 5),
    upcomingClasses: liveClasses.slice(0, 3),
  });
});

// Assigned Students List
router.get('/students', (req: AuthenticatedRequest, res) => {
  const data = db.getData();
  const students = data.users.filter(u => u.role === 'STUDENT');

  const enriched = students.map(student => {
    const enrollments = data.enrollments.filter(e => e.studentId === student.id);
    const totalXp = db.getStudentTotalXp(student.id);
    const streak = data.streaks[student.id]?.currentStreak || 1;
    const certs = data.certificates.filter(c => c.studentId === student.id);
    const submissions = data.submissions.filter(s => s.studentId === student.id);

    return {
      ...student,
      totalXp,
      streak,
      enrollmentsCount: enrollments.length,
      activeProgramTitle: enrollments[0]
        ? data.programs.find(p => p.id === enrollments[0].programId)?.title
        : 'Not enrolled',
      progressPercent: enrollments[0]?.progressPercent || 0,
      certificatesCount: certs.length,
      submissionsCount: submissions.length,
    };
  });

  res.json({ students: enriched });
});

// All Submissions to Review
router.get('/submissions', (req: AuthenticatedRequest, res) => {
  const teacherId = req.user!.id;
  const isFounder = req.user!.role === 'FOUNDER_ADMIN';
  const { status, programId } = req.query;

  let submissions = db.getData().submissions.filter(
    s => isFounder || !s.teacherId || s.teacherId === teacherId
  );

  if (status && typeof status === 'string') {
    submissions = submissions.filter(s => s.status === status);
  }
  if (programId && typeof programId === 'string') {
    submissions = submissions.filter(s => s.programId === programId);
  }

  res.json({ submissions });
});

// Review Submission (Grade, Feedback, Revision or Approval)
router.post('/submissions/:id/review', (req: AuthenticatedRequest, res) => {
  const teacher = req.user!;
  const { id } = req.params;
  const { status, score, feedback, teacherNotes } = req.body;

  if (!status || !feedback) {
    return res.status(400).json({ error: 'Status and feedback are required.' });
  }

  const validStatuses = ['approved', 'revision_requested', 'rejected', 'under_review'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
  }

  const data = db.getData();
  const sub = data.submissions.find(s => s.id === id);
  if (!sub) {
    return res.status(404).json({ error: 'Submission not found' });
  }

  sub.status = status;
  sub.score = score !== undefined ? Number(score) : sub.score;
  sub.feedback = feedback.trim();
  sub.teacherNotes = teacherNotes ? teacherNotes.trim() : undefined;
  sub.teacherId = teacher.id;
  sub.reviewedAt = new Date().toISOString();

  // If approved, award XP to student server-side
  if (status === 'approved') {
    const xpReward = Math.round((sub.score || 80) * 2.5);
    db.awardXp(
      sub.studentId,
      xpReward,
      'assignment_approved',
      sub.id,
      `Project Approved: ${sub.projectTitle} (Score ${sub.score}/${sub.maxScore})`
    );

    // Notify student
    db.createNotification({
      userId: sub.studentId,
      title: 'Project Approved! 🎉',
      message: `${teacher.name} approved your project "${sub.title}" with score ${sub.score}/${sub.maxScore}.`,
      type: 'review',
      linkUrl: '/student/projects',
    });
  } else if (status === 'revision_requested') {
    db.createNotification({
      userId: sub.studentId,
      title: 'Revision Requested on Project',
      message: `${teacher.name} requested changes on "${sub.title}". Check feedback and resubmit.`,
      type: 'review',
      linkUrl: '/student/projects',
    });
  }

  db.logAudit({
    userId: teacher.id,
    userRole: teacher.role,
    userName: teacher.name,
    action: 'SUBMISSION_REVIEWED',
    entityType: 'Submission',
    entityId: sub.id,
    details: `${teacher.name} set status ${status} with score ${sub.score} for ${sub.studentName}`,
  });

  db.save();
  res.json({ success: true, submission: sub });
});

// Live Classes
router.get('/live-classes', (req: AuthenticatedRequest, res) => {
  const teacherId = req.user!.id;
  const isFounder = req.user!.role === 'FOUNDER_ADMIN';
  const liveClasses = db.getData().liveClasses.filter(
    c => isFounder || c.teacherId === teacherId
  );
  res.json({ liveClasses });
});

// Create Live Class
router.post('/live-classes', (req: AuthenticatedRequest, res) => {
  const teacher = req.user!;
  const { title, programId, date, startTime, endTime, meetingLink, description, schoolId } = req.body;

  if (!title || !programId || !date || !startTime || !endTime || !meetingLink) {
    return res.status(400).json({ error: 'All fields are required to schedule a live class.' });
  }

  const data = db.getData();
  const program = data.programs.find(p => p.id === programId);
  if (!program) return res.status(404).json({ error: 'Program not found' });

  const liveClass = {
    id: `live_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    title: title.trim(),
    programId,
    programTitle: program.title,
    teacherId: teacher.id,
    teacherName: teacher.name,
    schoolId: schoolId || teacher.schoolId,
    date,
    startTime,
    endTime,
    meetingLink: meetingLink.trim(),
    description: description ? description.trim() : '',
    status: 'upcoming' as const,
    enrolledStudentsCount: data.enrollments.filter(e => e.programId === programId).length,
  };

  data.liveClasses.push(liveClass);

  // Notify students enrolled in this program
  const studentIds = data.enrollments
    .filter(e => e.programId === programId)
    .map(e => e.studentId);

  studentIds.forEach(stId => {
    db.createNotification({
      userId: stId,
      title: `Live Class Scheduled: ${title}`,
      message: `Join ${teacher.name} on ${date} at ${startTime}.`,
      type: 'live_class',
      linkUrl: '/student/live-classes',
    });
  });

  db.logAudit({
    userId: teacher.id,
    userRole: teacher.role,
    userName: teacher.name,
    action: 'LIVE_CLASS_CREATED',
    entityType: 'LiveClass',
    entityId: liveClass.id,
    details: `Live class "${title}" scheduled by ${teacher.name} on ${date}`,
  });

  db.save();
  res.json({ success: true, liveClass });
});

// Attendance Records for a Live Class
router.get('/live-classes/:id/attendance', (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const attendance = db.getData().attendance.filter(a => a.liveClassId === id);
  res.json({ attendance });
});

// Mark Attendance for a Live Class
router.post('/live-classes/:id/attendance', (req: AuthenticatedRequest, res) => {
  const teacher = req.user!;
  const { id } = req.params;
  const { records } = req.body; // Array of { studentId, studentName, status, remarks }

  if (!Array.isArray(records)) {
    return res.status(400).json({ error: 'Attendance records array is required' });
  }

  const data = db.getData();
  const liveClass = data.liveClasses.find(c => c.id === id);
  if (!liveClass) return res.status(404).json({ error: 'Live class not found' });

  records.forEach((rec: any) => {
    const existingIdx = data.attendance.findIndex(
      a => a.liveClassId === id && a.studentId === rec.studentId
    );

    const recordItem = {
      id: existingIdx !== -1 ? data.attendance[existingIdx].id : `att_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      liveClassId: id,
      studentId: rec.studentId,
      studentName: rec.studentName || 'Student',
      status: rec.status || 'present',
      remarks: rec.remarks ? rec.remarks.trim() : undefined,
      markedAt: new Date().toISOString(),
    };

    if (existingIdx !== -1) {
      data.attendance[existingIdx] = recordItem;
    } else {
      data.attendance.push(recordItem);
    }
  });

  liveClass.status = 'completed';

  db.logAudit({
    userId: teacher.id,
    userRole: teacher.role,
    userName: teacher.name,
    action: 'ATTENDANCE_MARKED',
    entityType: 'LiveClass',
    entityId: id,
    details: `Attendance marked for ${records.length} students by ${teacher.name}`,
  });

  db.save();
  res.json({ success: true, message: 'Attendance successfully recorded.' });
});

export default router;
