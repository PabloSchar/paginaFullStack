const express = require('express')
const routes = express.Router()
const carritoController = require('../controllers/carritoControler')

routes.get('/carrito', carritoController.getCart);
routes.get('/carrito/api', carritoController.api);

routes.post('/carrito/add', carritoController.add);

module.exports = routes