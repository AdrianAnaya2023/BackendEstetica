// prismaClient.js
const { PrismaClient } = require('@prisma/client');

// Crear una instancia de Prisma Client
const prisma = new PrismaClient();

// Exportar la instancia para ser utilizada en otros archivos
module.exports = prisma;
