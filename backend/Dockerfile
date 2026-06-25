FROM node:22-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@11.9.0 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts=false

COPY . .

EXPOSE 5000

CMD ["pnpm", "run", "start"]
