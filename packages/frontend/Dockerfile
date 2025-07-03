# packages/frontend/Dockerfile

FROM node:18-slim

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY . .

EXPOSE 5173

# --host をつけることで、Dockerコンテナの外からアクセスできるようになる
CMD ["pnpm", "run", "dev", "--host"]