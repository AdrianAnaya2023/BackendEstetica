const express = require('express');
const prisma = require('../prisma/prismaClient');
const router = express.Router();

// Middleware para validar los datos de un producto
function validateProductData(req, res, next) {
  const { titulo, imagen, categoria_id, descripcion } = req.body;
  if (!titulo || !imagen || !categoria_id || !descripcion) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }
  next();
}

// Crear un nuevo producto
router.post('/', validateProductData, async (req, res) => {
  try {
    const { titulo, imagen, categoria_id, descripcion } = req.body;
    const nuevoProducto = await prisma.productos.create({
      data: {
        titulo,
        imagen,
        descripcion,
        categoria: {
          connect: { id: BigInt(categoria_id) },
        },
      },
    });
    // Convertir BigInt a string
    res.status(201).json({ 
      ...nuevoProducto, 
      id: nuevoProducto.id.toString(), 
      categoria_id: nuevoProducto.categoria_id.toString() 
    });
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
    // Convertir BigInt a string
    const modifiedProductos = productos.map((producto) => ({
      ...producto,
      id: producto.id.toString(),
      categoria_id: producto.categoria_id.toString(),
      categoria: producto.categoria
        ? { ...producto.categoria, id: producto.categoria.id.toString() }
        : null,
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
      where: { id: BigInt(id) },
      include: { categoria: true },
    });
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    // Convertir BigInt a string
    res.json({
      ...producto,
      id: producto.id.toString(),
      categoria_id: producto.categoria_id.toString(),
      categoria: producto.categoria
        ? { ...producto.categoria, id: producto.categoria.id.toString() }
        : null,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto', details: error.message });
  }
});

// Actualizar un producto
router.put('/:id', validateProductData, async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  const { titulo, imagen, categoria_id, descripcion } = req.body;

  try {
    const productoActualizado = await prisma.productos.update({
      where: { id: BigInt(id) },
      data: {
        titulo,
        imagen,
        descripcion,
        categoria: {
          connect: { id: BigInt(categoria_id) },
        },
      },
    });
    // Convertir BigInt a string
    res.json({ 
      ...productoActualizado, 
      id: productoActualizado.id.toString(), 
      categoria_id: productoActualizado.categoria_id.toString() 
    });
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
      where: { id: BigInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(500).json({ error: 'Error al eliminar el producto', details: error.message });
  }
});

// Obtener productos por categoría
router.get('/categoria/:categoriaId', async (req, res) => {
  const categoriaId = parseInt(req.params.categoriaId);
  if (isNaN(categoriaId)) {
    return res.status(400).json({ error: 'ID de categoría inválido' });
  }

  try {
    const productos = await prisma.productos.findMany({
      where: { categoria_id: BigInt(categoriaId) },
      include: { categoria: true },
    });
    // Convertir BigInt a string
    const modifiedProductos = productos.map((producto) => ({
      ...producto,
      id: producto.id.toString(),
      categoria_id: producto.categoria_id.toString(),
      categoria: producto.categoria
        ? { ...producto.categoria, id: producto.categoria.id.toString() }
        : null,
    }));
    res.json(modifiedProductos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos por categoría', details: error.message });
  }
});

module.exports = router;
