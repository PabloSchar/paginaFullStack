document.addEventListener("DOMContentLoaded", async () => {
    const headerContainer = document.getElementById('header-container');
    const productImageContainer = document.querySelector('.product-image');
    const productDetailsContainer = document.querySelector('.product-details');

    // Fetch para obtener el contenido del archivo header.html
    fetch('/header/html/header.html')
        .then(response => response.text())
        .then(html => {
            headerContainer.innerHTML = html;

            const carritoLink = document.getElementById('carritoLink');
            const perfilLink = document.getElementById('perfilLink');

            const token = localStorage.getItem('token');

            // Actualiza los enlaces según la autenticación
            if (token) {
                carritoLink.href = 'http://localhost:3000/carrito';
                perfilLink.href = 'http://localhost:3000/user/perfil';
            } else {
                carritoLink.href = 'http://localhost:3000/user/login';
                perfilLink.href = 'http://localhost:3000/user/login';
            }
        })
        .catch(error => console.error('Error al cargar el encabezado:', error));

    const productId = obtenerIdProductoDesdeURL();

    if (productId) {
        // Realiza una solicitud al servidor para obtener los detalles del producto por su ID
        try {
            const response = await fetch(`http://localhost:3000/products/api/details/${productId}`);
            const productDetails = await response.json();

            // Llama a la función para mostrar los detalles del producto
            displayProductDetails(productDetails);
        } catch (error) {
            console.error('Error al obtener los detalles del producto:', error);
        }
    } else {
        console.error('ID del producto no encontrado en la URL');
    }

    // Función para mostrar los detalles del producto
    function displayProductDetails(product) {
        productImageContainer.innerHTML = '';
        productDetailsContainer.innerHTML = '';

        const productImage = document.createElement('img');
        productImage.src = product.productImage;
        productImage.alt = `Imagen de ${product.productName}`;
        productImageContainer.appendChild(productImage);

        const productName = document.createElement('h2');
        productName.textContent = product.productName;

        const productStock = document.createElement('p');
        productStock.textContent = `Stock: ${product.productStock}`;

        const productDescription = document.createElement('p');
        productDescription.textContent = `Descripción: ${product.productDescription}`;

        const productPrice = document.createElement('p');
        productPrice.textContent = `Precio: $${product.productPrice.toFixed(2)}`;

        const addToCartButton = document.createElement('button');
        addToCartButton.textContent = 'Añadir al Carrito';
        addToCartButton.classList.add('btn', 'btn-primary', 'mt-3');

        addToCartButton.addEventListener('click', function () {
            addToCart(product);
        });

        productDetailsContainer.appendChild(productName);
        productDetailsContainer.appendChild(productStock);
        productDetailsContainer.appendChild(productDescription);
        productDetailsContainer.appendChild(productPrice);
        productDetailsContainer.appendChild(addToCartButton);
    }
});

// Función para obtener el ID del pedido desde la URL
const obtenerIdProductoDesdeURL = () => {
    try {
        // Obtiene la última parte de la URL como el ID del pedido
        const urlParts = window.location.pathname.split('/');
        const idProducto = urlParts[urlParts.length - 1];
        return idProducto;
    } catch (error) {
        console.error('Error al obtener el ID del pedido desde la URL:', error);
        return null;
    }
};

function addToCart(product) {
    const token = localStorage.getItem('token');

    if (token) {
        const productData = {
            productId: product._id,
            productPrice: product.productPrice,
            productStock: product.productStock,
        };

        fetch('http://localhost:3000/carrito/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            body: JSON.stringify(productData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al añadir el producto al carrito');
            }
            return response.json();
        })
        .then(data => {
            console.error('Producto añadido al carrito: ' + product.productName);
        })
        .catch(error => {
            console.error('Error al añadir el producto al carrito:', error);
        });
    } else {
        // Si el usuario no está autenticado, se redirige a la página de inicio de sesión
        window.location.href = 'http://localhost:3000/user/login';
    }
}
