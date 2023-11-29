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
                await cargarFormularioEdicionProductos();
            } catch (error) {
                console.error('Error al cargar la página:', error);
            }
        }
    } catch (error) {
        console.error('Error al verificar si el usuario es administrador:', error);
    }
});

// Función para cargar dinámicamente el formulario de edición de productos
async function cargarFormularioEdicionProductos() {
    try {
        // Obtener todos los productos desde el servidor
        const productos = await obtenerTodosLosProductos();

        // Crear dinámicamente el formulario de edición de productos
        const formularioEdicion = document.createElement('form');
        formularioEdicion.id = 'formulario-edicion';

        const nuevoH1 = document.createElement('h1');
        nuevoH1.textContent = 'Editar Producto';
        nuevoH1.style.display = 'flex';
        nuevoH1.style.justifyContent = 'center';
        formularioEdicion.appendChild(nuevoH1);

        // Iterar sobre cada producto y agregar campos de edición
        productos.forEach(producto => {
            const cardProducto = document.createElement('div');
            cardProducto.classList.add('card', 'mb-3');
            cardProducto.style.marginTop = '15px';
            cardProducto.style.border = '2px solid #555555';
            cardProducto.style.borderRadius = '8px';

            const nombreProducto = crearCampoTexto('Nombre', producto.productName, `nombre-${producto._id}`);
            const stockProducto = crearCampoNumero('Stock', producto.productStock, `stock-${producto._id}`);
            const precioProducto = crearCampoNumero('Precio', producto.productPrice, `precio-${producto._id}`);
            const imagenProducto = crearCampoTexto('Imagen', producto.productImage, `imagen-${producto._id}`);
            const descripcionProducto = crearCampoTexto('Descripción', producto.productDescription, `descripcion-${producto._id}`);

            const filaProducto = document.createElement('div');
            filaProducto.classList.add('row', 'g-2');

            filaProducto.appendChild(nombreProducto);
            filaProducto.appendChild(stockProducto);
            filaProducto.appendChild(precioProducto);
            filaProducto.appendChild(imagenProducto);
            filaProducto.appendChild(descripcionProducto);

            const cuerpoCard = document.createElement('div');
            cuerpoCard.classList.add('card-body');
            cuerpoCard.appendChild(filaProducto);

            cardProducto.appendChild(cuerpoCard);

            const guardarCambiosBtn = document.createElement('button');
            guardarCambiosBtn.textContent = 'Guardar cambios';
            guardarCambiosBtn.style.width = '300px';
            guardarCambiosBtn.style.height = '43px';
            guardarCambiosBtn.classList.add('btn', 'btn-primary');
            guardarCambiosBtn.addEventListener('click', () => guardarCambios(producto._id));

            const pieCard = document.createElement('div');
            pieCard.classList.add('card-footer');
            pieCard.style.borderColor = '#686868';
            pieCard.style.display = 'flex';
            pieCard.style.justifyContent = 'center';
            pieCard.appendChild(guardarCambiosBtn);
            cardProducto.appendChild(pieCard);

            formularioEdicion.appendChild(cardProducto);
        });

        const contenedorFormulario = document.getElementById('contenedor-formulario');
        contenedorFormulario.appendChild(formularioEdicion);
    } catch (error) {
        console.error('Error al cargar el formulario de edición:', error);
    }
}

// Función para crear un campo de texto en el formulario
function crearCampoTexto(labelText, valorInicial, idCampo) {
    const divCampo = document.createElement('div');
    divCampo.classList.add('col-12', 'col-md-6', 'col-lg-4');

    const label = document.createElement('label');
    label.textContent = `${labelText}: `;

    const input = document.createElement('input');
    input.type = 'text';
    input.value = valorInicial;
    input.id = idCampo;
    input.style.borderColor = 'rgb(182, 179, 179)';
    input.classList.add('form-control');

    divCampo.appendChild(label);
    divCampo.appendChild(input);

    return divCampo;
}

// Función para crear un campo numérico en el formulario
function crearCampoNumero(labelText, valorInicial, idCampo) {
    const divCampo = document.createElement('div');
    divCampo.classList.add('col-12', 'col-md-6', 'col-lg-4');

    const label = document.createElement('label');
    label.textContent = `${labelText}: `;

    const input = document.createElement('input');
    input.type = 'number';
    input.value = valorInicial;
    input.id = idCampo;
    input.style.borderColor = 'rgb(182, 179, 179)';
    input.classList.add('form-control');
    input.min = 0;

    divCampo.appendChild(label);
    divCampo.appendChild(input);

    return divCampo;
}

async function obtenerTodosLosProductos() {
    try {
        const response = await fetch('http://localhost:3000/allproducts');
        if (!response.ok) {
            throw new Error(`Error al obtener los productos: ${response.statusText}`);
        }

        const productos = await response.json();
        return productos;
    } catch (error) {
        throw new Error(`Error en la solicitud de productos: ${error.message}`);
    }
}

async function guardarCambios(idProducto) {
    const nombreProducto = document.getElementById(`nombre-${idProducto}`).value;
    const stockProducto = document.getElementById(`stock-${idProducto}`).value;
    const precioProducto = document.getElementById(`precio-${idProducto}`).value;
    const imagenProducto = document.getElementById(`imagen-${idProducto}`).value;
    const descripcionProducto = document.getElementById(`descripcion-${idProducto}`).value;

    try {
        const response = await fetch(`http://localhost:3000/products/updateproduct/${idProducto}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productName: nombreProducto,
                productStock: stockProducto,
                productPrice: precioProducto,
                productImage: imagenProducto,
                productDescription: descripcionProducto,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Producto actualizado con éxito:', data);
        } else {
            console.error('Error al actualizar el producto:', response.statusText);
        }
    } catch (error) {
        console.error('Error al realizar la solicitud de actualización:', error);
    }
}