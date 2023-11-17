document.addEventListener("DOMContentLoaded", function () {
    const authButtonsContainer = document.getElementById("authButtons");
    
    const token = localStorage.getItem('token');
    console.log(token)

    if (token) {
        // Si hay un token, mostrar botón de cerrar sesión
        const logoutButton = document.createElement("button");
        logoutButton.classList.add("btn", "btn-danger");
        logoutButton.textContent = "Cerrar Sesión";
        logoutButton.addEventListener("click", function () {

            localStorage.removeItem('token');

            window.location.reload();
        });
        authButtonsContainer.appendChild(logoutButton);
    } else {
        // Si no hay un token, mostrar botón de iniciar sesión
        const loginButton = document.createElement("a");
        loginButton.href = "/user/login";
        loginButton.classList.add("btn", "btn-primary");
        loginButton.textContent = "Iniciar Sesión";
        authButtonsContainer.appendChild(loginButton);
    }
});