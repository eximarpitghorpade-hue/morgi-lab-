import { Router } from 'express';
import { db } from '../../db/database.ts';

const router = Router();

// Public Programs List
router.get('/programs', (req, res) => {
  const programs = db.getData().programs.filter(p => p.published);
  res.json({ programs });
});

// Single Program Details
router.get('/programs/:id', (req, res) => {
  const { id } = req.params;
  const program = db.getData().programs.find(p => p.id === id || p.slug === id);
  if (!program) {
    return res.status(404).json({ error: 'Program not found' });
  }

  const skills = db.getData().skills.filter(s => s.programId === program.id).sort((a, b) => a.order - b.order);
  const skillIds = skills.map(s => s.id);
  const levels = db.getData().levels.filter(l => skillIds.includes(l.skillId));
  const levelIds = levels.map(l => l.id);
  const lessons = db.getData().lessons.filter(ls => levelIds.includes(ls.levelId));

  res.json({
    program,
    skills,
    levels,
    lessonsCount: lessons.length,
  });
});

// Real Aggregated Platform Statistics (No fake numbers)
router.get('/stats', (req, res) => {
  const data = db.getData();
  const totalStudents = data.users.filter(u => u.role === 'STUDENT').length;
  const totalTeachers = data.users.filter(u => u.role === 'TEACHER').length;
  const totalSchools = data.schools.filter(s => s.active).length;
  const totalPrograms = data.programs.filter(p => p.published).length;
  const totalSubmissions = data.submissions.length;
  const totalCertificates = data.certificates.length;

  res.json({
    stats: {
      studentsEnrolled: totalStudents,
      activeMentors: totalTeachers,
      partnerSchools: totalSchools,
      creativePrograms: totalPrograms,
      projectsReviewed: totalSubmissions,
      verifiedCertificates: totalCertificates,
    },
  });
});

// Verify Certificate by Code
router.get('/verify-certificate/:code', (req, res) => {
  const code = req.params.code.trim().toUpperCase();
  const cert = db.getData().certificates.find(
    c => c.verificationCode.toUpperCase() === code
  );

  if (!cert) {
    return res.status(404).json({
      valid: false,
      error: `Certificate with code "${code}" could not be verified in the Morni Creative Lab ledger.`,
    });
  }

  const student = db.getUserById(cert.studentId);
  const program = db.getData().programs.find(p => p.id === cert.programId);

  res.json({
    valid: true,
    certificate: {
      id: cert.id,
      verificationCode: cert.verificationCode,
      studentName: cert.studentName,
      programTitle: cert.programTitle,
      programCategory: program?.category,
      issueDate: cert.issueDate,
      grade: cert.grade,
      finalScore: cert.finalScore,
      instructorName: cert.instructorName,
      founderSignature: cert.founderSignature,
      schoolName: student?.schoolName,
    },
  });
});

// Submit Lead / Book Demo / Contact Inquiry
router.post('/leads', (req, res) => {
  const { type, name, email, phone, organization, role, studentCountEstimate, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required fields.' });
  }

  const newLead = {
    id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    type: type || 'contact',
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone ? phone.trim() : '',
    organization: organization ? organization.trim() : undefined,
    role: role ? role.trim() : undefined,
    studentCountEstimate: studentCountEstimate ? Number(studentCountEstimate) : undefined,
    message: message.trim(),
    status: 'new' as const,
    createdAt: new Date().toISOString(),
  };

  db.getData().leads.unshift(newLead);
  db.save();

  db.logAudit({
    userId: 'anonymous',
    userRole: 'STUDENT',
    userName: name,
    action: 'LEAD_SUBMITTED',
    entityType: 'Lead',
    entityId: newLead.id,
    details: `Inquiry (${newLead.type}) submitted by ${name} (${email})`,
  });

  res.json({
    success: true,
    message: 'Thank you! Our academic director will connect with you within 24 hours.',
    leadId: newLead.id,
  });
});

export default router;
