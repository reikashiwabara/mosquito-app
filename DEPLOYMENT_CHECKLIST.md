# AWS Amplify デプロイ完了チェックリスト

## ✅ ファイル準備完了

- [x] `amplify.yml` - Amplifyビルド設定
- [x] `package.json` - ルートレベルのビルドスクリプト
- [x] `AMPLIFY_DEPLOYMENT.md` - デプロイ手順ドキュメント
- [x] `.env.example` ファイル（フロントエンド・サーバー両方）
- [x] CORS設定とポート設定の本番対応
- [x] 環境変数による動的API URL設定

## 🚀 次のステップ（Amplifyでの設定）

### 1. GitHubリポジトリの準備
```bash
git add .
git commit -m "Add Amplify deployment configuration"
git push origin main
```

### 2. AWS Amplifyでの設定

1. **新しいアプリの作成**
   - AWS Amplifyコンソールで「新しいアプリ」を選択
   - GitHubリポジトリを接続

2. **ビルド設定**
   - `amplify.yml`が自動検出されることを確認
   - Node.js バージョン: 18以上を指定

3. **環境変数の設定**
   ```
   DATABASE_URL=postgresql://your-db-url
   JWT_SECRET=your-secure-jwt-secret
   NODE_ENV=production
   VITE_API_BASE_URL=https://your-backend-api-url
   ```

### 3. データベースセットアップ

#### オプション A: AWS RDS PostgreSQL
- RDSインスタンス作成
- セキュリティグループ設定
- DATABASE_URL更新

#### オプション B: 外部サービス
- Supabase、Railway、PlanetScale等を利用
- DATABASE_URL取得

### 4. デプロイ後の確認

- [ ] フロントエンドが正常に表示される
- [ ] API エンドポイントが応答する（/health）
- [ ] ユーザー登録・ログインが動作する
- [ ] データベース接続が正常

## 🔧 トラブルシューティング

### ビルドエラーの場合
1. Amplifyコンソールのログを確認
2. pnpmのバージョン確認
3. 依存関係の確認

### API接続エラーの場合
1. CORS設定確認
2. 環境変数の値確認
3. データベース接続確認

### 環境変数が反映されない場合
1. Amplifyコンソールで再デプロイ
2. 環境変数の名前とスペルを確認
