import express from 'express';
import authRoutes from './auth';
import rankingRoutes from './ranking';

const router = express.Router();

router.use('/auth', authRoutes);
router.use(rankingRoutes);

export default router;