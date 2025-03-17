import { PrismaClient } from '@prisma/client'

// PrismaClient est attaché au scope global dans les environnements de développement
// pour éviter d'épuiser les connexions à la base de données pendant le hot-reloading
const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma 