const express = require('express')
const routes = express.Router()
const productsControllers = require('../controllers/productsController')

routes.get('/products', productsControllers.products)
routes.get('/allproducts', productsControllers.allproducts)

routes.get('/products/count', productsControllers.productsCount);

routes.get('/products/addnew', productsControllers.productsaddnewget)

routes.post('/products/addnew', productsControllers.productsaddnewpost)

routes.get('/products/edit', productsControllers.productseditget)

routes.put('/products/updateproduct/:id', productsControllers.productseditput)

routes.get('/products/deleteproduct', productsControllers.productsdeleteget)

routes.delete('/products/deleteproduct/:productId', productsControllers.productsdelete)

routes.get('/products/:id', productsControllers.getProductStock);

module.exports = routes