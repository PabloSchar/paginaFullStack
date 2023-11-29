function showErrorAlert(message) {
  const errorContainer = document.getElementById('error-container');
  
  const alertDiv = document.createElement('div');
  alertDiv.classList.add('alert', 'alert-danger', 'mt-3', 'fade', 'show', 'small-alert');
  alertDiv.textContent = message;

  errorContainer.innerHTML = '';
  errorContainer.appendChild(alertDiv);

  setTimeout(() => {
    alertDiv.classList.remove('show');
  }, 3000);
}

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

  const footerContainer = document.getElementById('footer-container');

  fetch('/footer/html/footer.html')
      .then(response => response.text())
      .then(html => {
          footerContainer.innerHTML = html;
      })
      .catch(error => console.error('Error al cargar el encabezado:', error));

  document.getElementById("submitButton").addEventListener("click", async function (event) {
    event.preventDefault();

    const nombre = document.getElementById("firstName").value;
    const apellido = document.getElementById("lastName").value;
    const nombreusuario = document.getElementById("username").value;
    const correo = document.getElementById("email").value;
    const numeroTelefono = document.getElementById("phoneNumber").value;
    const codigoPostal = document.getElementById("postalCode").value;
    const provincia = document.getElementById("province").value;
    const ciudad = document.getElementById("city").value;
    const direccion = document.getElementById("address").value;
    const password = document.getElementById("password").value;

    try {
      const data = await fetch("http://localhost:3000/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: nombre,
          apellido: apellido,
          nombreusuario: nombreusuario,
          correo: correo,
          numeroTelefono: numeroTelefono,
          codigoPostal: codigoPostal,
          provincia: provincia,
          ciudad: ciudad,
          direccion: direccion,
          password: password
        }),
      });

      const responseData = await data.json();

      if (data.ok) {
        localStorage.setItem('token', responseData.token);
        window.location.href = responseData.redirectUrl;
      } else {
        showErrorAlert(responseData.message);
      }
    } catch (error) {
      showErrorAlert('Error al intentar registrar. Por favor, inténtalo de nuevo.');
      console.error('Error al intentar registrar:', error);
    }

  });
  
  //sirve para que el usuario no pueda volver a acceder a esta pagina una vez ya tiene sesion iniciada
  const token = localStorage.getItem('token');

  if (token) {
    window.location.href = "http://localhost:3000/";
  }
});