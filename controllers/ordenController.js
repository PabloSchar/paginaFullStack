const OrdenCompra = require('../models/ordenCompraModel');
const Producto = require('../models/productsModel');
const Carrito = require('../models/carritoModel')
const userUtils = require('../utils/userUtils')

const realizarPedido = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const correo = userUtils.verifyTokenSendEmail(token);

        if (!correo) {
            return res.status(401).json({ message: 'Token inválido o usuario no autenticado.' });
        }

        const { productos, total } = req.body;

        // Guarda el pedido en la base de datos
        const nuevoPedido = new OrdenCompra({ usuarioEmail: correo, productos, total });
        await nuevoPedido.save();

        for (const productoPedido of productos) {
            const productoBD = await Producto.findById(productoPedido.productoId);

            if (!productoBD) {
                console.error(`Producto con ID ${productoPedido.productoId} no encontrado.`);
                continue;
            }

            // Actualizar el stock del producto restando la cantidad del pedido
            productoBD.productStock -= productoPedido.cantidad;

            await productoBD.save();

            const carritosConProducto = await Carrito.find({ 'productos.productoId': productoPedido.productoId });

            // Actualizar la cantidad del producto en cada carrito
            for (const carrito of carritosConProducto) {
                const productoEnCarrito = carrito.productos.find(item => item.productoId.equals(productoPedido.productoId));

                if (productoEnCarrito) {
                    // Actualizar la cantidad del producto en el carrito según el nuevo stock disponible
                    productoEnCarrito.cantidad = Math.min(productoEnCarrito.cantidad, productoBD.productStock);

                    // Guardar los cambios en el carrito
                    await carrito.save();
                }
            }
        }

        const carritoUsuario = await Carrito.findOne({ usuarioEmail: correo });

        if (carritoUsuario) {
            // Eliminar todos los productos del carrito
            carritoUsuario.productos = [];
            carritoUsuario.total = 0;
        
            await carritoUsuario.save();
        }

        res.status(201).json({ message: 'Pedido realizado con éxito', pedido: nuevoPedido });
    } catch (error) {
        console.error('Error al crear el pedido:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

module.exports = {
    realizarPedido:realizarPedido
}