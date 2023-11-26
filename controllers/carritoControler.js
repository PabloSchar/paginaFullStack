const Carrito = require('../models/carritoModel')
const Producto = require('../models/productsModel');
const userUtils = require('../utils/userUtils')
const path = require('path');

const getCart = async (req, res) => {
    res.sendFile(path.join(__dirname, '../views/carrito', 'carrito.html'));
};

const api = async (req, res) => {
    try {
        const token = req.headers.authorization;
    
        // Verifica el token y extrae el correo del usuario
        const correo = userUtils.verifyTokenSendEmail(token);
    
        if (!correo) {
            return res.status(401).json({ message: 'Token inválido o usuario no autenticado.' });
        }
    
        // Obtengo los productos asociados al correo del usuario
        const carrito = await Carrito.findOne({ usuarioEmail: correo })
            .populate('productos.productoId');
    
        if (!carrito) {
            return res.status(404).json({ message: 'No se encontró el carrito para el usuario.' });
        }
    
        res.status(200).json({ productos: carrito.productos, total: carrito.total });
    } catch (error) {
        console.error('Error al procesar la solicitud del carrito:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

const add = async (req, res) => {
    try {
        const { productId, productPrice, productStock } = req.body;
        const token = req.headers.authorization;
        const correo = userUtils.verifyTokenSendEmail(token);

        if (!correo) {
            return res.status(401).json({ message: 'Token inválido o usuario no autenticado.' });
        }

        let carrito = await Carrito.findOne({ usuarioEmail: correo });

        // Agrega el producto al carrito o actualiza la cantidad si ya está en el carrito y no supera el stock disponible
        const existingProduct = carrito.productos.find(product => product.productoId.toString() === productId);
        if (existingProduct) {
            if (existingProduct.cantidad != productStock){
                existingProduct.cantidad += 1;
            }
            else{
                res.status(403).json({ message: 'Stock insuficiente' });
                return;
            }
        } else {
            carrito.productos.push({ productoId: productId, cantidad: 1 });
        }

        // Actualiza el total del carrito sumando el precio del producto
        carrito.total += productPrice;

        await carrito.save();

        res.status(200).json({ message: 'Producto añadido al carrito correctamente' });
    } catch (error) {
        console.error('Error al añadir producto al carrito:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

const actualizarcantidad = async (req, res) => {
    try {
        const idProducto = req.params.idProducto;
        const nuevaCantidad = req.body.cantidad;

        // Buscar el producto en el carrito
        const carrito = await Carrito.findOne({ 'productos.productoId': idProducto });

        if (!carrito) {
            return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
        }

        // Busca el índice del producto en el carrito
        const index = carrito.productos.findIndex(item => item.productoId.equals(idProducto));

        // Obtiene el producto actual en el carrito
        const productoActual = carrito.productos[index];

        const productoBD = await Producto.findById(idProducto);

        if (!productoBD) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Verifica si la nueva cantidad es válida (no excede el stock disponible)
        if (nuevaCantidad > productoBD.productStock) {
            return res.status(400).json({ message: 'Cantidad excede el stock disponible' });
        }

        const cantidadAnterior = productoActual.cantidad;

        productoActual.cantidad = nuevaCantidad;

        carrito.total += (nuevaCantidad - cantidadAnterior) * productoBD.productPrice;

        // Si la nueva cantidad es 0, elimina el producto del carrito
        if (nuevaCantidad === 0) {
            carrito.productos.splice(index, 1);
        }

        await carrito.save();

        res.json({ message: 'Cantidad actualizada correctamente' });
    } catch (error) {
        console.error('Error al actualizar la cantidad del producto en el carrito:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

module.exports = {
    getCart:getCart,
    api:api,
    add:add,
    actualizarcantidad:actualizarcantidad
}