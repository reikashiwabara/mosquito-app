import express from 'express';
import authRoutes from './auth';

const router = express.Router();

// 認証関連のルート
router.use('/auth', authRoutes);

export default router;
