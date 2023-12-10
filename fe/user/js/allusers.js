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

            const userListContainer = document.getElementById('user-list-container');

            // Función para obtener la lista de usuarios del servidor
            async function getUsers() {
                try {
                    const response = await fetch('/user/api/users');
                    const data = await response.json();
                    return data;
                } catch (error) {
                    console.error('Error al obtener la lista de usuarios:', error);
                    return [];
                }
            }

            // Función para renderizar la lista de usuarios
            async function renderUserList() {
                try {
                    const users = await getUsers();

                    userListContainer.innerHTML = '';

                    users.forEach(user => {
                        const userItem = document.createElement('div');
                        userItem.classList.add('user-item');

                        const userInfo = document.createElement('p');
                        userInfo.classList.add('user-info');
                        userInfo.textContent = `ID: ${user._id} | Nombre de Usuario: ${user.nombreusuario} | Email: ${user.correo} | Rol: ${user.role}`;

                        const roleSelect = document.createElement('select');
                        roleSelect.classList.add('role-select');
                        const roles = ['cliente', 'admin'];
                        roles.forEach(role => {
                            const option = document.createElement('option');
                            option.value = role;
                            option.text = role;
                            if (role === user.role) {
                                option.selected = true;
                            }
                            roleSelect.appendChild(option);
                        });

                        const saveBtn = document.createElement('button');
                        saveBtn.classList.add('btn', 'btn-success', 'action-btn');
                        saveBtn.id = `saveBtn_${user._id}`;
                        saveBtn.textContent = 'Guardar Cambios';
                        saveBtn.addEventListener('click', () => saveUserRole(user._id, roleSelect.value));

                        const deleteBtn = document.createElement('button');
                        deleteBtn.classList.add('btn', 'btn-danger', 'action-btn');
                        deleteBtn.id = `deleteBtn_${user._id}`;
                        deleteBtn.innerHTML = 'Borrar Usuario';
                        deleteBtn.addEventListener('click', () => deleteUser(user._id));

                        userInfo.appendChild(roleSelect);
                        userItem.appendChild(userInfo);
                        userItem.appendChild(saveBtn);
                        userItem.appendChild(deleteBtn);
                        userListContainer.appendChild(userItem);
                    });
                } catch (error) {
                    console.error('Error al renderizar la lista de usuarios:', error);
                }
            }

            // Función para eliminar un usuario
            async function deleteUser(userId) {
                try {
                    const token = localStorage.getItem('token');
            
                    // Decodificar el token
                    const tokenData = atob(token.split('.')[1]);
                    const decodedToken = JSON.parse(tokenData);
            
                    // Obtener el correo
                    const userMailFromToken = decodedToken.correo;
            
                    const response = await fetch(`/user/api/users/${userId}`, {
                        method: 'DELETE',
                    });
            
                    if (response.ok) {
                        const responseBody = await response.json();
            
                        // Comparar el correo obtenido del token con el correo de la respuesta(cierra la sesion si es el mismo usuario)
                        if (userMailFromToken === responseBody.email) {
                            localStorage.removeItem('token');
                            console.log('Token eliminado correctamente.');
                        } else {
                            console.error('Los correos electrónicos no coinciden. No se puede eliminar el token.');
                        }
            
                        console.log(`Usuario con ID ${userId} eliminado.`);
                        window.location.reload();
                    } else {
                        console.error('Error al eliminar el usuario.');
                    }
                } catch (error) {
                    console.error('Error al eliminar el usuario:', error);
                }
            }

            // Función para guardar el cambio del rol de un usuario
            async function saveUserRole(userId, newRole) {
                try {
                    const response = await fetch(`/user/api/users/${userId}/role`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ role: newRole }),
                    });

                    if (response.ok) {
                        console.log(`Rol del usuario con ID ${userId} cambiado a ${newRole}.`);
                        window.location.reload();
                    } else {
                        console.error('Error al cambiar el rol del usuario.');
                    }
                } catch (error) {
                    console.error('Error al cambiar el rol del usuario:', error);
                }
            }

            // Llama a la función para renderizar la lista de usuarios al cargar la página
            renderUserList();
        }
    } catch (error) {
        console.error('Error al verificar si el usuario es administrador:', error);
    }
});
