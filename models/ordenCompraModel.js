const mongoose = require('mongoose');

const ordenCompraSchema = new mongoose.Schema({
    usuarioEmail: {
        type: String,
        required: true,
    },
    productos: [
        {
            productoId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Producto', // Referencia al modelo de productos
                required: true,
            },
            cantidad: {
                type: Number,
                required: true,
            },
        },
    ],
    total: {
        type: Number,
        required: true,
    },
    estado: {
        type: String,
        default: 'pendiente',
    },
    fecha: {
        type: Date,
        default: Date.now,
    },
});

const OrdenCompra = mongoose.model('OrdenCompra', ordenCompraSchema);

module.exports = OrdenCompra;