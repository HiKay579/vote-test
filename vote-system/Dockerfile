FROM node:18-alpine

WORKDIR /app

# Installation de PNPM
RUN npm install -g pnpm

# Variables d'environnement
ENV NODE_OPTIONS="--max-old-space-size=2048"
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3006

# Fichiers de configuration
COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig*.json ./
COPY postcss.config.mjs ./
COPY tailwind.config.js ./
COPY next.config.ts ./
COPY prisma ./prisma/

# Installation des dépendances
RUN pnpm install --frozen-lockfile
RUN pnpm add -D autoprefixer postcss postcss-preset-env tailwindcss date-fns @types/node @types/react @types/react-dom typescript @types/bcryptjs
RUN pnpm add bcryptjs

# Copie du code source
COPY . .

# Build
RUN pnpm prisma generate
RUN pnpm run build

# Port pour l'application
EXPOSE 3006

CMD ["pnpm", "start"] 