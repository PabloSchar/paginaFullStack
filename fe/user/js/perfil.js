document.addEventListener("DOMContentLoaded", async function () {
    const headerContainer = document.getElementById('header-container');

    // Fetch para obtener el contenido del archivo header.html
    fetch('/header/html/header.html')
        .then(response => response.text())
        .then(html => {
            headerContainer.innerHTML = html;

            const carritoLink = document.getElementById('carritoLink');
            const perfilLink = document.getElementById('perfilLink');

            const token = localStorage.getItem('token');

            if (token) {
                carritoLink.href = 'http://localhost:3000/carrito';
                perfilLink.href = 'http://localhost:3000/user/perfil';
            } else {
                carritoLink.href = 'http://localhost:3000/user/login';
                perfilLink.href = 'http://localhost:3000/user/login';
            }
        })
        .catch(error => console.error('Error al cargar el encabezado:', error));

    const token = localStorage.getItem('token');

    fetch('/user/perfil-page', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })
    .then(response => response.json())
    .then(userData => {
        const profileContainer = document.getElementById('profile-container');
        profileContainer.innerHTML = `
            <p><strong>Nombre:</strong> ${userData.nombre}</p>
            <p><strong>Apellido:</strong> ${userData.apellido}</p>
            <p><strong>Nombre de Usuario:</strong> ${userData.nombreusuario}</p>
            <p><strong>Correo:</strong> ${userData.correo}</p>
            <p><strong>Número de Teléfono:</strong> ${userData.numeroTelefono}</p>
            <p><strong>Código Postal:</strong> ${userData.codigoPostal}</p>
            <p><strong>Provincia:</strong> ${userData.provincia}</p>
            <p><strong>Ciudad:</strong> ${userData.ciudad}</p>
            <p><strong>Dirección:</strong> ${userData.direccion}</p>
        `;
    })
    .catch(error => console.error('Error al obtener datos del perfil:', error));

    const logoutBtn = document.getElementById('logout-btn');

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = '/user/login';
    });

    const agregarProductoBtn = document.getElementById('agregarProductoBtn');

    agregarProductoBtn.addEventListener("click", function () {
        // Redirige a la página para agregar nuevos productos
        window.location.href = "/products/addnew";
    });

    //sirve para que el usuario deba iniciar sesion para entrar a este apartado

    if (!token) {
        window.location.href = "http://localhost:3000/user/login";
    }
});