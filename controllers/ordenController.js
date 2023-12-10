const OrdenCompra = require('../models/ordenCompraModel');
const Producto = require('../models/productsModel');
const Carrito = require('../models/carritoModel')
const userUtils = require('../utils/userUtils')
const path = require('path');

const realizarPedido = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const correo = userUtils.verifyTokenSendEmail(token);

        if (!correo) {
            return res.status(401).json({ message: 'Token inválido o usuario no autenticado.' });
        }

        const { productos, total } = req.body;

        // Guarda el pedido en la base de datos
        const detallesProductos = productos.map(producto => ({
            nombre: producto.productoId.productName,
            imagen: producto.productoId.productImage,
            precio: producto.productoId.productPrice,
            cantidad: producto.cantidad,
        }));
        const nuevoPedido = new OrdenCompra({ usuarioEmail: correo, productos: detallesProductos, total });
        await nuevoPedido.save();

        for (const productoPedido of productos) {
            const productoBD = await Producto.findById(productoPedido.productoId);

            if (!productoBD) {
                console.error(`Producto con ID ${productoPedido.productoId} no encontrado.`);
                continue;
            }

            // Actualiza el stock del producto restando la cantidad del pedido
            productoBD.productStock -= productoPedido.cantidad;

            await productoBD.save();

            const carritosConProducto = await Carrito.find({ 'productos.productoId': productoPedido.productoId });

            // Actualiza la cantidad del producto en cada carrito
            for (const carrito of carritosConProducto) {
                const productoEnCarrito = carrito.productos.find(item => item.productoId.equals(productoPedido.productoId));

                if (productoEnCarrito) {
                    // Actualiza la cantidad del producto en el carrito según el nuevo stock disponible
                    productoEnCarrito.cantidad = Math.min(productoEnCarrito.cantidad, productoBD.productStock);

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

const pedidosget = async (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pedidos', 'pedidos.html'));
};

const pedidosgetall = async (req, res) => {
    try {
        const pedidos = await OrdenCompra.find();
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los pedidos' });
    }
};

const pedidosentregado = async (req, res) => {
    const pedidosIds = req.body.pedidosIds;

    try {
        // Actualiza los pedidos en la base de datos
        await OrdenCompra.updateMany({ _id: { $in: pedidosIds } }, { $set: { estado: 'entregado' } });

        res.status(200).json({ message: 'Pedidos marcados como entregados exitosamente.' });
    } catch (error) {
        console.error('Error al marcar como entregado los pedidos:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

const abrirDetallesPedido = async (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pedidos', 'detallesPedido.html'));
};

const obtenerDetallesPedido = async (req, res) => {
    const idPedido = req.params.idPedido;

    try {
        const detallesPedido = await OrdenCompra.findById(idPedido);

        if (detallesPedido) {
            const productosConDetalles = detallesPedido.productos.map((producto) => ({
                nombre: producto.nombre,
                imagen: producto.imagen,
                cantidad: producto.cantidad,
            }));

            // Crea una copia de los detalles del pedido para no modificar el original
            const detallesPedidoConProductos = { ...detallesPedido.toObject() };
            
            detallesPedidoConProductos.productos = productosConDetalles;

            res.json(detallesPedidoConProductos);
        } else {
            res.status(404).json({ error: 'Pedido no encontrado' });
        }
    } catch (error) {
        console.error('Error al manejar la solicitud:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


module.exports = {
    realizarPedido:realizarPedido,
    pedidosget:pedidosget,
    pedidosgetall:pedidosgetall,
    pedidosentregado:pedidosentregado,
    abrirDetallesPedido:abrirDetallesPedido,
    obtenerDetallesPedido:obtenerDetallesPedido
}