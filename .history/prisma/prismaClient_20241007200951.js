const { PrismaClient } = require('@prisma/client');

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // Asegura que prisma solo se inicialice una vez en desarrollo
  if (!global._prisma) {
    global._prisma = new PrismaClient();
  }
  prisma = global._prisma;
}

module.exports = prisma;
