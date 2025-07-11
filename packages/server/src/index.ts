import express from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();
const port = 3001; // listenするport番号

// ミドルウェア
app.use(express.json());
app.use(cors());

app.get('/test', (req: any, res: { send: (arg0: string) => void; }) => {
    res.send("hello world");
});

//routesディレクトリにある全てのルートを読み込む
app.use('/api', routes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});