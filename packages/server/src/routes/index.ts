import express from 'express';
import authRoutes from './auth';
import statsRoutes from './stats';
import gamelogRoutes from './gamelog';
import rankingRoutes from './ranking';
import weaponsRoutes from './weapons';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/weapons', weaponsRoutes);
router.use(rankingRoutes);

// 統計関連のルート
router.use('/stats', statsRoutes);

// ゲームログ関連のルート
router.use('/game', gamelogRoutes);

export default router;
