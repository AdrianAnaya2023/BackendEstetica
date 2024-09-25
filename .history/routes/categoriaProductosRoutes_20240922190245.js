// routes/categoriaProductosRoutes.js
const express = require('express');
const prisma = require('../prisma/prismaClient');
const router = express.Router();



/**
 * @swagger
 * components:
 *   schemas:
 *     CategoriaProducto:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID de la categoría de producto
 *         nombre:
 *           type: string
 *           description: Nombre de la categoría
 *         descripcion:
 *           type: string
 *           description: Descripción de la categoría
 *         imagen:
 *           type: string
 *           description: URL de la imagen de la categoría
 */

/**
 * @swagger
 * /categorias-productos:
 *   post:
 *     summary: Crear una nueva categoría de productos
 *     tags: [Categorias de Productos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoriaProducto'
 *     responses:
 *       201:
 *         description: Categoría creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoriaProducto'
 */
router.post('/categorias-productos', async (req, res) => {
  try {
    const { nombre, descripcion, imagen } = req.body;
    const nuevaCategoria = await prisma.categoriaProductos.create({
      data: { nombre, descripcion, imagen },
    });
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la categoría de productos' });
  }
});

/**
 * @swagger
 * /categorias-productos:
 *   get:
 *     summary: Obtener todas las categorías de productos
 *     tags: [Categorias de Productos]
 *     responses:
 *       200:
 *         description: Lista de categorías de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CategoriaProducto'
 */
router.get('/categorias-productos', async (req, res) => {
  try {
    const categorias = await prisma.categoriaProductos.findMany();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las categorías de productos' });
  }
});

/**
 * @swagger
 * /categorias-productos/{id}:
 *   get:
 *     summary: Obtener una categoría de productos por ID
 *     tags: [Categorias de Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la categoría de productos
 *     responses:
 *       200:
 *         description: Categoría encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoriaProducto'
 *       404:
 *         description: Categoría no encontrada
 */
router.get('/categorias-productos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const categoria = await prisma.categoriaProductos.findUnique({
      where: { id: parseInt(id) },
    });
    if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json(categoria);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la categoría' });
  }
});

/**
 * @swagger
 * /categorias-productos/{id}:
 *   put:
 *     summary: Actualizar una categoría de productos
 *     tags: [Categorias de Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la categoría de productos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoriaProducto'
 *     responses:
 *       200:
 *         description: Categoría actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoriaProducto'
 *       404:
 *         description: Categoría no encontrada
 */
router.put('/categorias-productos/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, imagen } = req.body;
  try {
    const categoriaActualizada = await prisma.categoriaProductos.update({
      where: { id: parseInt(id) },
      data: { nombre, descripcion, imagen },
    });
    res.json(categoriaActualizada);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la categoría' });
  }
});

/**
 * @swagger
 * /categorias-productos/{id}:
 *   delete:
 *     summary: Eliminar una categoría de productos
 *     tags: [Categorias de Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la categoría de productos
 *     responses:
 *       204:
 *         description: Categoría eliminada exitosamente
 *       404:
 *         description: Categoría no encontrada
 */
router.delete('/categorias-productos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.categoriaProductos.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la categoría' });
  }
});

module.exports = router;
