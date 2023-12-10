const express = require('express')
const routes = express.Router()
const productsControllers = require('../controllers/productsController')

routes.get('/products', productsControllers.products)
routes.get('/allproducts', productsControllers.allproducts)

//Se usa para obtener el total de los productos para mostrar en la home(depende de los filtros)
routes.get('/products/count', productsControllers.productsCount);

//Se usa para acceder a la pestaña de añadir un nuevo producto(admin)
routes.get('/products/addnew', productsControllers.productsaddnewget)

//Se usa para añadir el producto(admin)
routes.post('/products/addnew', productsControllers.productsaddnewpost)

//Se usa para acceder a la pestaña de editar un producto(admin)
routes.get('/products/edit', productsControllers.productseditget)

//Se usa para editar el producto(admin)
routes.put('/products/updateproduct/:id', productsControllers.productseditput)

//Se usa para acceder a la pestaña de borrar un producto(admin)
routes.get('/products/deleteproduct', productsControllers.productsdeleteget)

//Se usa para eliminar el producto(admin)
routes.delete('/products/deleteproduct/:productId', productsControllers.productsdelete)

//Se usa para devolver el stock del producto
routes.get('/products/:id', productsControllers.getProductStock);

//Se usa para acceder a la pestaña de los detalles del producto
routes.get('/products/detalles/:id', productsControllers.getdetalles);

//Se usa para obtener los detalles del producto
routes.get('/products/api/details/:productId', productsControllers.senddetails);

module.exports = routes