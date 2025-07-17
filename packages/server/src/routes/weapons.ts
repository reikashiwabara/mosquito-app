import express from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '../../generated/prisma';

const router = express.Router();
const prisma = new PrismaClient();

// JWT秘密鍵（本番環境では環境変数を使用）
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 武器一覧取得
router.get('/', authenticateToken, async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const weapons = await prisma.weapon.findMany({
      orderBy: { damage: 'asc' }
    });

    res.json(weapons);
  } catch (error) {
    console.error('Weapons fetch error:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// 認証ミドルウェア
function authenticateToken(req: express.Request, res: express.Response, next: express.NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'アクセストークンが必要です' });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      res.status(403).json({ error: 'トークンが無効です' });
      return;
    }
    (req as any).user = user;
    next();
  });
}

export default router;
