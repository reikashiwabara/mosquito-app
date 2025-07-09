# Mosquito App
蚊に刺されたときのアプリ
## 概要
このアプリは、蚊に刺されたときの症状を記録し、管理するためのものです。
## 開発環境
- Node.js
- Docker
- pnpm
- TypeScript
- React
- Vite
## セットアップ手順
1. リポジトリをクローンします。
   ```bash
   git clone
2. `mosquito-app` ディレクトリに移動します。
   ```bash
   cd mosquito-app
   ```
3. 依存関係をインストールします。(frontとserverの両方)
    ```bash
    npm install
    ```
4. pnpm install
   ```bash
   pnpm install

5. Dockerを使用してアプリケーションを起動します。
   ```bash
   docker-compose up --build
   ```
6. ブラウザで `http://localhost:3000` にアクセスします。
7. サーバーは `http://localhost:3001` で動作しています。
8. フロントエンドは `http://localhost:3000` で動作しています。
9.  Prismaのマイグレーションを実行します。
   ```bash
   docker-compose exec server npx prisma migrate dev --name init
   ```

### ディレクトリ構成
```
mosquito-app/
├── .git/
├── .gitignore
├── docker-compose.yml
├── package-lock.json
├── package.json
├── pnpm-workspace.yaml
└── packages/
    ├── frontend/
    │   ├── .dockerignore
    │   ├── .gitignore
    │   ├── Dockerfile
    │   ├── README.md
    │   ├── eslint.config.js
    │   ├── index.html
    │   ├── node_modules/
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── pnpm-lock.yaml
    │   ├── public/
    │   │   └── vite.svg
    │   ├── src/
    │   │   ├── App.css
    │   │   ├── App.tsx
    │   │   ├── index.css
    │   │   ├── main.tsx
    │   │   ├── vite-env.d.ts
    │   │   └── assets/
    │   │       └── react.svg
    │   ├── tsconfig.app.json
    │   ├── tsconfig.json
    │   ├── tsconfig.node.json
    │   └── vite.config.ts
    └── server/
        ├── .dockerignore
        ├── .env.example
        ├── .gitignore
        ├── Dockerfile
        ├── node_modules/
        ├── package-lock.json
        ├── package.json
        ├── pnpm-lock.yaml
        ├── prisma/
        │   └── schema.prisma
        ├── src/
        │   └── index.ts
        └── tsconfig.json
```