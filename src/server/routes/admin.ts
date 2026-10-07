import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../../db/database.ts';
import { requireAuth, requireRole, type AuthenticatedRequest } from '../auth.ts';

const router = Router();

// Guard: Only Founder Admin can access
router.use(requireAuth);
router.use(requireRole('FOUNDER_ADMIN'));

// Admin Dashboard Overview (Real Aggregations)
router.get('/overview', (req: AuthenticatedRequest, res) => {
  const data = db.getData();

  const totalStudents = data.users.filter(u => u.role === 'STUDENT').length;
  const totalTeachers = data.users.filter(u => u.role === 'TEACHER').length;
  const totalSchools = data.schools.filter(s => s.active).length;
  const totalPrograms = data.programs.length;
  const totalSubmissions = data.submissions.length;
  const approvedSubmissions = data.submissions.filter(s => s.status === 'approved').length;
  const totalCertificates = data.certificates.length;

  const totalRevenue = data.payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amountInr, 0);

  const avgProgress = data.enrollments.length > 0
    ? Math.round(data.enrollments.reduce((sum, e) => sum + e.progressPercent, 0) / data.enrollments.length)
    : 0;

  res.json({
    kpis: {
      totalStudents,
      totalTeachers,
      totalSchools,
      totalPrograms,
      totalSubmissions,
      approvedSubmissions,
      totalCertificates,
      totalRevenueInr: totalRevenue,
      averageProgressPercent: avgProgress,
      leadsCount: data.leads.filter(l => l.status === 'new').length,
    },
    recentAuditLogs: data.auditLogs.slice(0, 10),
    recentPayments: data.payments.slice(0, 5),
    recentLeads: data.leads.slice(0, 5),
  });
});

// Schools CRUD
router.get('/schools', (req, res) => {
  res.json({ schools: db.getData().schools });
});

