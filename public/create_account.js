document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("submitButton").addEventListener("click", function () {
      var nombre = document.getElementById("firstName").value;
      var apellido = document.getElementById("lastName").value;
      var nombreusuario = document.getElementById("username").value;
      var correo = document.getElementById("email").value;
      var numeroTelefono = document.getElementById("phoneNumber").value;
      var codigoPostal = document.getElementById("postalCode").value;
      var provincia = document.getElementById("province").value;
      var ciudad = document.getElementById("city").value;
      var direccion = document.getElementById("address").value;
  
      var nuevoUsuario = {
        nombre: nombre,
        apellido: apellido,
        nombreusuario: nombreusuario,
        correo: correo,
        numeroTelefono: numeroTelefono,
        codigoPostal: codigoPostal,
        provincia: provincia,
        ciudad: ciudad,
        direccion: direccion,
      };
  
      fetch("http://localhost:3000/create_account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevoUsuario),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            // Manejar el caso en que el correo ya esté en uso
            alert(data.error);
          } else {
            console.log("Respuesta del servidor:", data);
            // Puedes realizar acciones adicionales después de enviar los datos
          }
        })
        .catch((error) => {
          console.error("Error al enviar los datos:", error);
        });
    });
});