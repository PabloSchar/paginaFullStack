const Product = require('../models/productsModel')
const path = require('path');

const products = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = 6;

    try {
        const products = await Product.find({ productStock: { $gt: 0 } })
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
        const count = await Product.countDocuments();
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
        // Encuentra el producto por ID y lo elimina
        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (deletedProduct) {
        res.json({ message: 'Producto eliminado exitosamente' });
        } else {
        res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ error: 'Error interno al eliminar el producto' });
    }
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
        // Encuentra el producto por su ID
        const producto = await Product.findById(productId);

        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Validar que el stock y el precio no sean menores a 0
        if (req.body.productStock < 0 || req.body.productPrice < 0) {
            return res.status(400).json({ message: 'El stock y el precio deben ser mayores o iguales a 0' });
        }

        // Actualiza los campos con los nuevos valores
        producto.productName = req.body.productName || producto.productName;
        producto.productStock = req.body.productStock || producto.productStock;
        producto.productPrice = req.body.productPrice || producto.productPrice;
        producto.productImage = req.body.productImage || producto.productImage;
        producto.productDescription = req.body.productDescription || producto.productDescription;

        const productoActualizado = await producto.save();

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