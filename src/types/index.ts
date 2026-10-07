export type UserRole = 'FOUNDER_ADMIN' | 'TEACHER' | 'STUDENT';

export type LessonType = 'video' | 'reading' | 'activity' | 'quiz' | 'assignment' | 'project';

export type SubmissionStatus = 'draft' | 'submitted' | 'under_review' | 'revision_requested' | 'approved' | 'rejected';

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  bio?: string;
  schoolId?: string;
  schoolName?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface School {
  id: string;
  name: string;
  code: string;
  city: string;
  state: string;
  contactEmail: string;
  contactPhone: string;
  studentCount: number;
  teacherCount: number;
  active: boolean;
  createdAt: string;
}

export interface Program {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: 'Design & Visual Arts' | 'Robotics & Coding' | 'Creative Writing' | 'Animation & 3D' | 'Digital Storytelling';
  thumbnailUrl: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationWeeks: number;
  skillsCount: number;
  totalXp: number;
  published: boolean;
  featured: boolean;
  createdAt: string;
}

export interface Skill {
  id: string;
  programId: string;
  title: string;
  description: string;
  order: number;
  levelsCount: number;
  iconName: string;
}

export interface Level {
  id: string;
  skillId: string;
  title: string;
  levelNumber: number;
  description: string;
  xpReward: number;
  requiredXp: number;
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: QuizOption[];
  explanation: string;
}

export interface Lesson {
  id: string;
  levelId: string;
  skillId: string;
  programId: string;
  title: string;
  order: number;
  type: LessonType;
  durationMinutes: number;
  xpAward: number;
  content: string; // Markdown or structured explanation
  videoUrl?: string;
  rubric?: string;
  quizQuestions?: QuizQuestion[];
  instructions?: string;
  starterCodeOrTemplate?: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  programId: string;
  progressPercent: number;
  currentSkillId?: string;
  currentLevelId?: string;
  currentLessonId?: string;
  status: 'active' | 'completed' | 'paused';
  enrolledAt: string;
  completedAt?: string;
}

export interface LessonProgress {
  id: string;
  studentId: string;
  lessonId: string;
  levelId: string;
  skillId: string;
  programId: string;
  completed: boolean;
  score?: number;
  timeSpentMinutes: number;
  completedAt?: string;
  xpAwarded: number;
}

export interface AssignmentProject {
  id: string;
  lessonId: string;
  programId: string;
  title: string;
  brief: string;
  requirements: string[];
  allowedFileTypes: string[];
  maxFileSizeMb: number;
  maxScore: number;
  dueDate?: string;
}

export interface SubmissionAttachment {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  url: string;
}

export interface Submission {
  id: string;
  projectId: string;
  projectTitle: string;
  lessonId: string;
  programId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  teacherId?: string;
  status: SubmissionStatus;
  title: string;
  description: string;
  attachments: SubmissionAttachment[];
  score?: number;
  maxScore: number;
  feedback?: string;
  teacherNotes?: string;
  revisionNotes?: string;
  submittedAt: string;
  reviewedAt?: string;
  version: number;
}

export interface XpTransaction {
  id: string;
  studentId: string;
  amount: number;
  source: 'lesson_completed' | 'assignment_approved' | 'quiz_passed' | 'streak_bonus' | 'badge_earned';
  referenceId: string;
  description: string;
  createdAt: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  category: 'Creativity' | 'Consistency' | 'Mastery' | 'Community';
  icon: string;
  xpRequired: number;
  unlockedAt?: string;
}

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  totalDaysActive: number;
}

export interface Certificate {
  id: string;
  verificationCode: string;
  studentId: string;
  studentName: string;
  programId: string;
  programTitle: string;
  issueDate: string;
  grade: string;
  finalScore: number;
  instructorName: string;
  founderSignature: string;
  qrCodeUrl?: string;
}

export interface LiveClass {
  id: string;
  title: string;
  programId: string;
  programTitle: string;
  teacherId: string;
  teacherName: string;
  schoolId?: string;
  date: string;
  startTime: string;
  endTime: string;
  meetingLink: string;
  description: string;
  status: 'upcoming' | 'live' | 'completed' | 'cancelled';
  enrolledStudentsCount: number;
}

export interface AttendanceRecord {
  id: string;
  liveClassId: string;
  studentId: string;
  studentName: string;
  status: AttendanceStatus;
  remarks?: string;
  markedAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'assignment' | 'review' | 'live_class' | 'badge' | 'certificate' | 'announcement' | 'payment';
  linkUrl?: string;
  read: boolean;
  createdAt: string;
}

export interface PaymentPlan {
  id: string;
  name: string;
  description: string;
  priceInr: number;
  billingInterval: 'monthly' | 'term' | 'annual';
  features: string[];
  popular?: boolean;
}

export interface PaymentRecord {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  planId: string;
  planName: string;
  amountInr: number;
  currency: string;
  razorpayPaymentId: string;
  razorpayOrderId: string;
  status: PaymentStatus;
  invoiceNumber: string;
  createdAt: string;
}

export interface MaterialResource {
  id: string;
  title: string;
  category: 'Template' | 'Guide' | 'Asset Pack' | 'Software Setup' | 'Checklist';
  programId?: string;
  fileType: string;
  fileSize: string;
  downloadUrl: string;
  description: string;
}

export interface Lead {
  id: string;
  type: 'book_demo' | 'contact' | 'school_partnership';
  name: string;
  email: string;
  phone: string;
  organization?: string;
  role?: string;
  studentCountEstimate?: number;
  message: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'closed';
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userRole: UserRole;
  userName: string;
  action: string;
  entityType: string;
  entityId: string;
  ipAddress?: string;
  details: string;
  createdAt: string;
}

export interface AiUsageLog {
  id: string;
  studentId: string;
  prompt: string;
  topic?: string;
  lessonId?: string;
  tokenCount: number;
  createdAt: string;
}

export interface AiConfig {
  enabled: boolean;
  model: string;
  systemPrompt: string;
  dailyStudentLimit: number;
  allowedModes: ('explain' | 'summarize' | 'hint' | 'practice')[];
}
