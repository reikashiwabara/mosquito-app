# Mosquito App 🦟
蚊との戦いを記録するスコア管理アプリ

## 概要
このアプリは、蚊を退治したキル数とデス数（刺された数）を記録・管理するゲーム風アプリです。
ユーザー登録・ログイン機能により、個人のスコアを管理できます。

## 主な機能
- **ユーザー認証**：アカウント登録・ログイン・ログアウト
- **スコア管理**：キル数・デス数の記録と表示
- **リアルタイム更新**：サーバーとの同期によるスコア保存
- **レスポンシブデザイン**：PC・スマホ対応

## 技術スタック
- **フロントエンド**：React + TypeScript + Vite
- **バックエンド**：Express + TypeScript + Prisma ORM
- **データベース**：PostgreSQL
- **認証**：JWT (JSON Web Token) + bcrypt
- **コンテナ化**：Docker + Docker Compose
- **パッケージ管理**：pnpm

## 環境構築手順

### 前提条件
- Docker & Docker Compose がインストールされていること
- Git がインストールされていること

### 1. リポジトリをクローン
```bash
git clone <repository-url>
cd mosqutest1
```

### 2. 環境変数の設定
サーバー用の環境変数ファイルを作成します：
```bash
cp packages/server/.env.example packages/server/.env
```

### 3. Docker環境での起動
```bash
# アプリケーション全体をビルド・起動
docker-compose up --build -d

# ログの確認（オプション）
docker-compose logs -f
```

### 4. データベースマイグレーション
```bash
# Prismaマイグレーションを実行
docker-compose exec server npx prisma migrate dev --name init

# Prismaクライアントを生成
docker-compose exec server npx prisma generate
```

### 5. アプリケーションにアクセス
- **フロントエンド**：http://localhost:5173
- **バックエンドAPI**：http://localhost:3001
- **データベース**：localhost:5495 (PostgreSQL)

## 使用方法

### アカウント登録
1. ブラウザで http://localhost:5173 にアクセス
2. 「新規登録」をクリック
3. メールアドレス、名前、パスワードを入力
4. 「登録」ボタンをクリック

### ログイン
1. 「ログイン」をクリック
2. メールアドレスとパスワードを入力
3. 「ログイン」ボタンをクリック

### スコア管理
- **キル**：蚊のアイコンをクリックしてキル数を増加
- **デス**：ドクロアイコンをクリックしてデス数を増加
- スコアは自動的にサーバーに保存されます

## 開発者向け情報

### ローカル開発環境
```bash
# 各パッケージの依存関係をインストール
cd packages/frontend && pnpm install
cd packages/server && pnpm install

# フロントエンド開発サーバー起動
cd packages/frontend && pnpm dev

# バックエンドサーバー起動
cd packages/server && pnpm dev
```

### API エンドポイント
- `POST /api/auth/register` - ユーザー登録
- `POST /api/auth/login` - ログイン
- `GET /api/auth/user` - ユーザー情報取得
- `PUT /api/auth/score` - スコア更新

### コンテナ管理
```bash
# コンテナ停止
docker-compose down

# コンテナ再起動
docker-compose restart

# ログ確認
docker-compose logs [service-name]

# データベース接続
docker-compose exec db psql -U postgres -d mosquito_db
```

## プロジェクト構成
```
mosqutest1/
├── docker-compose.yml          # Docker Compose設定
├── package.json               # ルートパッケージ設定
├── pnpm-lock.yaml            # パッケージロックファイル
├── pnpm-workspace.yaml       # pnpmワークスペース設定
├── README.MD                 # このファイル
└── packages/
    ├── frontend/             # Reactフロントエンド
    │   ├── Dockerfile
    │   ├── package.json
    │   ├── index.html
    │   ├── vite.config.ts
    │   ├── public/
    │   │   └── vite.svg
    │   └── src/
    │       ├── App.tsx       # メインアプリケーション
    │       ├── App.css       # スタイルシート
    │       ├── main.tsx      # エントリーポイント
    │       ├── types/        # TypeScript型定義
    │       │   └── index.ts  # 共通型定義
    │       ├── hooks/        # カスタムフック
    │       │   ├── index.ts
    │       │   ├── useAuth.ts    # 認証フック
    │       │   └── useLogs.ts    # ログ管理フック
    │       ├── pages/        # ページコンポーネント
    │       │   ├── index.ts
    │       │   ├── LoginScreen.tsx    # ログイン画面
    │       │   ├── RegisterScreen.tsx # 登録画面
    │       │   └── MainScreen.tsx     # メイン画面
    │       ├── components/   # 再利用可能コンポーネント
    │       │   ├── index.ts
    │       │   ├── ScoreBoard.tsx     # スコア表示
    │       │   ├── ActionButtons.tsx  # アクションボタン
    │       │   └── LogArea.tsx        # ログ表示エリア
    │       ├── utils/        # ユーティリティ関数
    │       │   └── index.ts  # API設定・共通関数
    │       └── assets/
    │           ├── death.png # デスアイコン
    │           ├── kill.png  # キルアイコン
    │           └── react.svg
    └── server/               # Express バックエンド
        ├── Dockerfile
        ├── package.json
        ├── tsconfig.json
        ├── prisma/
        │   ├── schema.prisma      # データベーススキーマ
        │   └── migrations/        # マイグレーションファイル
        ├── generated/
        │   └── prisma/           # 生成されたPrismaクライアント
        └── src/
            ├── index.ts          # サーバーエントリーポイント
            └── routes/
                ├── index.ts      # ルーティング設定
                └── auth.ts       # 認証関連API
```

## トラブルシューティング

### よくある問題と解決方法

**🔧 Prisma Query Engine エラー**
```bash
# Prismaクライアントの再生成
docker-compose exec server npx prisma generate
docker-compose restart server
```

**🔧 データベース接続エラー**
```bash
# データベースコンテナの再起動
docker-compose restart db
```

**🔧 ポート競合エラー**
- フロントエンド（5173）、サーバー（3001）、DB（5495）が使用中でないか確認
```bash
# ポート使用状況確認
netstat -tulpn | grep -E ":(5173|3001|5495)"
```

**🔧 権限エラー**
```bash
# Dockerコンテナの権限リセット
docker-compose down -v
docker-compose up --build -d
```

## 貢献方法
1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## ライセンス
このプロジェクトはMITライセンスの下で公開されています。

---
🦟 Happy Mosquito Hunting! 🦟