const express = require('express');
const prisma = require('../prisma/prismaClient');
const router = express.Router();

function validatePromoData(req, res, next) {
    const { foto, titulo, descripcion, fecha_fin } = req.body;
    if (!foto || !titulo || !descripcion || !fecha_fin) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }
    const fechaFin = new Date(fecha_fin);
    if (isNaN(fechaFin.getTime())) {
        return res.status(400).json({ error: 'Fecha de finalización inválida' });
    }
    req.promoData = { foto, titulo, descripcion, fecha_fin: fechaFin };
    next();
}

router.post('/', validatePromoData, async (req, res) => {
    try {
        const nuevaPromo = await prisma.promos.create({ data: req.promoData });
        res.status(201).json(nuevaPromo);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la promo', details: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const promos = await prisma.promos.findMany();
        res.json(promos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las promos' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const promo = await prisma.promos.findUnique({ where: { id: parseInt(req.params.id) } });
        if (!promo) {
            return res.status(404).json({ error: 'Promo no encontrada' });
        }
        res.json(promo);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la promo' });
    }
});

router.put('/:id', validatePromoData, async (req, res) => {
    try {
        const promoActualizada = await prisma.promos.update({
            where: { id: parseInt(req.params.id) },
            data: req.promoData
        });
        res.json(promoActualizada);
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Promo no encontrada' });
        }
        res.status(500).json({ error: 'Error al actualizar la promo', details: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await prisma.promos.delete({ where: { id: parseInt(req.params.id) } });
        res.status(204).send();
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Promo no encontrada' });
        }
        res.status(500).json({ error: 'Error al eliminar la promo', details: error.message });
    }
});

module.exports = router;
