document.addEventListener("DOMContentLoaded", function () {
    const authButtonsContainer = document.getElementById("authButtons");

    // Obtener el token almacenado en localStorage
    const token = localStorage.getItem('token');
    console.log(token)

    if (token) {
        // Si hay un token, mostrar botón de cerrar sesión
        const logoutButton = document.createElement("button");
        logoutButton.classList.add("btn", "btn-danger");
        logoutButton.textContent = "Cerrar Sesión";
        logoutButton.addEventListener("click", function () {
            // Eliminar el token almacenado
            localStorage.removeItem('token');

            // Imprimir mensaje para verificar que se ejecuta el evento de cerrar sesión
            console.log("Sesión cerrada");

            // Recargar la página
            window.location.reload();
        });
        authButtonsContainer.appendChild(logoutButton);
    } else {
        // Si no hay un token, mostrar botón de iniciar sesión
        const loginButton = document.createElement("a");
        loginButton.href = "/user/login"; // Ajusta la ruta según tu configuración
        loginButton.classList.add("btn", "btn-primary");
        loginButton.textContent = "Iniciar Sesión";
        authButtonsContainer.appendChild(loginButton);
    }
});