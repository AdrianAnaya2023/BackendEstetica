// routes/serviciosRoutes.js
const express = require('express');
const prisma = require('../prisma/prismaClient');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Servicio:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID del servicio
 *         titulo:
 *           type: string
 *           description: Título del servicio
 *         descripcion:
 *           type: string
 *           description: Descripción del servicio
 *         imagen:
 *           type: string
 *           description: URL de la imagen del servicio
 *         categoria_id:
 *           type: integer
 *           description: ID de la categoría asociada al servicio
 */

/**
 * @swagger
 * /servicios:
 *   post:
 *     summary: Crear un nuevo servicio
 *     tags: [Servicios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Servicio'
 *     responses:
 *       201:
 *         description: Servicio creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Servicio'
 */
router.post('/servicios', async (req, res) => {
  const { titulo, descripcion, imagen, categoria_id } = req.body;
  try {
    const nuevoServicio = await prisma.servicios.create({
      data: { titulo, descripcion, imagen, categoria_id },
    });
    res.status(201).json(nuevoServicio);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el servicio' });
  }
});

/**
 * @swagger
 * /servicios:
 *   get:
 *     summary: Obtener todos los servicios
 *     tags: [Servicios]
 *     responses:
 *       200:
 *         description: Lista de servicios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Servicio'
 */
router.get('/servicios', async (req, res) => {
  try {
    const servicios = await prisma.servicios.findMany({ include: { categoria: true } });
    res.json(servicios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los servicios' });
  }
});

/**
 * @swagger
 * /servicios/{id}:
 *   get:
 *     summary: Obtener un servicio por ID
 *     tags: [Servicios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del servicio
 *     responses:
 *       200:
 *         description: Servicio encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Servicio'
 *       404:
 *         description: Servicio no encontrado
 */
router.get('/servicios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const servicio = await prisma.servicios.findUnique({
      where: { id: parseInt(id) },
      include: { categoria: true },
    });
    if (!servicio) return res.status(404).json({ error: 'Servicio no encontrado' });
    res.json(servicio);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el servicio' });
  }
});

/**
 * @swagger
 * /servicios/{id}:
 *   put:
 *     summary: Actualizar un servicio
 *     tags: [Servicios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del servicio
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Servicio'
 *     responses:
 *       200:
 *         description: Servicio actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Servicio'
 *       404:
 *         description: Servicio no encontrado
 */
router.put('/servicios/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, imagen, categoria_id } = req.body;
  try {
    const servicioActualizado = await prisma.servicios.update({
      where: { id: parseInt(id) },
      data: { titulo, descripcion, imagen, categoria_id },
    });
    res.json(servicioActualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el servicio' });
  }
});

/**
 * @swagger
 * /servicios/{id}:
 *   delete:
 *     summary: Eliminar un servicio
 *     tags: [Servicios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del servicio
 *     responses:
 *       204:
 *         description: Servicio eliminado exitosamente
 *       404:
 *         description: Servicio no encontrado
 */
router.delete('/servicios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.servicios.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el servicio' });
  }
});

module.exports = router;
