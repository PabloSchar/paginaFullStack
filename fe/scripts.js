

function addToCart(productId) {
    // Lógica para agregar productos al carrito
    console.log('Producto agregado al carrito:', productId);
}

function viewProduct(productId) {
    // Redirige a la página del producto individual
    window.location.href = `http://localhost:3000/product/${productId}`;
}

function displayProducts(productList) {
    const productsContainer = document.getElementById('page-content');
    productsContainer.innerHTML = '';

    const productsPerRow = 3;
    let currentRow = document.createElement('div');
    currentRow.classList.add('row');

    productList.forEach((element, index) => {
        const productHTML = `
            <div class="col-md-4 col-12 mb-3">
                <div class="product-container card h-100">
                    <h3 class="card-title">${element.productName}</h3>
                    <img src="${element.productImage}" class="card-img-top img-fluid" />
                    <h1 class="card-text">${element.productPrice}</h1>
                </div>
            </div>`;

        currentRow.innerHTML += productHTML;

        if ((index + 1) % productsPerRow === 0 || index === productList.length - 1) {
            // Agrega la fila actual al contenedor
            productsContainer.appendChild(currentRow);
            currentRow = document.createElement('div');
            currentRow.classList.add('row');
            if (index === productList.length - 1 && (index + 1) % productsPerRow !== 0) {
                // Si es el último elemento y no forma una fila completa, agrega una clase para centrar
                currentRow.classList.add('justify-content-center');
            }
        }
    });
}

function displayPagination(totalPages, currentPage) {
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = '';
    paginationContainer.classList.add('d-flex', 'justify-content-center', 'my-3');

    for (let i = 1; i <= totalPages; i++) {
        (function (pageNumber) {
            const pageButton = document.createElement('button');
            pageButton.textContent = pageNumber;
            pageButton.classList.add('btn', 'btn-secondary', 'mx-1');
            pageButton.addEventListener('click', async function () {
                const productList = await fetchProducts(pageNumber);
                displayProducts(productList);
                displayPagination(totalPages, pageNumber);
            });

            if (pageNumber === currentPage) {
                pageButton.classList.add('active');
            }

            paginationContainer.appendChild(pageButton);
        })(i);
    }
}

async function fetchProducts(page) {
    const response = await fetch(`/products?page=${page}`);
    return response.json();
}

// Función para obtener la lista de productos de una página específica
async function fetchProductsCount() {
    const response = await fetch('/products/count');
    return response.json();
}

// Cargar la primera página al cargar la ventana
window.onload = async () => {
    const initialPage = 1;
    const { count: totalProducts } = await fetchProductsCount();
    const totalPages = Math.ceil(totalProducts / 6);

    const productList = await fetchProducts(initialPage);
    displayProducts(productList);
    displayPagination(totalPages, initialPage);
};


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
});