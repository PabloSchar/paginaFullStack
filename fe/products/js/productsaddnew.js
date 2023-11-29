function showSuccessAlert(message) {
    const successContainer = document.getElementById('success-container');
    
    const alertDiv = document.createElement('div');
    alertDiv.classList.add('alert', 'alert-success', 'mt-3', 'fade', 'show', 'small-alert');
    alertDiv.textContent = message;
  
    successContainer.innerHTML = '';
    successContainer.appendChild(alertDiv);
  
    setTimeout(() => {
      alertDiv.classList.remove('show');
    }, 3000);
}

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
                
            const dinamicoContainer = document.getElementById('dinamico');

            // Crea y agrega dinámicamente un h1
            const nuevoH1 = document.createElement('h1');
            nuevoH1.textContent = 'Agregar Nuevo Producto';
            dinamicoContainer.appendChild(nuevoH1);

            // Crea y agrega dinámicamente el formulario
            const addProductForm = document.createElement('form');
            addProductForm.id = 'addProductForm';

            const formElements = [
                { label: 'Nombre del Producto', type: 'text', id: 'productName', name: 'productName', required: true },
                { label: 'Precio', type: 'number', id: 'productPrice', name: 'productPrice', required: true },
                { label: 'Stock', type: 'number', id: 'productStock', name: 'productStock', required: true },
                { label: 'URL de la Imagen', type: 'text', id: 'productImage', name: 'productImage', required: true },
                { label: 'Descripción', type: 'textarea', id: 'productDescription', name: 'productDescription', rows: 3, required: true }
            ];

            formElements.forEach(element => {
                const div = document.createElement('div');
                div.classList.add('mb-3');

                const label = document.createElement('label');
                label.htmlFor = element.id;
                label.classList.add('form-label');
                label.textContent = element.label;

                const input = document.createElement(element.type === 'textarea' ? 'textarea' : 'input');
                input.type = element.type;
                input.classList.add('form-control');
                input.id = element.id;
                input.name = element.name;

                if (element.rows) {
                    input.rows = element.rows;
                }

                if (element.required) {
                    input.required = true;
                }

                div.appendChild(label);
                div.appendChild(input);
                addProductForm.appendChild(div);
            });

            // Crea y agrega dinámicamente el botón de enviar
            const submitButton = document.createElement('button');
            submitButton.type = 'submit';
            submitButton.classList.add('btn', 'btn-primary');
            submitButton.textContent = 'Enviar';
            addProductForm.appendChild(submitButton);

            dinamicoContainer.appendChild(addProductForm);

            // Agrega el evento de envío del formulario
            addProductForm.addEventListener('submit', async function (event) {
                event.preventDefault();

                const productName = document.getElementById('productName').value;
                const productPrice = document.getElementById('productPrice').value;
                const productStock = document.getElementById('productStock').value;
                const productImage = document.getElementById('productImage').value;
                const productDescription = document.getElementById('productDescription').value;

                try {
                    const token = localStorage.getItem('token');
                    const response = await fetch('http://localhost:3000/products/addnew', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
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
                        showSuccessAlert('Producto agregado exitosamente')

                    } else {
                        console.error('Error al agregar el producto');
                    }
                } catch (error) {
                    console.error('Error de red:', error);
                }
            });
        }
    } catch (error) {
        console.error('Error al verificar si el usuario es administrador:', error);
    }
});
