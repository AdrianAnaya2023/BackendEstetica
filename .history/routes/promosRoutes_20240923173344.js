const express = require('express');
const prisma = require('../prisma/prismaClient');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Promo:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID de la promo
 *         foto:
 *           type: string
 *           description: URL de la foto de la promo
 *         titulo:
 *           type: string
 *           description: Título de la promo
 *         descripcion:
 *           type: string
 *           description: Descripción de la promo
 *         fecha_fin:
 *           type: string
 *           format: date-time
 *           description: Fecha de finalización de la promo
 */

/**
 * @swagger
 * /:
 *   post:
 *     summary: Crear una nueva promo
 *     tags: [Promos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Promo'
 *     responses:
 *       201:
 *         description: Promo creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Promo'
 */
router.post('/', async (req, res) => {
  const { foto, titulo, descripcion, fecha_fin } = req.body;
  if (!foto || !titulo || !descripcion || !fecha_fin) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }
  try {
    const fechaFin = new Date(fecha_fin);
    if (isNaN(fechaFin.getTime())) {
      return res.status(400).json({ error: 'Fecha de finalización inválida' });
    }
    const nuevaPromo = await prisma.promos.create({
      data: { foto, titulo, descripcion, fecha_fin: fechaFin },
    });
    res.status(201).json(nuevaPromo);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la promo', details: error.message });
  }
});

/**
 * @swagger
 * /:
 *   get:
 *     summary: Obtener todas las promos
 *     tags: [Promos]
 *     responses:
 *       200:
 *         description: Lista de promos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Promo'
 */
router.get('/', async (req, res) => {
  try {
    const promos = await prisma.promos.findMany();
    res.json(promos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las promos' });
  }
});

/**
 * @swagger
 * /{id}:
 *   get:
 *     summary: Obtener una promo por ID
 *     tags: [Promos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la promo
 *     responses:
 *       200:
 *         description: Promo encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Promo'
 *       404:
 *         description: Promo no encontrada
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const promo = await prisma.promos.findUnique({
      where: { id: parseInt(id) },
    });
    if (!promo) {
      return res.status(404).json({ error: 'Promo no encontrada' });
    }
    res.json(promo);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la promo' });
  }
});

/**
 * @swagger
 * /{id}:
 *   put:
 *     summary: Actualizar una promo
 *     tags: [Promos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la promo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Promo'
 *     responses:
 *       200:
 *         description: Promo actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Promo'
 *       404:
 *         description: Promo no encontrada
 */
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { foto, titulo, descripcion, fecha_fin } = req.body;
  try {
    const fechaFin = new Date(fecha_fin);
    if (isNaN(fechaFin.getTime())) {
      return res.status(400).json({ error: 'Fecha de finalización inválida' });
    }
    const promoActualizada = await prisma.promos.update({
      where: { id: parseInt(id) },
      data: { foto, titulo, descripcion, fecha_fin: fechaFin },
    });
    res.json(promoActualizada);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Promo no encontrada' });
    }
    res.status(500).json({ error: 'Error al actualizar la promo', details: error.message });
  }
});

/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: Eliminar una promo
 *     tags: [Promos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la promo
 *     responses:
 *       204:
 *         description: Promo eliminada exitosamente
 *       404:
 *         description: Promo no encontrada
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.promos.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Promo no encontrada' });
    }
    res.status(500).json({ error: 'Error al eliminar la promo', details: error.message });
  }
});

module.exports = router;
