// prismaClient.js
const { PrismaClient } = require('@prisma/client');

let prisma;

// En producción, crea una instancia única de Prisma Client
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // En desarrollo, usa una única instancia global para evitar problemas de recarga
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

module.exports = prisma;
