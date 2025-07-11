import express from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();
const port = process.env.PORT || 3001; // Amplifyではprocess.env.PORTを使用

// CORS設定を本番環境に対応
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL || 'https://your-frontend-domain.amplifyapp.com']
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
};

// ミドルウェア
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

app.get('/test', (req: any, res: { send: (arg0: string) => void; }) => {
    res.send("hello world");
});

//routesディレクトリにある全てのルートを読み込む
app.use('/api', routes);

app.listen(port, () => {
  console.log(`Server running on port ${port} in ${process.env.NODE_ENV || 'development'} mode`);
});