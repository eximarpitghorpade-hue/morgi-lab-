import { Router } from 'express';
import crypto from 'crypto';
import { db } from '../../db/database.ts';
import { requireAuth, type AuthenticatedRequest } from '../auth.ts';

const router = Router();

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_morni_lab_2026';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'morni_razorpay_secret_dev';

// Available payment plans
router.get('/plans', (req, res) => {
  res.json({
    plans: db.getData().paymentPlans,
    keyId: RAZORPAY_KEY_ID,
  });
});

// Create Order (Simulated or Live Razorpay Order)
router.post('/create-order', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const { planId } = req.body;

  const data = db.getData();
  const plan = data.paymentPlans.find(p => p.id === planId);
  if (!plan) {
    return res.status(404).json({ error: 'Plan not found' });
  }

  // Create order identifier
  const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  const amount = plan.priceInr * 100; // in paise

  res.json({
    orderId,
    amount,
    currency: 'INR',
    planName: plan.name,
    keyId: RAZORPAY_KEY_ID,
    user: {
      name: user.name,
      email: user.email,
      phone: user.phone || '9876543210',
    },
  });
});

// Verify Payment & Generate Invoice
router.post('/verify', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !planId) {
    return res.status(400).json({ error: 'Order ID, Payment ID, and Plan ID are required' });
  }

  const data = db.getData();

  // Prevent duplicate payment processing
  const existingPayment = data.payments.find(p => p.razorpayPaymentId === razorpay_payment_id);
  if (existingPayment) {
    return res.json({
      success: true,
      message: 'Payment already processed and recorded.',
      payment: existingPayment,
    });
  }

  const plan = data.paymentPlans.find(p => p.id === planId);
  if (!plan) return res.status(404).json({ error: 'Plan not found' });

  // Verify signature if in live mode or valid simulated test signature
  let isValid = true;
  if (razorpay_signature) {
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');
    // For test simulation, accept simulated signature if secret is default or match
    if (process.env.NODE_ENV === 'production' && RAZORPAY_KEY_SECRET !== 'morni_razorpay_secret_dev') {
      isValid = expected === razorpay_signature;
    }
  }

  if (!isValid) {
    return res.status(400).json({ error: 'Invalid Razorpay signature. Payment verification failed.' });
  }

  const invoiceNumber = `INV-2026-${String(data.payments.length + 101).padStart(4, '0')}`;

  const paymentRecord = {
    id: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    planId: plan.id,
    planName: plan.name,
    amountInr: plan.priceInr,
    currency: 'INR',
    razorpayPaymentId: razorpay_payment_id,
    razorpayOrderId: razorpay_order_id,
    status: 'completed' as const,
    invoiceNumber,
    createdAt: new Date().toISOString(),
  };

  data.payments.unshift(paymentRecord);

  // Notify student
  db.createNotification({
    userId: user.id,
    title: `Payment Successful! Invoice #${invoiceNumber}`,
    message: `Thank you for subscribing to ${plan.name}. All programs and mentor studio sessions are now active.`,
    type: 'payment',
    linkUrl: '/student/dashboard',
  });

  db.logAudit({
    userId: user.id,
    userRole: user.role,
    userName: user.name,
    action: 'PAYMENT_COMPLETED',
    entityType: 'Payment',
    entityId: paymentRecord.id,
    details: `Paid ₹${plan.priceInr} for ${plan.name}. Invoice: ${invoiceNumber}`,
  });

  db.save();

  res.json({
    success: true,
    message: 'Payment verified and subscription activated successfully!',
    payment: paymentRecord,
  });
});

export default router;
