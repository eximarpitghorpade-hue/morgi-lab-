import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { db } from './src/db/database.ts';
import { generateInitialSeed } from './src/db/seed.ts';

// Routers
import authRouter from './src/server/routes/auth.ts';
import publicRouter from './src/server/routes/public.ts';
import studentRouter from './src/server/routes/student.ts';
import teacherRouter from './src/server/routes/teacher.ts';
import adminRouter from './src/server/routes/admin.ts';
import aiRouter from './src/server/routes/ai.ts';
import paymentsRouter from './src/server/routes/payments.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Initialize persistent database
async function startServer() {
  const seed = await generateInitialSeed();
  db.init(seed);

  // Mount API Endpoints
  app.use('/api/auth', authRouter);
  app.use('/api/public', publicRouter);
  app.use('/api/student', studentRouter);
  app.use('/api/teacher', teacherRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api/ai', aiRouter);
  app.use('/api/payments', paymentsRouter);

  // API 404 handler
  app.all('/api/*', (req, res) => {
    res.status(404).json({ error: `API route not found: ${req.method} ${req.path}` });
  });

  // Frontend integration: Vite dev middleware in development vs static dist in production
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    // Mount Vite dev server middleware
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[MORNI CREATIVE LAB] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
