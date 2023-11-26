const mongoose = require('mongoose');

const carritoSchema = new mongoose.Schema({
    usuarioEmail: { type: String, required: true },
    productos: [
        {
        productoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Referencia al producto
        cantidad: { type: Number, required: true },
        }
    ],
    total: { type: Number, default: 0 },
});

const Carrito = mongoose.model('Carrito', carritoSchema);

module.exports = Carrito;