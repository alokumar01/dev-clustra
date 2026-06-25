FROM node:22-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@11.9.0 --activate

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --ignore-scripts=false

COPY . .

RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "start"]
