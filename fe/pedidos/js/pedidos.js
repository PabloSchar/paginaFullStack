document.addEventListener('DOMContentLoaded', async function () {
    const texto = document.getElementById('texto');
    const textofiltro = document.getElementById('textofiltro');
    const listaPedidos = document.getElementById('lista-pedidos');
    const filtroEstado = document.getElementById('filtro-estado');
    let pedidos = [];  // Arreglo para almacenar todos los pedidos

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

            try {
                // Realiza una solicitud al servidor para obtener los pedidos
                const response = await fetch('http://localhost:3000/pedidos/getall');
                pedidos = await response.json();

                const encabezado = document.createElement('h1');
                encabezado.textContent = 'Pedidos';
                texto.appendChild(encabezado);

                const filtrotextito = document.createElement('h5');
                filtrotextito.textContent = 'Filtro:';
                textofiltro.appendChild(filtrotextito);

                // Muestra los pedidos en la página
                renderizarPedidos(pedidos);

                // Agrega dinámicamente las opciones del filtro
                const estadosUnicos = [...new Set(pedidos.map(pedido => pedido.estado.toLowerCase()))];
                estadosUnicos.unshift('Todos');
                estadosUnicos.forEach(estado => {
                    const option = document.createElement('option');
                    option.value = estado;
                    option.textContent = estado;
                    filtroEstado.appendChild(option);
                });

                filtroEstado.addEventListener('change', function () {
                    const estadoSeleccionado = filtroEstado.value;
                    filtrarPedidosPorEstado(estadoSeleccionado);
                });

            } catch (error) {
                console.error('Error al obtener los pedidos:', error);
            }
        }
    } catch (error) {
        console.error('Error al verificar si el usuario es administrador:', error);
    }

    // Función para renderizar los pedidos
    function renderizarPedidos(pedidos) {
        listaPedidos.innerHTML = '';

        // Muestra los pedidos en la página
        for (let i = 0; i < pedidos.length; i += 2) {
            const row = document.createElement('div');
            row.classList.add('row');

            const cardPedido1 = crearCardPedido(pedidos[i]);
            const col1 = document.createElement('div');
            col1.classList.add('col-md-6', 'mb-3');
            col1.appendChild(cardPedido1);

            row.appendChild(col1);

            if (pedidos[i + 1]) {
                const cardPedido2 = crearCardPedido(pedidos[i + 1]);
                const col2 = document.createElement('div');
                col2.classList.add('col-md-6', 'mb-3');
                col2.appendChild(cardPedido2);

                row.appendChild(col2);
            }

            listaPedidos.appendChild(row);
        }
    }

    // Función para crear una card de pedido
    function crearCardPedido(pedido) {
        const cardPedido = document.createElement('div');
        cardPedido.classList.add('card');
        cardPedido.style.border = '1px solid #686868';
        cardPedido.style.borderRadius = '8px';

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const emailCliente = document.createElement('h6');
        emailCliente.classList.add('card-title');
        emailCliente.textContent = `Cliente: ${pedido.usuarioEmail}`;
        cardBody.appendChild(emailCliente);

        const totalPedido = document.createElement('p');
        totalPedido.classList.add('card-text');
        totalPedido.textContent = `Total: $${pedido.total}`;
        cardBody.appendChild(totalPedido);

        const estadoPedido = document.createElement('p');
        estadoPedido.classList.add('card-text');
        estadoPedido.textContent = `Estado: ${pedido.estado}`;
        cardBody.appendChild(estadoPedido);

        const botonDetalles = document.createElement('button');
        botonDetalles.classList.add('btn', 'btn-primary', 'mr-2');
        botonDetalles.textContent = 'Ver Detalles';
        botonDetalles.addEventListener('click', function () {
            verDetallesPedido(pedido._id);
        });
        cardBody.appendChild(botonDetalles);

        // Agrega un botón Marcar como entregado solo si el estado es Pendiente
        if (pedido.estado.toLowerCase() === 'pendiente') {
            const botonMarcarEntregado = document.createElement('button');
            botonMarcarEntregado.classList.add('btn', 'btn-success');
            botonMarcarEntregado.textContent = 'Marcar como Entregado';
            botonMarcarEntregado.style.marginLeft = '5px';
            botonMarcarEntregado.addEventListener('click', function () {
                marcarComoEntregado([pedido._id]);
            });
            cardBody.appendChild(botonMarcarEntregado);
        }

        cardPedido.appendChild(cardBody);

        // Aplica fondo verde si el estado es Entregado
        if (pedido.estado.toLowerCase() === 'entregado') {
            cardPedido.style.backgroundColor = '#d4edda';
        }

        return cardPedido;
    }

    // Función para filtrar pedidos por estado
    function filtrarPedidosPorEstado(estado) {
        const pedidosFiltrados = pedidos.filter(pedido => {
            const estadoPedido = pedido.estado.toLowerCase();
            return estado === 'Todos' || estadoPedido === estado;
        });

        // Renderiza los pedidos filtrados
        renderizarPedidos(pedidosFiltrados);
    }

});

function obtenerPedidosSeleccionados() {
    const listaPedidos = document.getElementById('lista-pedidos');
    const cardsPedidos = listaPedidos.getElementsByClassName('card');

    const pedidosSeleccionados = [];
    Array.from(cardsPedidos).forEach(card => {
        const estadoPedido = card.querySelector('.card-text:nth-child(3)').textContent.split(': ')[1];
        if (estadoPedido.toLowerCase() === 'pendiente') {
            const idPedido = card.querySelector('.btn-primary').getAttribute('data-pedido-id');
            pedidosSeleccionados.push(idPedido);
        }
    });

    return pedidosSeleccionados;
}

// Función para marcar pedidos como entregados
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

// Función para ver detalles de un pedido
function verDetallesPedido(idPedido) {
    window.location.href = `http://localhost:3000/pedidos/detalles/${idPedido}`;
}