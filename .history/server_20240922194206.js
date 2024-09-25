// server.js
const express = require('express');
const app = express();
const multer = require('multer');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerConfig'); // Importar configuración de Swagger

// Importar todas las rutas
const productosRoutes = require('./routes/productosRoutes');
const categoriaProductosRoutes = require('./routes/categoriaProductosRoutes');
const consejosRoutes = require('./routes/consejosRoutes');
const categoriaConsejosRoutes = require('./routes/categoriaConsejosRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');
const galeriaRoutes = require('./routes/galeriaRoutes');
const categoriaGaleriaRoutes = require('./routes/categoriaGaleriaRoutes');
const promosRoutes = require('./routes/promosRoutes');
const encuestasRoutes = require('./routes/encuestasRoutes');
const serviciosRoutes = require('./routes/serviciosRoutes');
const categoriaServiciosRoutes = require('./routes/categoriaServiciosRoutes');
const homepageRoutes = require('./routes/homepageRoutes');
const footerRoutes = require('./routes/footerRoutes');

app.use(express.json());
const upload = multer({ storage: multer.memoryStorage() });

// Configurar Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Montar todas las rutas
app.use('/api', productosRoutes);
app.use('/api', categoriaProductosRoutes);
app.use('/api', consejosRoutes);
app.use('/api', categoriaConsejosRoutes);
app.use('/api', usuariosRoutes);
app.use('/api', galeriaRoutes);
app.use('/api', categoriaGaleriaRoutes);
app.use('/api', promosRoutes);
app.use('/api', encuestasRoutes);
app.use('/api', serviciosRoutes);
app.use('/api', categoriaServiciosRoutes);
app.use('/api', homepageRoutes);
app.use('/api', footerRoutes);

// Ruta de verificación
app.get('/', (req, res) => res.send('Servidor funcionando correctamente'));

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal!');
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));

// Manejadores para cerrar Prisma correctamente al detener el servidor
process.on('SIGINT', async () => {
  console.log('Cerrando servidor y desconectando Prisma...');
  await prisma.$disconnect();
  server.close(() => {
    console.log('Servidor cerrado');
    process.exit(0);
  });
});

process.on('SIGTERM', async () => {
  console.log('Cerrando servidor y desconectando Prisma...');
  await prisma.$disconnect();
  server.close(() => {
    console.log('Servidor cerrado');
    process.exit(0);
  });
});