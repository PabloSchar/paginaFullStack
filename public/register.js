document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("submitButton").addEventListener("click", async function (event) {
    // Prevenir el comportamiento predeterminado del formulario
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
});
