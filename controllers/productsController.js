const Product = require('../models/productsModel')
const Carrito = require('../models/carritoModel')
const path = require('path');

const products = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = 6;

    try {
        let query = Product.find({ productStock: { $gt: 0 } });

        const sortBy = req.query.sortBy || 'nameAsc';
        if (sortBy === 'nameAsc') {
            query = query.sort({ productName: 1 }); // Ordenar de A-Z
        } else if (sortBy === 'nameDesc') {
            query = query.sort({ productName: -1 }); // Ordenar de Z-A
        } else if (sortBy === 'priceascendente') {
            query = query.sort({ productPrice: -1 }); // Ordenar de mayor a menor
        } else if (sortBy === 'pricedescendente') {
            query = query.sort({ productPrice: 1 }); // Ordenar de menor a mayor
        }

        //busqueda por nombre
        const searchByName = req.query.searchByName;
        if (searchByName) {
            query = query.find({ productName: { $regex: new RegExp(`^${searchByName}`, 'i') } });
        }

        const products = await query
            .skip((page - 1) * perPage)
            .limit(perPage);

        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al recuperar productos' });
    }
};

const allproducts = async (req, res) => {
    try {
        const allProducts = await Product.find();
        res.json(allProducts);
    } catch (error) {
        res.status(500).json({ error: 'Error al recuperar todos los productos' });
    }
};

const productsaddnewpost = async (req,res)=>{
    try {
        const producto = await Product.create({
            productName: req.body.productName,
            productPrice: req.body.productPrice,
            productStock: req.body.productStock,
            productImage: req.body.productImage,
            productDescription: req.body.productDescription
        })

        res.status(201).json(producto);
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar un nuevo producto' });
    }
}

const productsCount = async (req, res) => {
    try {
        let query = { productStock: { $gt: 0 } };

        // en caso de que se busque un producto por nombre
        if (req.query.searchByName) {
            query = { ...query, productName: { $regex: new RegExp(`^${req.query.searchByName}`, 'i') } };
        }

        const count = await Product.countDocuments(query);
        res.send({ count });
    } catch (error) {
        res.status(500).json({ error: 'Error al contar los productos' });
    }
};

const productsaddnewget = async (req, res) => {
    res.sendFile(path.join(__dirname, '../views/products', 'productsaddnew.html'));
};

const productsdeleteget = async (req, res) => {
    res.sendFile(path.join(__dirname, '../views/products', 'deleteproduct.html'));
};

const productsdelete = async (req, res) => {
    const productId = req.params.productId;

    try {
        // Busca el producto por ID
        const productToDelete = await Product.findById(productId);

        if (!productToDelete) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // Busca y actualiza todos los carritos que contengan el producto a eliminar
        const updateCartResult = await Carrito.updateMany(
            { 'productos.productoId': productToDelete._id },
            {
                $pull: { 'productos': { productoId: productToDelete._id } },
                $inc: { total: -(productToDelete.productPrice * await findQuantity(productToDelete._id)) },
            }
        );

        // Elimina el producto
        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (deletedProduct) {
            return res.json({ message: 'Producto eliminado exitosamente' });
        } else {
            return res.status(500).json({ error: 'Error interno al eliminar el producto' });
        }
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        return res.status(500).json({ error: 'Error interno al eliminar el producto' });
    }
};

const findQuantity = async (productId) => {
    const carrito = await Carrito.findOne({ 'productos.productoId': productId });

    if (!carrito) {
        // Si no se encuentra el producto en ningún carrito, retorna cero
        return 0;
    }

    const productoEnCarrito = carrito.productos.find(item => item.productoId.equals(productId));

    // Si no hay una cantidad definida, retorna cero
    return productoEnCarrito ? productoEnCarrito.cantidad : 0;
};

const getProductStock = async (req, res) => {
    try {
        const productId = req.params.id;

        // Busca el producto en la base de datos
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Devolvuelve el stock del producto
        res.json({ productStock: product.productStock });
    } catch (error) {
        console.error('Error al obtener el stock del producto:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

const productseditget = async (req, res) => {
    res.sendFile(path.join(__dirname, '../views/products', 'editproduct.html'));
};

const productseditput = async (req, res) => {
    const productId = req.params.id;

    try {
        // Encuentra el producto por su ID antes de la actualización
        const productoAntes = await Product.findById(productId);

        if (!productoAntes) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Almacena el precio anterior antes de la actualización
        const precioAnterior = productoAntes.productPrice;

        // Valida que el stock y el precio no sean menores a 0
        if (req.body.productStock < 0 || req.body.productPrice < 0) {
            return res.status(400).json({ message: 'El stock y el precio deben ser mayores o iguales a 0' });
        }

        // Encuentra todos los carritos que contienen el producto
        const carritos = await Carrito.find({ 'productos.productoId': productoAntes._id });

        // Actualiza el producto con los nuevos valores
        productoAntes.productName = req.body.productName || productoAntes.productName;
        productoAntes.productStock = req.body.productStock || productoAntes.productStock;
        productoAntes.productPrice = req.body.productPrice || productoAntes.productPrice;
        productoAntes.productImage = req.body.productImage || productoAntes.productImage;
        productoAntes.productDescription = req.body.productDescription || productoAntes.productDescription;

        const productoActualizado = await productoAntes.save();

        // Actualiza el total de cada carrito afectado
        await Promise.all(carritos.map(async (carrito) => {
            const productoEnCarrito = carrito.productos.find(p => p.productoId.equals(productoAntes._id));
            if (productoEnCarrito) {
                // Resta el costo del producto antes de la actualización
                const costoAntes = precioAnterior * productoEnCarrito.cantidad;
                // Suma el costo del producto después de la actualización
                const costoDespues = productoActualizado.productPrice * productoEnCarrito.cantidad;
                // Actualiza el total del carrito
                carrito.total += costoDespues - costoAntes;
                await carrito.save();
            }
        }));

        res.json({ message: 'Producto actualizado con éxito', producto: productoActualizado });
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

const getdetalles = async (req, res) => {
    res.sendFile(path.join(__dirname, '../views/products', 'detallesproducts.html'));
};

const senddetails = async (req, res) => {
    try {
        const productId = req.params.productId;
    
        const product = await Product.findById(productId);
    
        if (!product) {
          return res.status(404).json({ error: 'Producto no encontrado' });
        }
    
        res.json(product);
    } catch (error) {
    console.error('Error al obtener detalles del producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    products:products,
    allproducts:allproducts,
    productsaddnewpost:productsaddnewpost,
    productsCount:productsCount,
    productsaddnewget:productsaddnewget,
    productsdeleteget:productsdeleteget,
    productsdelete:productsdelete,
    getProductStock:getProductStock,
    productseditget:productseditget,
    productseditput:productseditput,
    getdetalles:getdetalles,
    senddetails:senddetails
}