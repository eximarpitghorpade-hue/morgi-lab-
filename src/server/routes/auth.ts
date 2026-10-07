import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../../db/database.ts';
import { createSessionToken, requireAuth, type AuthenticatedRequest } from '../auth.ts';

const router = Router();

// Demo users list for seamless reviewer switching
router.get('/demo-users', (req, res) => {
  const users = db.getData().users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    avatarUrl: u.avatarUrl,
    schoolName: u.schoolName,
  }));
  res.json({ users });
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const hash = db.getPasswordHash(user.id);
    if (!hash) {
      return res.status(401).json({ error: 'Invalid authentication credentials.' });
    }

    const isMatch = await bcrypt.compare(password, hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = createSessionToken(user);
    db.logAudit({
      userId: user.id,
      userRole: user.role,
      userName: user.name,
      action: 'USER_LOGIN',
      entityType: 'User',
      entityId: user.id,
      details: `User ${user.email} successfully logged in as ${user.role}`,
    });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        schoolId: user.schoolId,
        schoolName: user.schoolName,
      },
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error during login.' });
  }
});

// Quick Switch (For test/demo evaluation)
router.post('/switch-account', (req, res) => {
  const { email } = req.body;
  const user = db.getUserByEmail(email);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  const token = createSessionToken(user);
  res.json({ token, user });
});

// Get Current User Profile
router.get('/me', requireAuth, (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  res.json({ user: req.user });
});

// Forgot Password
router.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const user = db.getUserByEmail(email);
  if (!user) {
    // Return success to avoid email enumeration
    return res.json({ message: 'If an account exists, a secure password reset link has been dispatched.' });
  }

  db.logAudit({
    userId: user.id,
    userRole: user.role,
    userName: user.name,
    action: 'PASSWORD_RESET_REQUESTED',
    entityType: 'User',
    entityId: user.id,
    details: `Password reset request initiated for ${user.email}`,
  });

  res.json({
    message: 'If an account exists, a secure password reset link has been dispatched.',
    demoResetToken: `mcl_rst_${Date.now()}`,
  });
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'Valid email and a password of at least 6 characters are required.' });
  }

  const user = db.getUserByEmail(email);
  if (!user) {
    return res.status(404).json({ error: 'Account not found.' });
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(newPassword, salt);
  db.setPasswordHash(user.id, hash);

  db.logAudit({
    userId: user.id,
    userRole: user.role,
    userName: user.name,
    action: 'PASSWORD_RESET_COMPLETED',
    entityType: 'User',
    entityId: user.id,
    details: `Password reset completed for ${user.email}`,
  });

  res.json({ message: 'Password has been successfully updated. You may now log in.' });
});

export default router;
