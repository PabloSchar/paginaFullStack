document.addEventListener("DOMContentLoaded", function () {
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
        
    const errorMessageElement = document.getElementById("error-message");

    document.getElementById("loginForm").addEventListener("submit", async function (event) {
        event.preventDefault();

        const nombreusuarioEmail = document.getElementById("usernameOrEmail").value;
        const password = document.getElementById("password").value;

        const data = await fetch("http://localhost:3000/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                identifier: nombreusuarioEmail,
                password: password
            }),
        });

        if (data.ok) {
            const responseData = await data.json();
            localStorage.setItem('token', responseData.token);
            window.location.href = responseData.redirectUrl;
        } else {
            const errorData = await data.json();

            errorMessageElement.innerText = errorData.error;

            errorMessageElement.style.display = "block";
        }
    });

    //sirve para que el usuario no pueda volver a acceder a esta pagina una vez ya tiene sesion iniciada
    const token = localStorage.getItem('token');

    if (token) {
        window.location.href = "http://localhost:3000/";
    }
});