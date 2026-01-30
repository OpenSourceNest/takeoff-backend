FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY prisma ./prisma/

RUN npx prisma generate

COPY . .

# Workaround to prevent prisma build from failing due to missing DATABASE_URL
ENV DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"

RUN npm run build



FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./

RUN npm install --only=production

COPY --from=builder /app/dist ./dist

USER node

CMD ["node", "dist/index.js"]