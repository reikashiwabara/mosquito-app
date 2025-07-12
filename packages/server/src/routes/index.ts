import express from 'express';
import authRoutes from './auth';
import statsRoutes from './stats';
import gamelogRoutes from './gamelog';

const router = express.Router();

// 認証関連のルート
router.use('/auth', authRoutes);

// 統計関連のルート
router.use('/stats', statsRoutes);

// ゲームログ関連のルート
router.use('/game', gamelogRoutes);

export default router;
