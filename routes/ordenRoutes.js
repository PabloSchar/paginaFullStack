const express = require('express')
const routes = express.Router()
const ordenController = require('../controllers/ordenController')

routes.post('/pedidos', ordenController.realizarPedido)

routes.get('/admin/pedidos', ordenController.pedidosget);
routes.get('/pedidos/getall', ordenController.pedidosgetall);

routes.post('/pedidos/marcar-entregado', ordenController.pedidosentregado);

routes.get('/pedidos/detalles/:idPedido', ordenController.abrirDetallesPedido);

routes.get('/api/pedidos/:idPedido', ordenController.obtenerDetallesPedido);

module.exports = routes