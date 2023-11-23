document.addEventListener('DOMContentLoaded', function () {
    const headerContainer = document.getElementById('header-container');

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

    const addProductForm = document.getElementById('addProductForm');

    addProductForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const productName = document.getElementById('productName').value;
        const productPrice = document.getElementById('productPrice').value;
        const productStock = document.getElementById('productStock').value;
        const productImage = document.getElementById('productImage').value;
        const productDescription = document.getElementById('productDescription').value;

        try {
            const response = await fetch('http://localhost:3000/products/addnew', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productName: productName,
                    productPrice: productPrice,
                    productStock: productStock,
                    productImage: productImage,
                    productDescription: productDescription,
                }),
            });

            if (response.ok) {
                const addedProduct = await response.json();
                console.log('Producto agregado:', addedProduct);

            } else {
                console.error('Error al agregar el producto');
            }
        } catch (error) {
            console.error('Error de red:', error);
        }
    });
});
