// routes/categoriaConsejosRoutes.js
const express = require('express');
const prisma = require('../prisma/prismaClient');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     CategoriaConsejos:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID de la categoría de consejos
 *         nombre:
 *           type: string
 *           description: Nombre de la categoría de consejos
 *         descripcion:
 *           type: string
 *           description: Descripción de la categoría de consejos
 *         imagen:
 *           type: string
 *           description: URL de la imagen de la categoría de consejos
 */

/**
 * @swagger
 * /categorias-consejos:
 *   post:
 *     summary: Crear una nueva categoría de consejos
 *     tags: [Categorías de Consejos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoriaConsejos'
 *     responses:
 *       201:
 *         description: Categoría de consejos creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoriaConsejos'
 */
router.post('/categorias-consejos', async (req, res) => {
  const { nombre, descripcion, imagen } = req.body;
  try {
    const nuevaCategoria = await prisma.categoriaConsejos.create({
      data: { nombre, descripcion, imagen },
    });
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la categoría de consejos' });
  }
});

/**
 * @swagger
 * /categorias-consejos:
 *   get:
 *     summary: Obtener todas las categorías de consejos
 *     tags: [Categorías de Consejos]
 *     responses:
 *       200:
 *         description: Lista de categorías de consejos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CategoriaConsejos'
 */
router.get('/categorias-consejos', async (req, res) => {
  try {
    const categorias = await prisma.categoriaConsejos.findMany();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las categorías de consejos' });
  }
});

/**
 * @swagger
 * /categorias-consejos/{id}:
 *   get:
 *     summary: Obtener una categoría de consejos por ID
 *     tags: [Categorías de Consejos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la categoría de consejos
 *     responses:
 *       200:
 *         description: Categoría de consejos encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoriaConsejos'
 *       404:
 *         description: Categoría de consejos no encontrada
 */
router.get('/categorias-consejos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const categoria = await prisma.categoriaConsejos.findUnique({
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
 * /categorias-consejos/{id}:
 *   put:
 *     summary: Actualizar una categoría de consejos
 *     tags: [Categorías de Consejos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la categoría de consejos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoriaConsejos'
 *     responses:
 *       200:
 *         description: Categoría de consejos actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoriaConsejos'
 *       404:
 *         description: Categoría de consejos no encontrada
 */
router.put('/categorias-consejos/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, imagen } = req.body;
  try {
    const categoriaActualizada = await prisma.categoriaConsejos.update({
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
 * /categorias-consejos/{id}:
 *   delete:
 *     summary: Eliminar una categoría de consejos
 *     tags: [Categorías de Consejos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la categoría de consejos
 *     responses:
 *       204:
 *         description: Categoría de consejos eliminada exitosamente
 *       404:
 *         description: Categoría de consejos no encontrada
 */
router.delete('/categorias-consejos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.categoriaConsejos.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la categoría' });
  }
});

module.exports = router;
