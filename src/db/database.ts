import fs from 'fs';
import path from 'path';
import type {
  User, School, Program, Skill, Level, Lesson,
  Enrollment, LessonProgress, AssignmentProject, Submission,
  XpTransaction, Badge, StreakInfo, Certificate, LiveClass,
  AttendanceRecord, NotificationItem, PaymentPlan, PaymentRecord,
  MaterialResource, Lead, AuditLog, AiConfig, AiUsageLog
} from '../types/index.ts';

export interface DatabaseSchema {
  users: User[];
  passwords: Record<string, string>; // userId -> bcrypt hash
  schools: School[];
  programs: Program[];
  skills: Skill[];
  levels: Level[];
  lessons: Lesson[];
  enrollments: Enrollment[];
  progress: LessonProgress[];
  projects: AssignmentProject[];
  submissions: Submission[];
  xpTransactions: XpTransaction[];
  badges: Badge[];
  userBadges: { userId: string; badgeId: string; unlockedAt: string }[];
  streaks: Record<string, StreakInfo>; // userId -> streak
  certificates: Certificate[];
  liveClasses: LiveClass[];
  attendance: AttendanceRecord[];
  notifications: NotificationItem[];
  paymentPlans: PaymentPlan[];
  payments: PaymentRecord[];
  materials: MaterialResource[];
  leads: Lead[];
  auditLogs: AuditLog[];
  aiConfig: AiConfig;
  aiUsageLogs: AiUsageLog[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'morni-database.json');

class DatabaseEngine {
  private data: DatabaseSchema;
  private isInitialized = false;

  constructor() {
    this.data = this.getDefaultState();
  }

  private getDefaultState(): DatabaseSchema {
    return {
      users: [],
      passwords: {},
      schools: [],
      programs: [],
      skills: [],
      levels: [],
      lessons: [],
      enrollments: [],
      progress: [],
      projects: [],
      submissions: [],
      xpTransactions: [],
      badges: [],
      userBadges: [],
      streaks: {},
      certificates: [],
      liveClasses: [],
      attendance: [],
      notifications: [],
      paymentPlans: [],
      payments: [],
      materials: [],
      leads: [],
      auditLogs: [],
      aiConfig: {
        enabled: true,
        model: 'gemini-3.8-flash',
        systemPrompt: 'You are Morni Mitr, an encouraging, pedagogically sound AI learning mentor at Morni Creative Lab. Help students understand design, coding, storytelling, and robotics. Do NOT do their homework or write complete graded assignments for them. Guide them step-by-step with analogies, hints, and practice suggestions.',
        dailyStudentLimit: 30,
        allowedModes: ['explain', 'summarize', 'hint', 'practice'],
      },
      aiUsageLogs: [],
    };
  }

  public init(initialSeed?: DatabaseSchema) {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        this.isInitialized = true;
        return;
      } catch (err) {
        console.error('Failed to parse database file, falling back to seed:', err);
      }
    }

