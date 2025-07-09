const express = require('express');
const app = express();
const port = 3001; // listenするport番号

app.get('/test', (req: any, res: { send: (arg0: string) => void; }) => {
    res.send("hello world");
});
//routesディレクトリにある全てのルートを読み込む
app.use('/api', require('./routes'));


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});