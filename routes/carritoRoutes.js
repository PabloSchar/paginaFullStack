const express = require('express')
const routes = express.Router()
const carritoController = require('../controllers/carritoControler')

//Se usa para acceder a la pestaña del carrito
routes.get('/carrito', carritoController.getCart);

//Se usa para obtener el carrito de la persona
routes.get('/carrito/api', carritoController.api);

//Se usa para añadir un producto al carrito
routes.post('/carrito/add', carritoController.add);

//Se usa para actualizar la cantidad del producto en el carrito
routes.put('/carrito/api/:idProducto', carritoController.actualizarcantidad);

module.exports = routes