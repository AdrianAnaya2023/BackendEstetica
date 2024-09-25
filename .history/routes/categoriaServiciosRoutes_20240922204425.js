// routes/categoriaServiciosRoutes.js
const express = require('express');
const prisma = require('../prisma/prismaClient');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     CategoriaServicios:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID de la categoría de servicios
 *         nombre:
 *           type: string
 *           description: Nombre de la categoría de servicios
 *         descripcion:
 *           type: string
 *           description: Descripción de la categoría de servicios
 *         imagen:
 *           type: string
 *           description: URL de la imagen de la categoría de servicios
 */

/**
 * @swagger
 * /categorias-servicios:
 *   post:
 *     summary: Crear una nueva categoría de servicios
 *     tags: [Categorías de Servicios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoriaServicios'
 *     responses:
 *       201:
 *         description: Categoría de servicios creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoriaServicios'
 */
router.post('/categorias-servicios', async (req, res) => {
  const { nombre, descripcion, imagen } = req.body;
  try {
    const nuevaCategoria = await prisma.categoriaServicios.create({
      data: { nombre, descripcion, imagen },
    });
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la categoría de servicios' });
  }
});

/**
 * @swagger
 * /categorias-servicios:
 *   get:
 *     summary: Obtener todas las categorías de servicios
 *     tags: [Categorías de Servicios]
 *     responses:
 *       200:
 *         description: Lista de categorías de servicios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CategoriaServicios'
 */
router.get('/categorias-servicios', async (req, res) => {
  try {
    const categorias = await prisma.categoriaServicios.findMany();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las categorías de servicios' });
  }
});

/**
 * @swagger
 * /categorias-servicios/{id}:
 *   get:
 *     summary: Obtener una categoría de servicios por ID
 *     tags: [Categorías de Servicios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la categoría de servicios
 *     responses:
 *       200:
 *         description: Categoría de servicios encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoriaServicios'
 *       404:
 *         description: Categoría de servicios no encontrada
 */
router.get('/categorias-servicios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const categoria = await prisma.categoriaServicios.findUnique({
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
 * /categorias-servicios/{id}:
 *   put:
 *     summary: Actualizar una categoría de servicios
 *     tags: [Categorías de Servicios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la categoría de servicios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoriaServicios'
 *     responses:
 *       200:
 *         description: Categoría de servicios actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoriaServicios'
 *       404:
 *         description: Categoría de servicios no encontrada
 */
router.put('/categorias-servicios/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, imagen } = req.body;
  try {
    const categoriaActualizada = await prisma.categoriaServicios.update({
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
 * /categorias-servicios/{id}:
 *   delete:
 *     summary: Eliminar una categoría de servicios
 *     tags: [Categorías de Servicios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la categoría de servicios
 *     responses:
 *       204:
 *         description: Categoría de servicios eliminada exitosamente
 *       404:
 *         description: Categoría de servicios no encontrada
 */
router.delete('/categorias-servicios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.categoriaServicios.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la categoría' });
  }
});

module.exports = router;
