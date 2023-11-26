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
            // Lógica para cargar la lista de productos y construir el formulario

            const productList = await fetchProducts();
            const selectContainer = document.getElementById('productSelect');

            // Crear y agregar dinámicamente un h1
            const nuevoH1 = document.createElement('h1');
            nuevoH1.textContent = 'Eliminar Producto';
            selectContainer.appendChild(nuevoH1);

            // Crear el formulario de selección
            const selectForm = document.createElement('form');
            selectForm.id = 'productSelectForm';

            const selectLabel = document.createElement('label');
            selectLabel.textContent = 'Selecciona un producto:';
            selectForm.appendChild(selectLabel);

            // Crear el elemento de selección
            const selectElement = document.createElement('select');
            selectElement.id = 'productSelector';
            selectElement.classList.add('form-select', 'mb-3');

            // Agrega opciones al elemento de selección
            productList.forEach(product => {
                const option = document.createElement('option');
                option.value = String(product._id);
                option.textContent = product.productName;
                selectElement.appendChild(option);
            });

            // Agrega el elemento de selección al formulario
            selectForm.appendChild(selectElement);

            // Crea el botón de eliminación
            const deleteButton = document.createElement('button');
            deleteButton.type = 'button';
            deleteButton.classList.add('btn', 'btn-danger');
            deleteButton.textContent = 'Eliminar Producto';
            deleteButton.addEventListener('click', async function () {
                const selectedProductId = selectElement.value;
                if (selectedProductId) {
                    await deleteProduct(selectedProductId);
                } else {
                    console.error('Selecciona un producto antes de eliminar.');
                }
            });

            // Agrega el botón de eliminación al formulario
            selectForm.appendChild(deleteButton);

            // Agrega el formulario al contenedor
            selectContainer.appendChild(selectForm);
        }
    } catch (error) {
        console.error('Error al verificar si el usuario es administrador:', error);
    }
});

// Función para obtener la lista de productos
async function fetchProducts() {
    const response = await fetch('/allproducts');
    return response.json();
}

async function deleteProduct(productId) {
    try {
        const response = await fetch(`/products/deleteproduct/${productId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            window.location.reload();
            return true; // Indica que la eliminación fue exitosa
        } else {
            console.error('Error al eliminar el producto.');
            return false; // Indica que hubo un error al eliminar el producto
        }
    } catch (error) {
        console.error('Error de red al eliminar el producto:', error);
        return false; // Indica un error de red
    }
}