function createAdminMenu() {
    const adminMenuContainer = document.createElement('div');
    adminMenuContainer.classList.add('card');

    const adminMenuBody = document.createElement('div');
    adminMenuBody.classList.add('card-body');

    const adminMenuTitle = document.createElement('h2');
    adminMenuTitle.classList.add('card-title', 'text-center', 'mb-4');
    adminMenuTitle.textContent = 'Menu de Admin';

    const agregarProductoBtn = document.createElement('button');
    agregarProductoBtn.id = 'agregarProductoBtn'; // Asigna el ID
    agregarProductoBtn.classList.add('btn', 'btn-primary');
    agregarProductoBtn.textContent = 'Agregar Producto';
    agregarProductoBtn.addEventListener('click', function () {
        window.location.href = "/products/addnew";
    });

    const editarProductoBtn = document.createElement('button');
    editarProductoBtn.id = 'editarProductoBtn'; // Asigna el ID
    editarProductoBtn.classList.add('btn', 'btn-secondary');
    editarProductoBtn.textContent = 'Editar Producto';
    editarProductoBtn.addEventListener('click', function () {
        window.location.href = "/products/edit";
    });

    const borrarProductoBtn = document.createElement('button');
    borrarProductoBtn.id = 'borrarProductoBtn'; // Asigna el ID
    borrarProductoBtn.classList.add('btn', 'btn-danger');
    borrarProductoBtn.textContent = 'Borrar Producto';
    borrarProductoBtn.addEventListener('click', function () {
        window.location.href = "/products/deleteproduct";
    });

    const verUsersBtn = document.createElement('button');
    verUsersBtn.id = 'verUsersBtn'; // Asigna el ID
    verUsersBtn.classList.add('btn', 'btn-info');
    verUsersBtn.textContent = 'Ver Usuarios';
    verUsersBtn.addEventListener('click', function () {
        window.location.href = "/user/allusers";
    });

    adminMenuBody.appendChild(adminMenuTitle);
    adminMenuBody.appendChild(agregarProductoBtn);
    adminMenuBody.appendChild(editarProductoBtn);
    adminMenuBody.appendChild(borrarProductoBtn);
    adminMenuBody.appendChild(verUsersBtn);

    adminMenuContainer.appendChild(adminMenuBody);
    return adminMenuContainer;
}

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

    const isAdminContainer = document.getElementById('admin-menu-container');


    try {
        const response = await fetch('http://localhost:3000/user/isadmin', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
        });

        if (response.ok) {
            const adminMenu = createAdminMenu();
            isAdminContainer.appendChild(adminMenu);
        }
    } catch (error) {
        console.error('Error al verificar si el usuario es administrador:', error);
    }

    //sirve para que el usuario deba iniciar sesion para entrar a este apartado

    if (!token) {
        window.location.href = "http://localhost:3000/user/login";
    }
});