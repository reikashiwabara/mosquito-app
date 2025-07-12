import express from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();
const port = process.env.PORT || 3001; // Amplifyではprocess.env.PORTを使用

// CORS設定を本番環境に対応
const corsOptions = {
  origin: function (origin: any, callback: any) {
    // 開発環境では全てのオリジンを許可
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    // 本番環境では特定のオリジンのみ許可
    const allowedOrigins = [process.env.FRONTEND_URL || 'https://your-frontend-domain.amplifyapp.com'];
    if (allowedOrigins.includes(origin) || !origin) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(express.json());
app.use(cors(corsOptions));

// ヘルスチェックエンドポイント
app.get('/health', (req: any, res: any) => {
    res.status(200).json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
});

app.use('/api', routes);

app.listen(port, () => {
  console.log(`Server running on port ${port} in ${process.env.NODE_ENV || 'development'} mode`);
});