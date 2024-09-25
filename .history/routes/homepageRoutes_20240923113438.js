// routes/homepageRoutes.js
const express = require('express');
const prisma = require('../prisma/prismaClient');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Homepage:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID del registro de homepage
 *         descripcion:
 *           type: string
 *           description: Descripción del contenido del homepage
 *         foto_dueno:
 *           type: string
 *           description: URL de la foto del dueño
 *         fotos_local:
 *           type: array
 *           items:
 *             type: string
 *           description: URLs de las fotos del local
 */

/**
 * @swagger
 * /homepage:
 *   post:
 *     summary: Crear un nuevo registro en Homepage
 *     tags: [Homepage]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Homepage'
 *     responses:
 *       201:
 *         description: Registro de homepage creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Homepage'
 */
router.post('/homepage', async (req, res) => {
  const { descripcion, foto_dueno, fotos_local } = req.body;
  try {
    const nuevoHomepage = await prisma.homepage.create({
      data: { descripcion, foto_dueno, fotos_local },
    });
    res.status(201).json(nuevoHomepage);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el registro de homepage', details: error.message });
  }
});

/**
 * @swagger
 * /homepage:
 *   get:
 *     summary: Obtener todos los registros de Homepage
 *     tags: [Homepage]
 *     responses:
 *       200:
 *         description: Lista de registros de homepage
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Homepage'
 */
router.get('/homepage', async (req, res) => {
  try {
    const homepage = await prisma.homepage.findMany();
    res.json(homepage);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los registros de homepage' });
  }
});

/**
 * @swagger
 * /homepage/{id}:
 *   get:
 *     summary: Obtener un registro de Homepage por ID
 *     tags: [Homepage]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del registro de homepage
 *     responses:
 *       200:
 *         description: Registro de homepage encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Homepage'
 *       404:
 *         description: Registro de homepage no encontrado
 */
router.get('/homepage/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const homepage = await prisma.homepage.findUnique({
      where: { id: parseInt(id) },
    });
    if (!homepage) return res.status(404).json({ error: 'Registro de homepage no encontrado' });
    res.json(homepage);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el registro de homepage' });
  }
});

/**
 * @swagger
 * /homepage/{id}:
 *   put:
 *     summary: Actualizar un registro de Homepage
 *     tags: [Homepage]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del registro de homepage
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Homepage'
 *     responses:
 *       200:
 *         description: Registro de homepage actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Homepage'
 *       404:
 *         description: Registro de homepage no encontrado
 */
router.put('/homepage/:id', async (req, res) => {
  const { id } = req.params;
  const { descripcion, foto_dueno, fotos_local } = req.body;
  try {
    const homepageActualizado = await prisma.homepage.update({
      where: { id: parseInt(id) },
      data: { descripcion, foto_dueno, fotos_local },
    });
    res.json(homepageActualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el registro de homepage', details: error.message });
  }
});

/**
 * @swagger
 * /homepage/{id}:
 *   delete:
 *     summary: Eliminar un registro de Homepage
 *     tags: [Homepage]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del registro de homepage
 *     responses:
 *       204:
 *         description: Registro de homepage eliminado exitosamente
 *       404:
 *         description: Registro de homepage no encontrado
 */
router.delete('/homepage/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.homepage.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el registro de homepage', details: error.message });
  }
});

module.exports = router;
