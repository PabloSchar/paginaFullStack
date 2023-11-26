const Carrito = require('../models/carritoModel')
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

module.exports = {
    getCart:getCart,
    api:api,
    add:add
}