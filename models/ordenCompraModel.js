const mongoose = require('mongoose');

const ordenCompraSchema = new mongoose.Schema({
    usuarioEmail: {
        type: String,
        required: true,
    },
    productos: [
        {
            nombre: {
                type: String,
                required: true,
            },
            imagen: {
                type: String,
                required: true,
            },
            precio: {
                type: Number,
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