    if (initialSeed) {
      this.data = initialSeed;
      this.save();
    }
    this.isInitialized = true;
  }

  public save() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const tmpFile = `${DB_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tmpFile, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tmpFile, DB_FILE);
    } catch (err) {
      console.error('Failed to persist database to disk:', err);
    }
  }

  public getData(): DatabaseSchema {
    return this.data;
  }

  // --- Transactional Operations with Integrity Checks ---

  // User & Auth
  public getUserByEmail(email: string): User | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public getUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  public getPasswordHash(userId: string): string | undefined {
    return this.data.passwords[userId];
  }

  public setPasswordHash(userId: string, hash: string) {
    this.data.passwords[userId] = hash;
    this.save();
  }

  public createUser(user: User, passwordHash: string): User {
    const existing = this.getUserByEmail(user.email);
    if (existing) {
      throw new Error(`User with email "${user.email}" already exists`);
    }
    this.data.users.push(user);
    this.data.passwords[user.id] = passwordHash;
    this.data.streaks[user.id] = {
      currentStreak: 1,
      longestStreak: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      totalDaysActive: 1,
    };
    this.logAudit({
      userId: user.id,
      userRole: user.role,
      userName: user.name,
      action: 'USER_REGISTERED',
      entityType: 'User',
      entityId: user.id,
      details: `New ${user.role} account created for ${user.email}`,
    });
    this.save();
    return user;
  }

  public updateUser(id: string, updates: Partial<User>): User {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx === -1) throw new Error('User not found');
    this.data.users[idx] = {
      ...this.data.users[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.save();
    return this.data.users[idx];
  }

  // Enrollment with duplicate prevention
  public enrollStudent(studentId: string, programId: string): Enrollment {
    const existing = this.data.enrollments.find(
      e => e.studentId === studentId && e.programId === programId
    );
    if (existing) {
      return existing;
    }
    const program = this.data.programs.find(p => p.id === programId);
    if (!program) throw new Error('Program not found');

    const firstSkill = this.data.skills
      .filter(s => s.programId === programId)
      .sort((a, b) => a.order - b.order)[0];
    const firstLevel = firstSkill
      ? this.data.levels.find(l => l.skillId === firstSkill.id)
      : undefined;
    const firstLesson = firstLevel
      ? this.data.lessons
          .filter(l => l.levelId === firstLevel.id)
          .sort((a, b) => a.order - b.order)[0]
      : undefined;

    const enrollment: Enrollment = {
      id: `enr_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      studentId,
      programId,
      progressPercent: 0,
      currentSkillId: firstSkill?.id,
      currentLevelId: firstLevel?.id,
      currentLessonId: firstLesson?.id,
      status: 'active',
      enrolledAt: new Date().toISOString(),
    };

    this.data.enrollments.push(enrollment);
    this.createNotification({
      userId: studentId,
      title: 'Enrolled in Program',
      message: `Welcome to ${program.title}! Your creative journey has begun.`,
      type: 'announcement',
      linkUrl: `/student/learning?programId=${programId}`,
    });
    this.save();
    return enrollment;
  }

  // Server-Side Lesson Progress & Completion with XP Award
  public completeLesson(
    studentId: string,
    lessonId: string,
    score?: number,
    timeSpent = 15
  ): { progress: LessonProgress; xpAwarded: number; newTotalXp: number; programProgress: number } {
    const lesson = this.data.lessons.find(l => l.id === lessonId);
    if (!lesson) throw new Error('Lesson not found');

    let prog = this.data.progress.find(
      p => p.studentId === studentId && p.lessonId === lessonId
    );

    let xpToAward = 0;
    if (!prog || !prog.completed) {
      xpToAward = lesson.xpAward;
      if (prog) {
        prog.completed = true;
        prog.score = score;
        prog.timeSpentMinutes += timeSpent;
        prog.completedAt = new Date().toISOString();
        prog.xpAwarded = xpToAward;
      } else {
        prog = {
          id: `prog_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
          studentId,
          lessonId,
          levelId: lesson.levelId,
          skillId: lesson.skillId,
          programId: lesson.programId,
          completed: true,
          score,
          timeSpentMinutes: timeSpent,
          completedAt: new Date().toISOString(),
          xpAwarded: xpToAward,
        };
        this.data.progress.push(prog);
      }

      // Record XP transaction server-side (prevent duplicates via referenceId)
      this.awardXp(studentId, xpToAward, 'lesson_completed', lessonId, `Completed lesson: ${lesson.title}`);
      this.updateStreak(studentId);
    } else {
      prog.timeSpentMinutes += timeSpent;
      if (score !== undefined) prog.score = score;
    }

    // Recalculate enrollment progress % server-side
    const totalProgramLessons = this.data.lessons.filter(l => l.programId === lesson.programId).length;
    const completedProgramLessons = this.data.progress.filter(
      p => p.studentId === studentId && p.programId === lesson.programId && p.completed
    ).length;

    const percent = totalProgramLessons > 0 ? Math.round((completedProgramLessons / totalProgramLessons) * 100) : 0;
    const enrollment = this.data.enrollments.find(
      e => e.studentId === studentId && e.programId === lesson.programId
    );
    if (enrollment) {
      enrollment.progressPercent = percent;
      if (percent >= 100 && enrollment.status !== 'completed') {
        enrollment.status = 'completed';
        enrollment.completedAt = new Date().toISOString();
        // Check for certificate issuance
        this.maybeIssueCertificate(studentId, lesson.programId);
      }
    }

    this.save();

    return {
      progress: prog,
      xpAwarded: xpToAward,
      newTotalXp: this.getStudentTotalXp(studentId),
      programProgress: percent,
    };
  }

  // Gamification: XP & Anti-Duplicate Award
  public awardXp(
    studentId: string,
    amount: number,
    source: XpTransaction['source'],
    referenceId: string,
    description: string
  ): XpTransaction | null {
    // Unique constraint: prevent duplicate XP for the same reference
    const duplicate = this.data.xpTransactions.find(
      tx => tx.studentId === studentId && tx.source === source && tx.referenceId === referenceId
    );
    if (duplicate) {
      return null;
    }

    const tx: XpTransaction = {
      id: `xp_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      studentId,
      amount,
      source,
      referenceId,
      description,
      createdAt: new Date().toISOString(),
    };
    this.data.xpTransactions.push(tx);

    // Check badges
    const totalXp = this.getStudentTotalXp(studentId);
    this.checkAndAwardBadges(studentId, totalXp);

    this.save();
    return tx;
  }

  public getStudentTotalXp(studentId: string): number {
    return this.data.xpTransactions
      .filter(tx => tx.studentId === studentId)
      .reduce((sum, tx) => sum + tx.amount, 0);
  }

  public updateStreak(studentId: string) {
    const today = new Date().toISOString().split('T')[0];
    let streak = this.data.streaks[studentId];
    if (!streak) {
      streak = {
        currentStreak: 1,
        longestStreak: 1,
        lastActiveDate: today,
        totalDaysActive: 1,
      };
      this.data.streaks[studentId] = streak;
      return;
    }

    if (streak.lastActiveDate === today) {
      return; // already recorded today
    }

    const last = new Date(streak.lastActiveDate);
    const curr = new Date(today);
    const diffDays = Math.round((curr.getTime() - last.getTime()) / (1000 * 3600 * 24));

    if (diffDays === 1) {
      streak.currentStreak += 1;
      if (streak.currentStreak > streak.longestStreak) {
        streak.longestStreak = streak.currentStreak;
      }
    } else if (diffDays > 1) {
      streak.currentStreak = 1;
    }
    streak.lastActiveDate = today;
    streak.totalDaysActive += 1;
    this.save();
  }

  private checkAndAwardBadges(studentId: string, currentTotalXp: number) {
    for (const badge of this.data.badges) {
      if (currentTotalXp >= badge.xpRequired) {
        const hasBadge = this.data.userBadges.some(
          ub => ub.userId === studentId && ub.badgeId === badge.id
        );
        if (!hasBadge) {
          this.data.userBadges.push({
            userId: studentId,
            badgeId: badge.id,
            unlockedAt: new Date().toISOString(),
          });
          this.createNotification({
            userId: studentId,
            title: `Badge Unlocked: ${badge.title}!`,
            message: `Congratulations! You unlocked the "${badge.title}" badge (${badge.description}).`,
            type: 'badge',
            linkUrl: '/student/achievements',
          });
        }
      }
    }
  }

  // Certificate Issuance with Unique Verification Code
  public maybeIssueCertificate(studentId: string, programId: string): Certificate | null {
    const existing = this.data.certificates.find(
      c => c.studentId === studentId && c.programId === programId
    );
    if (existing) return existing;

    const student = this.getUserById(studentId);
    const program = this.data.programs.find(p => p.id === programId);
    if (!student || !program) return null;

    // Calculate score
    const progList = this.data.progress.filter(p => p.studentId === studentId && p.programId === programId);
    const totalScore = progList.reduce((acc, p) => acc + (p.score || 85), 0);
    const avgScore = progList.length > 0 ? Math.round(totalScore / progList.length) : 92;

    const code = `MCL-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const cert: Certificate = {
      id: `cert_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      verificationCode: code,
      studentId,
      studentName: student.name,
      programId,
      programTitle: program.title,
      issueDate: new Date().toISOString().split('T')[0],
      grade: avgScore >= 90 ? 'Exemplary (A+)' : avgScore >= 80 ? 'Distinction (A)' : 'Merit (B+)',
      finalScore: avgScore,
      instructorName: 'Prof. Sunita Rao, Creative Director',
      founderSignature: 'Arpit Ghorpade, Founder Morni Creative Lab',
    };

    this.data.certificates.push(cert);
    this.createNotification({
      userId: studentId,
      title: 'Certificate Issued!',
      message: `Congratulations! Your certificate of completion for "${program.title}" is ready. Verification Code: ${code}`,
      type: 'certificate',
      linkUrl: `/student/certificates`,
    });
    this.logAudit({
      userId: studentId,
      userRole: student.role,
      userName: student.name,
      action: 'CERTIFICATE_ISSUED',
      entityType: 'Certificate',
      entityId: cert.id,
      details: `Certificate code ${code} awarded for program ${program.title}`,
    });
    this.save();
    return cert;
  }

  // Audit Logs
  public logAudit(log: Omit<AuditLog, 'id' | 'createdAt'>) {
    const audit: AuditLog = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      createdAt: new Date().toISOString(),
      ...log,
    };
    this.data.auditLogs.unshift(audit);
    // Keep max 500 audit logs
    if (this.data.auditLogs.length > 500) {
      this.data.auditLogs.pop();
    }
  }

  // Notifications
  public createNotification(item: Omit<NotificationItem, 'id' | 'read' | 'createdAt'>): NotificationItem {
    const notif: NotificationItem = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      read: false,
      createdAt: new Date().toISOString(),
      ...item,
    };
    this.data.notifications.unshift(notif);
    return notif;
  }
}

export const db = new DatabaseEngine();
