document.addEventListener('DOMContentLoaded', async function () {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch('http://localhost:3000/user/isadmin', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
        });

        if (!response.ok) {
            console.error('El usuario no es administrador');
            window.location.href = 'http://localhost:3000/';
        } else {
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
            try {
                const idPedido = obtenerIdPedidoDesdeURL();
                if (idPedido) {
                    const detallesPedido = await obtenerDetallesDelServidor(idPedido);
                    mostrarDetallesEnHTML(detallesPedido);
                } else {
                    console.error('No se pudo obtener el ID del pedido desde la URL.');
                }
            } catch (error) {
                console.error('Error al cargar los detalles del pedido:', error);
            }
        }
    } catch (error) {
        console.error('Error al verificar si el usuario es administrador:', error);
    }
});

const obtenerDetallesDelServidor = async (idPedido) => {
    // Realiza una solicitud al servidor para obtener los detalles del pedido
    const response = await fetch(`http://localhost:3000/api/pedidos/${idPedido}`);
    const detallesPedido = await response.json();
    return detallesPedido;
};

const mostrarDetallesEnHTML = (detallesPedido) => {
    const contenedorDetalles = document.getElementById('contenedor-detalles');
    contenedorDetalles.style.textAlign = 'center';

    contenedorDetalles.innerHTML = '';

    const h1 = document.createElement('h1');
    h1.textContent = 'Detalles del Pedido';
    h1.style.marginTop = '20px';
    contenedorDetalles.appendChild(h1);

    const detallesContainer = document.createElement('div');
    detallesContainer.classList.add('detalles-container');
    detallesContainer.style.marginTop = '20px';
    contenedorDetalles.appendChild(detallesContainer);

    const elementosContainer = document.createElement('div');
    elementosContainer.classList.add('elementos-container');
    elementosContainer.style.marginTop = '20px';
    contenedorDetalles.appendChild(elementosContainer);

    const botonContainer = document.createElement('div');
    botonContainer.classList.add('boton-container');
    botonContainer.style.marginTop = '20px';
    botonContainer.style.marginBottom = '20px';
    contenedorDetalles.appendChild(botonContainer);

    const detallesTarjetas = [
    { label: 'Cliente', value: detallesPedido.usuarioEmail },
    { label: 'Total', value: `$${detallesPedido.total}` },
    { label: 'Estado', value: detallesPedido.estado, isEstado: true },
    { label: 'Fecha', value: new Date(detallesPedido.fecha).toLocaleString() },
    ];

    for (let i = 0; i < detallesTarjetas.length; i += 2) {
    const row = document.createElement('div');
    row.classList.add('row', 'mb-3', 'justify-content-center', 'align-items-center');
    row.style.margin = '0';
    row.style.padding = '0';

    for (let j = i; j < i + 2 && j < detallesTarjetas.length; j++) {
        const detalle = detallesTarjetas[j];

        const col = document.createElement('div');
        col.classList.add('col-md-2', 'mb-1');
        col.style.display = "flex";

        const tarjeta = document.createElement('div');
        tarjeta.classList.add('card');
        tarjeta.style.border = '1px solid #686868';
        tarjeta.style.width = '400px'
        tarjeta.style.height = '100px'
        if (detalle.isEstado && detallesPedido.estado.toLowerCase() === 'entregado') {
            tarjeta.style.backgroundColor = '#d4edda';
        }

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body', 'd-flex', 'flex-column', 'align-items-center');

        const label = document.createElement('h5');
        label.textContent = detalle.label;
        label.classList.add('card-title', 'text-center', 'mb-3');

        const value = document.createElement('p');
        value.textContent = detalle.value;
        value.classList.add('card-text', 'mb-3');

        cardBody.appendChild(label);
        cardBody.appendChild(value);
        tarjeta.appendChild(cardBody);
        col.appendChild(tarjeta);
        row.appendChild(col);
    }

    detallesContainer.appendChild(row);
    }

    for (let i = 0; i < detallesPedido.productos.length; i += 4) {
        const row = document.createElement('div');
        row.classList.add('row', 'mb-3', 'justify-content-center', 'align-items-center');
        row.style.margin = '0';
        row.style.padding = '0';

        for (let j = i; j < i + 4 && j < detallesPedido.productos.length; j++) {
            const producto = detallesPedido.productos[j];

            const col = document.createElement('div');
            col.classList.add('col-md-3', 'mb-3');
            col.style.display = "flex";
            col.style.width = '300px';
            col.style.height = '380px';

            const card = document.createElement('div');
            card.classList.add('card', 'h-100');
            card.style.maxWidth = '100%';
            card.style.width = '100%';
            card.style.padding = '10px';
            card.style.height = '100%';
            card.style.justifyContent = 'space-between';
            card.style.borderRadius = '13px';
            card.style.borderColor = '#555555';

            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body', 'd-flex', 'flex-column', 'align-items-center');

            const productName = document.createElement('h5');
            productName.textContent = producto.nombre;
            productName.classList.add('card-title', 'text-center', 'mb-3');
            productName.style.height = '50px';

            const productImage = document.createElement('img');
            productImage.src = producto.imagen;
            productImage.alt = `Imagen de ${producto.nombre}`;
            productImage.classList.add('card-img-top', 'mb-3', 'img-fluid');
            productImage.style.maxWidth = '90%';
            productImage.style.height = 'auto';
            productImage.style.objectFit = 'contain';

            const productQuantity = document.createElement('p');
            productQuantity.textContent = `Cantidad: ${producto.cantidad}`;
            productQuantity.classList.add('card-text', 'mb-3');
            productQuantity.style.height = '20px';

            cardBody.appendChild(productName);
            cardBody.appendChild(productImage);
            cardBody.appendChild(productQuantity);

            card.appendChild(cardBody);
            col.appendChild(card);
            row.appendChild(col);
        }

        elementosContainer.appendChild(row);
    }

    if (detallesPedido.estado.toLowerCase() === 'pendiente') {
        const botonMarcarEntregado = document.createElement('button');
        botonMarcarEntregado.classList.add('btn', 'btn-success');
        botonMarcarEntregado.textContent = 'Marcar como Entregado';
        botonMarcarEntregado.style.marginLeft = '5px';
        botonMarcarEntregado.addEventListener('click', function () {
            const idPedido =obtenerIdPedidoDesdeURL()
            marcarComoEntregado(idPedido);
        });
        botonContainer.appendChild(botonMarcarEntregado);
    }
};

// Función para obtener el ID del pedido desde la URL
const obtenerIdPedidoDesdeURL = () => {
    try {
        // Obtiene la última parte de la URL como el ID del pedido
        const urlParts = window.location.pathname.split('/');
        const idPedido = urlParts[urlParts.length - 1];
        return idPedido;
    } catch (error) {
        console.error('Error al obtener el ID del pedido desde la URL:', error);
        return null;
    }
};

async function marcarComoEntregado(pedidosIds) {
    try {
        const response = await fetch('http://localhost:3000/pedidos/marcar-entregado', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pedidosIds }),
        });

        if (response.ok) {
            alert('Pedidos marcados como entregados exitosamente.');
            window.location.reload();
        } else {
            alert('Error al marcar como entregado los pedidos.');
        }
    } catch (error) {
        console.error('Error al marcar como entregado los pedidos:', error);
        alert('Error interno del servidor.');
    }
}