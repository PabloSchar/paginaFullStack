document.addEventListener('DOMContentLoaded', async function () {
    const carritoContainer = document.getElementById('carrito-container');

    const token = localStorage.getItem('token');

    try {
        const carritoResponse = await fetch('http://localhost:3000/carrito/api', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
        });

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

        const footerContainer = document.getElementById('footer-container');

        fetch('/footer/html/footer.html')
            .then(response => response.text())
            .then(html => {
                footerContainer.innerHTML = html;
            })
            .catch(error => console.error('Error al cargar el encabezado:', error));

        const carritoData = await carritoResponse.json();

        // Agregar dinámicamente el título
        const titulo = document.createElement('h1');
        titulo.textContent = 'Carrito de Compras';
        titulo.style.marginTop = '20px';
        titulo.style.textAlign = 'center';
        document.body.insertBefore(titulo, carritoContainer);

        for (let i = 0; i < carritoData.productos.length; i += 4) {
            const row = document.createElement('div');
            row.classList.add('row', 'mb-3', 'justify-content-center', 'align-items-center');

            for (let j = i; j < i + 4 && j < carritoData.productos.length; j++) {
                const col = document.createElement('div');
                col.classList.add('col-md-3', 'mb-3');
                col.style.display = "flex";
                col.style.width = '300px';
                col.style.height = '400px';


                const productItem = document.createElement('div');
                productItem.classList.add('card', 'h-100');
                productItem.style.maxWidth = '100%';
                productItem.style.width = '100%';
                productItem.style.padding = '10px';
                productItem.style.height = '100%';
                productItem.style.justifyContent = 'space-between';
                productItem.style.borderRadius = '13px';
                productItem.style.borderColor = '#555555';

                const cardBody = document.createElement('div');
                cardBody.classList.add('card-body', 'd-flex', 'flex-column', 'align-items-center');

                const productName = document.createElement('h5');
                productName.textContent = `${carritoData.productos[j].productoId.productName}`;
                productName.classList.add('card-title', 'text-center', 'mb-3');
                productName.style.height = '50px';

                const productImage = document.createElement('img');
                productImage.src = carritoData.productos[j].productoId.productImage;
                productImage.alt = `Imagen de ${carritoData.productos[j].productoId.productName}`;
                productImage.classList.add('card-img-top', 'mb-3', 'img-fluid');
                productImage.style.maxWidth = '90%';
                productImage.style.height = 'auto';
                productImage.style.objectFit = 'contain';

                const productPrice = document.createElement('p');
                productPrice.textContent = `Precio: $${carritoData.productos[j].productoId.productPrice}`;
                productPrice.classList.add('card-text', 'mb-3');
                productPrice.style.height = '20px';

                const productQuantity = document.createElement('div');
                productQuantity.classList.add('input-group');

                const quantityLabel = document.createElement('label');
                quantityLabel.textContent = 'Cantidad: ';
                quantityLabel.classList.add('input-group-text');

                const decrementBtn = document.createElement('button');
                decrementBtn.textContent = '-';
                decrementBtn.classList.add('btn', 'btn-outline-secondary');
                decrementBtn.addEventListener('click', () => updateQuantity(carritoData.productos[j], 'decrement'));

                const quantityDisplay = document.createElement('span');
                quantityDisplay.textContent = carritoData.productos[j].cantidad;
                quantityDisplay.classList.add('form-control');

                const incrementBtn = document.createElement('button');
                incrementBtn.textContent = '+';
                incrementBtn.classList.add('btn', 'btn-outline-secondary');
                incrementBtn.addEventListener('click', () => updateQuantity(carritoData.productos[j], 'increment'));

                productQuantity.appendChild(quantityLabel);
                productQuantity.appendChild(decrementBtn);
                productQuantity.appendChild(quantityDisplay);
                productQuantity.appendChild(incrementBtn);

                cardBody.appendChild(productName);
                cardBody.appendChild(productImage);
                cardBody.appendChild(productPrice);
                cardBody.appendChild(productQuantity);

                productItem.appendChild(cardBody);
                col.appendChild(productItem);
                row.appendChild(col);
            }

            carritoContainer.appendChild(row);
        }

        const totalContainer = document.createElement('div');
        totalContainer.id = 'total-container';
        totalContainer.style.marginTop = '20px';
        totalContainer.style.textAlign = 'center';
        totalContainer.classList.add('mt-3');

        const totalTitulo = document.createElement('h4');
        totalTitulo.textContent = 'Total: $';

        const totalSpan = document.createElement('span');
        totalSpan.id = 'total-amount';
        totalSpan.textContent = carritoData.total.toFixed(2);

        totalTitulo.appendChild(totalSpan);
        totalContainer.appendChild(totalTitulo);
        carritoContainer.appendChild(totalContainer);

        // Agregar dinámicamente el botón de realizar pedido
        const realizarPedidoBtn = document.createElement('button');
        realizarPedidoBtn.id = 'checkout-btn';
        realizarPedidoBtn.classList.add('btn', 'btn-primary', 'mt-3');
        realizarPedidoBtn.textContent = 'Realizar Pedido';
        realizarPedidoBtn.style.marginTop = '20px';
        realizarPedidoBtn.style.marginBottom = '20px';

        const centeringContainer = document.createElement('div');
        centeringContainer.style.display = 'flex';
        centeringContainer.style.justifyContent = 'center';

        centeringContainer.appendChild(realizarPedidoBtn);

        carritoContainer.appendChild(centeringContainer);

        const checkoutBtn = document.getElementById('checkout-btn');
        const totalAmountElement = document.getElementById('total-amount');

        if (carritoData.productos.length === 0) {
            // No hay productos en el carrito, deshabilita el botón de compra
            checkoutBtn.disabled = true;
        } else {
            checkoutBtn.disabled = false;
            totalAmountElement.textContent = carritoData.total.toFixed(2);

            checkoutBtn.addEventListener('click', async () => {
                await realizarPedido();
            });
        }

        async function realizarPedido() {
            try {
                const confirmacion = confirm('¿Desea realizar el pedido?');

                if (confirmacion) {
                    const response = await fetch('http://localhost:3000/pedidos', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': token,
                        },
                        body: JSON.stringify({ productos: carritoData.productos, total: carritoData.total }),
                    });
            
                    if (response.ok) {
                        console.log('Pedido realizado con éxito');
                        location.reload();
                    } else {
                        console.error('Error al realizar el pedido:', response.statusText);
                    }
                } else {
                    console.log('Pedido cancelado');
                }
            } catch (error) {
                console.error('Error al realizar el pedido:', error);
            }
        }
    } catch (error) {
        console.error('Error al obtener la información del carrito:', error);
    }

    // Función para incrementar y decrementar la cantidad de productos
    async function updateQuantity(producto, action) {
        try {
            // Obtiene el stock más reciente del producto
            const stockResponse = await fetch(`http://localhost:3000/products/${producto.productoId._id}`);
            const stockData = await stockResponse.json();
            const stockDisponible = stockData.productStock;

            const newQuantity = action === 'increment' ? producto.cantidad + 1 : producto.cantidad - 1;

            // Verifica que la nueva cantidad esté dentro del stock disponible
            if (newQuantity >= 0 && newQuantity <= stockDisponible) {
                producto.cantidad = newQuantity;

                // Actualiza la cantidad en la base de datos
                const response = await fetch(`http://localhost:3000/carrito/api/${producto.productoId._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token,
                    },
                    body: JSON.stringify({ cantidad: newQuantity }),
                });

                if (response.ok) {
                    console.log('Cantidad actualizada exitosamente.');

                    updateUI();
                } else {
                    console.log('No se pudo actualizar la cantidad en la base de datos.');
                }
            } else {
                console.log('No se puede actualizar la cantidad. Fuera de stock disponible.');
            }
        } catch (error) {
            console.error('Error al actualizar la cantidad:', error);
        }
    }


    function updateUI() {
        // Recarga la página para reflejar los cambios de cantidad
        location.reload();
    }
});