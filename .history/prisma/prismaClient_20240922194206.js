// prismaClient.js
const { PrismaClient } = require('@prisma/client');

// Asegúrate de que solo haya una instancia de Prisma en desarrollo para evitar errores con prepared statements
let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

module.exports = prisma;
