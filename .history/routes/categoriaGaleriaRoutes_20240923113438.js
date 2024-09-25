// routes/categoriaGaleriaRoutes.js
const express = require('express');
const prisma = require('../prisma/prismaClient');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     CategoriaGaleria:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID de la categoría de galería
 *         nombre:
 *           type: string
 *           description: Nombre de la categoría de galería
 *         descripcion:
 *           type: string
 *           description: Descripción de la categoría de galería
 *         imagen:
 *           type: string
 *           description: URL de la imagen de la categoría de galería
 */

/**
 * @swagger
 * /categorias-galeria:
 *   post:
 *     summary: Crear una nueva categoría de galería
 *     tags: [Categorías de Galería]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoriaGaleria'
 *     responses:
 *       201:
 *         description: Categoría de galería creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoriaGaleria'
 */
router.post('/categorias-galeria', async (req, res) => {
  const { nombre, descripcion, imagen } = req.body;
  try {
    const nuevaCategoria = await prisma.categoriaGaleria.create({
      data: { nombre, descripcion, imagen },
    });
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la categoría de galería' });
  }
});

/**
 * @swagger
 * /categorias-galeria:
 *   get:
 *     summary: Obtener todas las categorías de galería
 *     tags: [Categorías de Galería]
 *     responses:
 *       200:
 *         description: Lista de categorías de galería
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CategoriaGaleria'
 */
router.get('/categorias-galeria', async (req, res) => {
  try {
    const categorias = await prisma.categoriaGaleria.findMany();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las categorías de galería' });
  }
});

/**
 * @swagger
 * /categorias-galeria/{id}:
 *   get:
 *     summary: Obtener una categoría de galería por ID
 *     tags: [Categorías de Galería]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la categoría de galería
 *     responses:
 *       200:
 *         description: Categoría de galería encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoriaGaleria'
 *       404:
 *         description: Categoría de galería no encontrada
 */
router.get('/categorias-galeria/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const categoria = await prisma.categoriaGaleria.findUnique({
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
 * /categorias-galeria/{id}:
 *   put:
 *     summary: Actualizar una categoría de galería
 *     tags: [Categorías de Galería]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la categoría de galería
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoriaGaleria'
 *     responses:
 *       200:
 *         description: Categoría de galería actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoriaGaleria'
 *       404:
 *         description: Categoría de galería no encontrada
 */
router.put('/categorias-galeria/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, imagen } = req.body;
  try {
    const categoriaActualizada = await prisma.categoriaGaleria.update({
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
 * /categorias-galeria/{id}:
 *   delete:
 *     summary: Eliminar una categoría de galería
 *     tags: [Categorías de Galería]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la categoría de galería
 *     responses:
 *       204:
 *         description: Categoría de galería eliminada exitosamente
 *       404:
 *         description: Categoría de galería no encontrada
 */
router.delete('/categorias-galeria/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.categoriaGaleria.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la categoría' });
  }
});

module.exports = router;
