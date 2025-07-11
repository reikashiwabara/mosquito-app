# packages/server/Dockerfile

FROM node:18-slim

# OpenSSLをインストールして、Prismaの警告を解消
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json ./
RUN npm install -g pnpm && pnpm install

COPY . .

# 開発時はts-node-devを使うため、ビルドは不要
# 本番環境ではTypeScriptをビルドする: RUN pnpm exec tsc

EXPOSE 3001

# この後、package.jsonにdevスクリプトを定義する必要がある
CMD ["pnpm", "run", "dev"]