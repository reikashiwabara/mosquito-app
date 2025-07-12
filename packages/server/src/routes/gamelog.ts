import express from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '../../generated/prisma';

const router = express.Router();
const prisma = new PrismaClient();

// JWTトークンを検証するミドルウェア
const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret', (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    (req as any).user = user;
    next();
  });
};

// ゲームログ記録エンドポイント
router.post('/record', authenticateToken, async (req, res) => {
  try {
    const { action } = req.body; // 'kill' または 'death'
    const user = (req as any).user;

    if (!action || !['kill', 'death'].includes(action)) {
      return res.status(400).json({ error: '無効なアクションです' });
    }

    // ゲームログをデータベースに保存
    const gameLog = await prisma.gameLog.create({
      data: {
        userId: user.userId,
        action: action,
        createdAt: new Date()
      }
    });

    // ユーザーのキル/デス数も更新
    if (action === 'kill') {
      await prisma.user.update({
        where: { id: user.userId },
        data: { kills: { increment: 1 } }
      });
    } else if (action === 'death') {
      await prisma.user.update({
        where: { id: user.userId },
        data: { deaths: { increment: 1 } }
      });
    }
    
    res.json({ 
      success: true, 
      message: `${action}が記録されました`,
      timestamp: gameLog.createdAt
    });
  } catch (error) {
    console.error('GameLog record error:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// ゲームログ取得エンドポイント
router.get('/logs', authenticateToken, async (req, res) => {
  try {
    const user = (req as any).user;
    const { limit = 10 } = req.query;

    const logs = await prisma.gameLog.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string)
    });

    res.json({
      logs: logs,
      total: logs.length
    });
  } catch (error) {
    console.error('GameLog fetch error:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

export default router;
