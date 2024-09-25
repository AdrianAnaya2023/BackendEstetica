// routes/productosRoutes.js
const express = require('express');
const prisma = require('../prisma/prismaClient');
const router = express.Router();


/**
 * @swagger
 * components:
 *   schemas:
 *     Producto:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID del producto
 *         titulo:
 *           type: string
 *           description: Título del producto
 *         imagen:
 *           type: string
 *           description: URL de la imagen del producto
 *         descripcion:
 *           type: string
 *           description: Descripción del producto
 *         categoriaId:
 *           type: integer
 *           description: ID de la categoría del producto
 */

/**
 * @swagger
 * /productos:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags: [Productos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Producto'
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Producto'
 */
// Crear un nuevo producto
router.post('/productos', async (req, res) => {
  try {
    const { titulo, imagen, descripcion, categoriaId } = req.body;
    const nuevoProducto = await prisma.productos.create({
      data: {
        titulo,
        imagen,
        descripcion,
        categoriaId,
      },
    });
    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el producto' });
  }
});

// Obtener todos los productos
router.get('/productos', async (req, res) => {
  try {
    const productos = await prisma.productos.findMany({
      include: { categoria: true },
    });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

// Obtener un producto por ID
router.get('/productos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const producto = await prisma.productos.findUnique({
      where: { id: parseInt(id) },
      include: { categoria: true },
    });
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});

// Actualizar un producto
router.put('/productos/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, imagen, descripcion, categoriaId } = req.body;
  try {
    const productoActualizado = await prisma.productos.update({
      where: { id: parseInt(id) },
      data: {
        titulo,
        imagen,
        descripcion,
        categoriaId,
      },
    });
    res.json(productoActualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

// Eliminar un producto
router.delete('/productos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.productos.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send(); // No Content
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

module.exports = router;
