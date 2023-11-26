document.addEventListener('DOMContentLoaded', async function () {
  const carritoContainer = document.getElementById('carrito-container');
  const totalAmountElement = document.getElementById('total-amount');
  const checkoutBtn = document.getElementById('checkout-btn');

  const token = localStorage.getItem('token');

  try {
      const carritoResponse = await fetch('http://localhost:3000/carrito/api', {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': token,
          },
      });
      const carritoData = await carritoResponse.json();

      for (let i = 0; i < carritoData.productos.length; i += 4) {
          const row = document.createElement('div');
          row.classList.add('row', 'mb-3', 'justify-content-center', 'align-items-center');

          for (let j = i; j < i + 4 && j < carritoData.productos.length; j++) {
              const col = document.createElement('div');
              col.classList.add('col-md-3', 'mb-3');
              col.style.display = "flex";
              col.style.width = '300px';
              col.style.height = '400px';

              const productItem = document.createElement('div');
              productItem.classList.add('card', 'h-100');
              productItem.style.maxWidth = '100%';
              productItem.style.width = '100%';
              productItem.style.padding = '10px';
              productItem.style.height = '100%';
              productItem.style.justifyContent = 'space-between';
              productItem.style.borderRadius = '13px';
              productItem.style.borderColor = '#555555';

              const cardBody = document.createElement('div');
              cardBody.classList.add('card-body', 'd-flex', 'flex-column', 'align-items-center');

              const productName = document.createElement('h5');
              productName.textContent = `${carritoData.productos[j].productoId.productName}`;
              productName.classList.add('card-title', 'text-center', 'mb-3');
              productName.style.height = '50px';

              const productImage = document.createElement('img');
              productImage.src = carritoData.productos[j].productoId.productImage;
              productImage.alt = `Imagen de ${carritoData.productos[j].productoId.productName}`;
              productImage.classList.add('card-img-top', 'mb-3', 'img-fluid');
              productImage.style.maxWidth = '90%';
              productImage.style.height = 'auto';
              productImage.style.objectFit = 'contain';

              const productPrice = document.createElement('p');
              productPrice.textContent = `Precio: $${carritoData.productos[j].productoId.productPrice}`;
              productPrice.classList.add('card-text', 'mb-3');
              productPrice.style.height = '20px';

              const productQuantity = document.createElement('div');
              productQuantity.classList.add('input-group');

              const quantityLabel = document.createElement('label');
              quantityLabel.textContent = 'Cantidad: ';
              quantityLabel.classList.add('input-group-text');

              const decrementBtn = document.createElement('button');
              decrementBtn.textContent = '-';
              decrementBtn.classList.add('btn', 'btn-outline-secondary');
              decrementBtn.addEventListener('click', () => decreaseQuantity(carritoData.productos[j]));

              const quantityDisplay = document.createElement('span');
              quantityDisplay.textContent = carritoData.productos[j].cantidad;
              quantityDisplay.classList.add('form-control');

              const incrementBtn = document.createElement('button');
              incrementBtn.textContent = '+';
              incrementBtn.classList.add('btn', 'btn-outline-secondary');
              incrementBtn.addEventListener('click', () => increaseQuantity(carritoData.productos[j]));

              productQuantity.appendChild(quantityLabel);
              productQuantity.appendChild(decrementBtn);
              productQuantity.appendChild(quantityDisplay);
              productQuantity.appendChild(incrementBtn);

              cardBody.appendChild(productName);
              cardBody.appendChild(productImage);
              cardBody.appendChild(productPrice);
              cardBody.appendChild(productQuantity);

              productItem.appendChild(cardBody);
              col.appendChild(productItem);
              row.appendChild(col);
          }

          carritoContainer.appendChild(row);
      }

      totalAmountElement.textContent = carritoData.total.toFixed(2);

      checkoutBtn.addEventListener('click', async () => {
          // Falta agregar la logica para realizar el pedido
          console.log('Realizar pago');
      });
  } catch (error) {
      console.error('Error al obtener la información del carrito:', error);
  }

  // Funciones para incrementar y decrementar la cantidad de productos
  function decreaseQuantity(producto) {
      // Falta la lógica para decrementar la cantidad
      console.log('Decrementar cantidad de', producto.productoId.productName);
  }

  function increaseQuantity(producto) {
      // Falta la lógica para incrementar la cantidad
      console.log('Incrementar cantidad de', producto.productoId.productName);
  }
});