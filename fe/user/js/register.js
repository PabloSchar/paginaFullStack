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

    localStorage.setItem('token', responseData.token);

    // Realiza la redirección al home
    window.location.href = responseData.redirectUrl;
  });
  
  //sirve para que el usuario no pueda volver a acceder a esta pagina una vez ya tiene sesion iniciada
  const token = localStorage.getItem('token');

  if (token) {
      window.location.href = "http://localhost:3000/";
  }
});