// swaggerConfig.js
const swaggerJSDoc = require('swagger-jsdoc');

// Configuración de las opciones de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Documentación de la API para mi proyecto con Node.js, Prisma y Supabase',
    },
    servers: [
      {
        url: 'http://localhost:3000/api', // Cambia según tu configuración de URL base
      },
    ],
  },
  apis: ['./routes/*.js'], // Ruta a los archivos de rutas donde definiste tus endpoints
};

// Inicializa Swagger JSDoc
const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = swaggerSpec;
