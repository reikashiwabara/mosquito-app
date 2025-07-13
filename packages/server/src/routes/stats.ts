import express from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '../../generated/prisma';

const router = express.Router();
const prisma = new PrismaClient();

// JWTトークンを検証するミドルウェア
const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.sendStatus(401);
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret', (err: any, user: any) => {
    if (err) {
      res.sendStatus(403);
      return;
    }
    (req as any).user = user;
    next();
  });
};

// 統計データ取得エンドポイント
router.get('/:period', authenticateToken, async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const { period } = req.params;
    const { userId } = req.query;

    if (!userId) {
      res.status(400).json({ error: 'ユーザーIDが必要です' });
      return;
    }

    // 実際のゲームログデータを取得
    const statsData = await getStatsData(period, parseInt(userId as string));
    
    res.json(statsData);
  } catch (error) {
    console.error('Stats API error:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// 実際のゲームログデータを取得する関数
async function getStatsData(period: string, userId: number) {
  const now = new Date();
  let startDate: Date;
  let labels: string[] = [];
  let kills: number[] = [];
  let deaths: number[] = [];

  switch (period) {
    case '1hour':
      startDate = new Date(now.getTime() - 60 * 60 * 1000);
      labels = Array.from({ length: 12 }, (_, i) => `${i * 5}分前`);
      
      // 5分ごとの集計
      for (let i = 0; i < 12; i++) {
        const periodStart = new Date(now.getTime() - (i + 1) * 5 * 60 * 1000);
        const periodEnd = new Date(now.getTime() - i * 5 * 60 * 1000);
        
        const killCount = await prisma.gameLog.count({
          where: {
            userId: userId,
            action: 'kill',
            createdAt: {
              gte: periodStart,
              lt: periodEnd
            }
          }
        });
        
        const deathCount = await prisma.gameLog.count({
          where: {
            userId: userId,
            action: 'death',
            createdAt: {
              gte: periodStart,
              lt: periodEnd
            }
          }
        });
        
        kills.push(killCount);
        deaths.push(deathCount);
      }
      
      kills.reverse();
      deaths.reverse();
      break;
      
    case '3days':
      labels = ['3日前', '2日前', '1日前'];
      
      for (let i = 2; i >= 0; i--) {
        const dayStart = new Date(now.getTime() - (i + 1) * 24 * 60 * 60 * 1000);
        const dayEnd = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        
        const killCount = await prisma.gameLog.count({
          where: {
            userId: userId,
            action: 'kill',
            createdAt: {
              gte: dayStart,
              lt: dayEnd
            }
          }
        });
        
        const deathCount = await prisma.gameLog.count({
          where: {
            userId: userId,
            action: 'death',
            createdAt: {
              gte: dayStart,
              lt: dayEnd
            }
          }
        });
        
        kills.push(killCount);
        deaths.push(deathCount);
      }
      break;
      
    case '1week':
      labels = ['月', '火', '水', '木', '金', '土', '日'];
      
      for (let i = 6; i >= 0; i--) {
        const dayStart = new Date(now.getTime() - (i + 1) * 24 * 60 * 60 * 1000);
        const dayEnd = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        
        const killCount = await prisma.gameLog.count({
          where: {
            userId: userId,
            action: 'kill',
            createdAt: {
              gte: dayStart,
              lt: dayEnd
            }
          }
        });
        
        const deathCount = await prisma.gameLog.count({
          where: {
            userId: userId,
            action: 'death',
            createdAt: {
              gte: dayStart,
              lt: dayEnd
            }
          }
        });
        
        kills.push(killCount);
        deaths.push(deathCount);
      }
      break;
      
    default:
      // フォールバック: 空データを返す
      const emptyData = generateEmptyStatsData(period);
      return emptyData;
  }

  return { labels, kills, deaths };
}

// 空統計データ生成関数（全て0で初期化）
function generateEmptyStatsData(period: string) {
  let labels: string[] = [];
  let dataLength = 0;

  switch (period) {
    case '1hour':
      labels = Array.from({ length: 12 }, (_, i) => `${i * 5}分前`);
      dataLength = 12;
      break;
    case '3days':
      labels = ['3日前', '2日前', '1日前'];
      dataLength = 3;
      break;
    case '1week':
      labels = ['月', '火', '水', '木', '金', '土', '日'];
      dataLength = 7;
      break;
    default:
      labels = [];
      dataLength = 0;
  }

  return { 
    labels, 
    kills: new Array(dataLength).fill(0), 
    deaths: new Array(dataLength).fill(0) 
  };
}

export default router;
