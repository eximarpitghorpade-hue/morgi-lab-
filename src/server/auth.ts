import crypto from 'crypto';
import type { Request, Response, NextFunction } from 'express';
import { db } from '../db/database.ts';
import type { User, UserRole } from '../types/index.ts';

const SESSION_SECRET = process.env.SESSION_SECRET || 'morni_creative_lab_production_secret_key_2026';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

// Generate secure signed session token
export function createSessionToken(user: User): string {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    timestamp: Date.now(),
  };
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(data)
    .digest('base64url');
  return `${data}.${signature}`;
}

// Verify session token
export function verifySessionToken(token: string): User | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [data, signature] = parts;
    const expectedSig = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(data)
      .digest('base64url');

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf-8'));
    // Verify user exists in database
    const user = db.getUserById(payload.userId);
    if (!user) return null;
    return user;
  } catch (err) {
    return null;
  }
}

// Middleware: Authenticate Request
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
  const user = verifySessionToken(token);

  if (!user) {
    return res.status(401).json({ error: 'Invalid or expired session token.' });
  }

  req.user = user;
  next();
}

// Middleware: Require specific role or roles
export function requireRole(...allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      db.logAudit({
        userId: req.user.id,
        userRole: req.user.role,
        userName: req.user.name,
        action: 'UNAUTHORIZED_ACCESS_ATTEMPT',
        entityType: 'Endpoint',
        entityId: req.originalUrl,
        details: `Role ${req.user.role} attempted to access restricted endpoint requiring ${allowedRoles.join(', ')}`,
      });
      return res.status(403).json({
        error: `Forbidden: Access restricted to ${allowedRoles.join(' or ')}.`,
      });
    }

    next();
  };
}

// Middleware: Prevent IDOR (Student can only access their own resource or Admin/Teacher)
export function requireStudentOwnership(paramKey = 'studentId') {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const targetStudentId = req.params[paramKey] || req.body[paramKey] || req.query[paramKey];

    if (req.user.role === 'FOUNDER_ADMIN') {
      return next();
    }

    if (req.user.role === 'TEACHER') {
      // Teachers can view students
      return next();
    }

    if (req.user.role === 'STUDENT' && req.user.id !== targetStudentId) {
      db.logAudit({
        userId: req.user.id,
        userRole: req.user.role,
        userName: req.user.name,
        action: 'IDOR_VIOLATION_ATTEMPT',
        entityType: 'StudentData',
        entityId: String(targetStudentId),
        details: `Student ${req.user.id} attempted to view/modify data for student ${targetStudentId}`,
      });
      return res.status(403).json({ error: 'Access denied: You can only access your own learning data.' });
    }

    next();
  };
}
