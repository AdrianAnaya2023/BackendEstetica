const express = require('express');
const prisma = require('../prisma/prismaClient');
const router = express.Router();

// Crear un nuevo producto
router.post('/', async (req, res) => {
  try {
    const { titulo, imagen, categoria_id, descripcion } = req.body;
    const nuevoProducto = await prisma.productos.create({
      data: {
        titulo,
        imagen,
        descripcion,
        categoria: {
          connect: { id: categoria_id },
        },
      },
    });
    // Convertir id de BigInt a String si es necesario
    res.status(201).json({ ...nuevoProducto, id: nuevoProducto.id.toString() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el producto', details: error.message });
  }
});

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const productos = await prisma.productos.findMany({
      include: { categoria: true },
    });
    // Convertir id de BigInt a String
    const modifiedProductos = productos.map(producto => ({
      ...producto,
      id: producto.id.toString(),
      categoria: producto.categoria ? { ...producto.categoria, id: producto.categoria.id.toString() } : null,
    }));
    res.json(modifiedProductos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos', details: error.message });
  }
});

// Obtener un producto por ID
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const producto = await prisma.productos.findUnique({
      where: { id },
      include: { categoria: true },
    });
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ ...producto, id: producto.id.toString(), categoria: producto.categoria ? { ...producto.categoria, id: producto.categoria.id.toString() } : null });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto', details: error.message });
  }
});

// Actualizar un producto
router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { titulo, imagen, categoria_id, descripcion } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const productoActualizado = await prisma.productos.update({
      where: { id },
      data: {
        titulo,
        imagen,
        descripcion,
        categoria: {
          connect: { id: categoria_id },
        },
      },
    });
    res.json({ ...productoActualizado, id: productoActualizado.id.toString() });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(500).json({ error: 'Error al actualizar el producto', details: error.message });
  }
});

// Eliminar un producto
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    await prisma.productos.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(500).json({ error: 'Error al eliminar el producto', details: error.message });
  }
});

module.exports = router;
