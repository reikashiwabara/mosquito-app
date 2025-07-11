# Mosquito Killing Game - AWS Amplify Deployment

## 概要
React + Node.js + PostgreSQLを使用した蚊退治ゲームアプリケーション。

## Amplifyデプロイ手順

### 1. AWS Amplifyコンソールでの設定

1. AWS Amplifyコンソールにアクセス
2. 「新しいアプリ」 → 「ホストWebアプリ」を選択
3. GitHubリポジトリを接続
4. ブランチを選択（通常はmain）

### 2. 環境変数の設定

Amplifyの環境変数設定で以下を追加：

```
DATABASE_URL=postgresql://username:password@hostname:5432/database_name
JWT_SECRET=your-jwt-secret-key-here
NODE_ENV=production
```

### 3. ビルド設定

- `amplify.yml`ファイルが自動的に検出されます
- カスタムビルドコマンドは既に設定済み

### 4. データベース設定

PostgreSQLデータベースが必要です。以下のオプションがあります：

#### Option A: AWS RDS PostgreSQL
1. AWS RDSでPostgreSQLインスタンスを作成
2. セキュリティグループでAmplifyからのアクセスを許可
3. DATABASE_URLを更新

#### Option B: 外部データベースサービス
- Railway, Supabase, PlanetScale等を使用可能

### 5. プリズママイグレーション

初回デプロイ時に自動的にマイグレーションが実行されます。
手動で実行する場合：

```bash
cd packages/server
pnpm prisma migrate deploy
```

## 開発環境での実行

```bash
# 依存関係のインストール
pnpm install

# 開発サーバー起動（フロントエンド）
pnpm run dev:frontend

# 開発サーバー起動（バックエンド）
pnpm run dev:server

# または Docker Compose使用
docker-compose up
```

## 本番環境のURL設定

フロントエンドの`src/utils/index.ts`でAPI_BASE_URLを本番環境に合わせて更新してください：

```typescript
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-api-domain.com/api'
  : 'http://localhost:3001/api';
```

## トラブルシューティング

### ビルドエラー
- node_modulesのキャッシュをクリア
- pnpmのバージョンを確認
- 依存関係の競合を確認

### データベース接続エラー
- DATABASE_URLの形式を確認
- セキュリティグループ設定を確認
- データベースの起動状態を確認

### 環境変数エラー
- Amplifyコンソールで環境変数が正しく設定されているか確認
- JWT_SECRETが設定されているか確認
