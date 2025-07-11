import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '../../generated/prisma';

const router = express.Router();
const prisma = new PrismaClient();

// JWT秘密鍵（本番環境では環境変数を使用）
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// ユーザー登録
router.post('/register', async (req: any, res: any) => {
  try {
    const { email, name, password } = req.body;

    // 入力検証
    if (!email || !name || !password) {
      return res.status(400).json({ error: 'すべてのフィールドを入力してください' });
    }

    // 既存ユーザーの確認
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'このメールアドレスは既に登録されています' });
    }

    // パスワードのハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);

    // ユーザー作成
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword
      }
    });

    // JWTトークンの生成
    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'ユーザーが正常に作成されました',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        kills: user.kills,
        deaths: user.deaths
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// ログイン
router.post('/login', async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    // 入力検証
    if (!email || !password) {
      return res.status(400).json({ error: 'メールアドレスとパスワードを入力してください' });
    }

    // ユーザーの検索
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(400).json({ error: 'メールアドレスまたはパスワードが間違っています' });
    }

    // パスワードの確認
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(400).json({ error: 'メールアドレスまたはパスワードが間違っています' });
    }

    // JWTトークンの生成
    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'ログインに成功しました',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        kills: user.kills,
        deaths: user.deaths
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// ユーザー情報の取得
router.get('/user', authenticateToken, async (req: any, res: any) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        name: true,
        kills: true,
        deaths: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'ユーザーが見つかりません' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// スコア更新
router.put('/score', authenticateToken, async (req: any, res: any) => {
  try {
    const { kills, deaths } = req.body;
    const userId = req.user.userId;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        kills: kills,
        deaths: deaths
      }
    });

    res.json({
      message: 'スコアが更新されました',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        kills: user.kills,
        deaths: user.deaths
      }
    });
  } catch (error) {
    console.error('Update score error:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// 認証ミドルウェア
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'アクセストークンが必要です' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'トークンが無効です' });
    }
    req.user = user;
    next();
  });
}

export default router;
