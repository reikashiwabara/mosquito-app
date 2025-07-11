import express from 'express';
import authRoutes from './auth';
import bedrockRoutes from './bedrock';

const router = express.Router();

// 認証関連のルート
router.use('/auth', authRoutes);

// Bedrock関連のルートを追加
router.use('/bedrock', bedrockRoutes);

export default router;
