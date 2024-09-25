// routes/productosRoutes.js
const express = require('express');
const prisma = require('../prisma/prismaClient'); // Asegúrate de que este sea el path correcto al archivo de Prisma
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
 *         categoria_id:
 *           type: integer
 *           description: ID de la categoría del producto
 *         descripcion:
 *           type: string
 *           description: Descripción del producto
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
router.post('/productos', async (req, res) => {
  try {
    const { titulo, imagen, categoria_id, descripcion } = req.body;
    const nuevoProducto = await prisma.productos.create({
      data: {
        titulo,
        imagen,
        descripcion,
        categoria: {
          connect: { id: categoria_id }, // Asegúrate de conectar correctamente usando `categoria_id`
        },
      },
    });
    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el producto', details: error.message });
  }
});

/**
 * @swagger
 * /productos:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Producto'
 */
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

/**
 * @swagger
 * /productos/{id}:
 *   get:
 *     summary: Obtener un producto por ID
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Producto'
 *       404:
 *         description: Producto no encontrado
 */
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

/**
 * @swagger
 * /productos/{id}:
 *   put:
 *     summary: Actualizar un producto
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Producto'
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Producto'
 *       404:
 *         description: Producto no encontrado
 */
router.put('/productos/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, imagen, categoria_id, descripcion } = req.body;
  try {
    const productoActualizado = await prisma.productos.update({
      where: { id: parseInt(id) },
      data: {
        titulo,
        imagen,
        descripcion,
        categoria: {
          connect: { id: categoria_id },
        },
      },
    });
    res.json(productoActualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

/**
 * @swagger
 * /productos/{id}:
 *   delete:
 *     summary: Eliminar un producto
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del producto
 *     responses:
 *       204:
 *         description: Producto eliminado exitosamente
 *       404:
 *         description: Producto no encontrado
 */
router.delete('/productos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.productos.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

module.exports = router;