router.post('/schools', (req: AuthenticatedRequest, res) => {
  const { name, code, city, state, contactEmail, contactPhone } = req.body;
  if (!name || !code || !city || !contactEmail) {
    return res.status(400).json({ error: 'Name, code, city, and contact email are required' });
  }

  const data = db.getData();
  if (data.schools.some(s => s.code === code)) {
    return res.status(400).json({ error: `School code "${code}" already exists.` });
  }

  const school = {
    id: `sch_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    name: name.trim(),
    code: code.trim().toUpperCase(),
    city: city.trim(),
    state: state ? state.trim() : 'India',
    contactEmail: contactEmail.trim().toLowerCase(),
    contactPhone: contactPhone ? contactPhone.trim() : '',
    studentCount: 0,
    teacherCount: 0,
    active: true,
    createdAt: new Date().toISOString(),
  };

  data.schools.push(school);
  db.logAudit({
    userId: req.user!.id,
    userRole: req.user!.role,
    userName: req.user!.name,
    action: 'SCHOOL_CREATED',
    entityType: 'School',
    entityId: school.id,
    details: `Created partner school ${school.name} (${school.code})`,
  });
  db.save();
  res.json({ success: true, school });
});

router.put('/schools/:id', (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const updates = req.body;
  const data = db.getData();
  const idx = data.schools.findIndex(s => s.id === id);
  if (idx === -1) return res.status(404).json({ error: 'School not found' });

  data.schools[idx] = { ...data.schools[idx], ...updates };
  db.save();
  res.json({ success: true, school: data.schools[idx] });
});

// Users CRUD
router.get('/users', (req, res) => {
  const { role, schoolId, search } = req.query;
  let users = db.getData().users;

  if (role && typeof role === 'string') {
    users = users.filter(u => u.role === role);
  }
  if (schoolId && typeof schoolId === 'string') {
    users = users.filter(u => u.schoolId === schoolId);
  }
  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    users = users.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }

  res.json({ users });
});

router.post('/users', async (req: AuthenticatedRequest, res) => {
  const { name, email, role, password, schoolId, phone, bio } = req.body;
  if (!name || !email || !role || !password) {
    return res.status(400).json({ error: 'Name, email, role, and password are required.' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const school = schoolId ? db.getData().schools.find(s => s.id === schoolId) : undefined;

    const user = {
      id: `usr_${role.toLowerCase()}_${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      bio: bio ? bio.trim() : '',
      schoolId,
      schoolName: school?.name,
      phone: phone ? phone.trim() : '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.createUser(user, hash);
    res.json({ success: true, user });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to create user' });
  }
});

// Programs & Curriculum Builder CRUD
router.get('/curriculum/all', (req, res) => {
  const data = db.getData();
  res.json({
    programs: data.programs,
    skills: data.skills,
    levels: data.levels,
    lessons: data.lessons,
    projects: data.projects,
  });
});

router.post('/programs', (req: AuthenticatedRequest, res) => {
  const { title, description, category, difficulty, durationWeeks } = req.body;
  if (!title || !description || !category) {
    return res.status(400).json({ error: 'Title, description, and category are required' });
  }

  const data = db.getData();
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const program = {
    id: `prg_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    title: title.trim(),
    slug,
    description: description.trim(),
    category,
    thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    difficulty: difficulty || 'Beginner',
    durationWeeks: Number(durationWeeks) || 8,
    skillsCount: 0,
    totalXp: 1000,
    published: true,
    featured: false,
    createdAt: new Date().toISOString(),
  };

  data.programs.push(program);
  db.logAudit({
    userId: req.user!.id,
    userRole: req.user!.role,
    userName: req.user!.name,
    action: 'PROGRAM_CREATED',
    entityType: 'Program',
    entityId: program.id,
    details: `Created new educational program "${program.title}"`,
  });
  db.save();
  res.json({ success: true, program });
});

// Leads Management
router.get('/leads', (req, res) => {
  res.json({ leads: db.getData().leads });
});

router.post('/leads/:id/status', (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const lead = db.getData().leads.find(l => l.id === id);
  if (!lead) return res.status(404).json({ error: 'Lead not found' });

  lead.status = status;
  db.logAudit({
    userId: req.user!.id,
    userRole: req.user!.role,
    userName: req.user!.name,
    action: 'LEAD_STATUS_UPDATED',
    entityType: 'Lead',
    entityId: id,
    details: `Lead ${lead.name} marked as ${status}`,
  });
  db.save();
  res.json({ success: true, lead });
});

// Audit Logs
router.get('/audit-logs', (req, res) => {
  const { action, entityType, limit } = req.query;
  let logs = db.getData().auditLogs;

  if (action && typeof action === 'string') {
    logs = logs.filter(l => l.action === action);
  }
  if (entityType && typeof entityType === 'string') {
    logs = logs.filter(l => l.entityType === entityType);
  }

  const max = limit ? Number(limit) : 100;
  res.json({ auditLogs: logs.slice(0, max) });
});

// AI Configuration & Settings
router.get('/ai/config', (req, res) => {
  res.json({
    config: db.getData().aiConfig,
    usageLogsCount: db.getData().aiUsageLogs.length,
    recentUsage: db.getData().aiUsageLogs.slice(0, 10),
  });
});

router.post('/ai/config', (req: AuthenticatedRequest, res) => {
  const { enabled, systemPrompt, dailyStudentLimit, allowedModes } = req.body;
  const data = db.getData();

  data.aiConfig = {
    ...data.aiConfig,
    enabled: enabled !== undefined ? Boolean(enabled) : data.aiConfig.enabled,
    systemPrompt: systemPrompt ? systemPrompt.trim() : data.aiConfig.systemPrompt,
    dailyStudentLimit: dailyStudentLimit ? Number(dailyStudentLimit) : data.aiConfig.dailyStudentLimit,
    allowedModes: allowedModes || data.aiConfig.allowedModes,
  };

  db.logAudit({
    userId: req.user!.id,
    userRole: req.user!.role,
    userName: req.user!.name,
    action: 'AI_CONFIG_UPDATED',
    entityType: 'AiConfig',
    entityId: 'global',
    details: `AI settings updated. Enabled=${data.aiConfig.enabled}`,
  });

  db.save();
  res.json({ success: true, config: data.aiConfig });
});

// Issue Custom Certificate Manually
router.post('/certificates/issue', (req: AuthenticatedRequest, res) => {
  const { studentId, programId } = req.body;
  if (!studentId || !programId) {
    return res.status(400).json({ error: 'Student ID and Program ID are required' });
  }

  const cert = db.maybeIssueCertificate(studentId, programId);
  if (!cert) {
    return res.status(400).json({ error: 'Could not issue certificate. Verify student and program exist.' });
  }
  res.json({ success: true, certificate: cert });
});

// Payments
router.get('/payments', (req, res) => {
  res.json({ payments: db.getData().payments });
});

export default router;
