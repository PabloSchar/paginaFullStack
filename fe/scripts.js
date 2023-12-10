function showSuccessAlert(message) {
    const successContainer = document.getElementById('success-container');

    const alertDiv = document.createElement('div');
    alertDiv.classList.add('alert', 'alert-success', 'mt-3', 'fade', 'show', 'small-alert');
    alertDiv.textContent = message;

    successContainer.innerHTML = '';
    successContainer.appendChild(alertDiv);

    alertDiv.style.position = 'absolute';
    alertDiv.style.top = `${window.scrollY + 70}px`;
    alertDiv.style.right = '10px';

    // Función para actualizar la posición basándose en el desplazamiento
    const updatePosition = () => {
        alertDiv.style.top = `${window.scrollY + 70}px`;
    };

    window.addEventListener('scroll', updatePosition);

    // Elimina el evento después de 3 segundos (3000 milisegundos)
    setTimeout(() => {
        alertDiv.style.display = 'none';
        window.removeEventListener('scroll', updatePosition);
    }, 3000);
}

function showErrorAlert(message) {
    const errorContainer = document.getElementById('error-container');

    const alertDiv = document.createElement('div');
    alertDiv.classList.add('alert', 'alert-danger', 'mt-3', 'fade', 'show', 'small-alert');
    alertDiv.textContent = message;

    errorContainer.innerHTML = '';
    errorContainer.appendChild(alertDiv);

    alertDiv.style.position = 'absolute';
    alertDiv.style.top = `${window.scrollY + 70}px`;
    alertDiv.style.right = '10px';

    // Función para actualizar la posición basándose en el desplazamiento
    const updatePosition = () => {
        alertDiv.style.top = `${window.scrollY + 70}px`;
    };

    window.addEventListener('scroll', updatePosition);

    // Elimina el evento después de 3 segundos (3000 milisegundos)
    setTimeout(() => {
        alertDiv.style.display = 'none';
        window.removeEventListener('scroll', updatePosition);
    }, 3000);
}

function displayProducts(productList) {
    const productsContainer = document.getElementById('page-content');
    productsContainer.innerHTML = '';
    productsContainer.style.marginTop = '20px';
    productsContainer.style.padding = '20px';
    
    const productsPerRow = 3;

    for (let i = 0; i < productList.length; i += productsPerRow) {
        const currentRow = document.createElement('div');
        currentRow.classList.add('row', 'mb-3', 'justify-content-center', 'align-items-center');
        

        for (let j = i; j < i + productsPerRow && j < productList.length; j++) {
            const productContainer = document.createElement('div');
            productContainer.classList.add('col-md-3', 'mb-3');
            productContainer.style.display = "flex";
            productContainer.style.width = '300px';
            productContainer.style.height = '420px';


            const productCard = document.createElement('div');
            productCard.classList.add('card', 'h-100');
            productCard.style.maxWidth = '100%';
            productCard.style.width = '100%';
            productCard.style.padding = '10px';
            productCard.style.height = '100%';
            productCard.style.justifyContent = 'space-between';
            productCard.style.borderRadius = '13px';
            productCard.style.borderColor = '#555555';

            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body', 'd-flex', 'flex-column', 'align-items-center');

            const productName = document.createElement('h4');
            productName.textContent = productList[j].productName;
            productName.classList.add('card-title', 'text-center', 'mb-3');
            productName.style.height = '50px';

            const imageLink = document.createElement('a');
            imageLink.href = `/products/detalles/${productList[j]._id}`;
            imageLink.style.textDecoration = 'none';
            imageLink.appendChild(createProductImage(productList[j].productImage));

            const productPrice = document.createElement('h1');
            productPrice.textContent = "$" + productList[j].productPrice;
            productPrice.classList.add('card-text', 'mb-3');
            productPrice.style.height = '20px';
            productPrice.style.fontSize = '33px';

            const addToCartButton = document.createElement('button');
            addToCartButton.textContent = 'Añadir al Carrito';
            addToCartButton.classList.add('btn', 'btn-primary', 'mt-3');
            addToCartButton.style.borderRadius = '5px';
            addToCartButton.style.height = 'auto';
            addToCartButton.style.fontSize = '18px';

            addToCartButton.addEventListener('click', function () {
                addToCart(productList[j]); // Llama a la función para añadir al carrito
            });

            cardBody.appendChild(productName);
            cardBody.appendChild(imageLink);
            cardBody.appendChild(productPrice);
            cardBody.appendChild(addToCartButton);

            productCard.appendChild(cardBody);

            productContainer.appendChild(productCard);
            currentRow.appendChild(productContainer);
        }

        productsContainer.appendChild(currentRow);
    }
}

function createProductImage(src) {
    const productImage = document.createElement('img');
    productImage.src = src;
    productImage.classList.add('card-img-top', 'mb-3', 'img-fluid');
    productImage.style.maxWidth = '90%';
    productImage.style.height = 'auto';
    productImage.style.objectFit = 'contain';
    return productImage;
}

function displayPagination(totalPages, currentPage, sortBy) {
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = '';
    paginationContainer.classList.add('d-flex', 'justify-content-center', 'my-3');

    for (let i = 1; i <= totalPages; i++) {
        (function (pageNumber) {
            const pageButton = document.createElement('button');
            pageButton.textContent = pageNumber;
            pageButton.classList.add('btn', 'btn-secondary', 'mx-1');
            pageButton.addEventListener('click', async function () {
                const productList = await fetchProducts(pageNumber, sortBy);
                displayProducts(productList);
                displayPagination(totalPages, pageNumber, sortBy);
            });

            if (pageNumber === currentPage) {
                pageButton.classList.add('active');
            }

            paginationContainer.appendChild(pageButton);
        })(i);
    }
}

async function fetchProductsCount(searchByName) {
    let apiUrl = '/products/count';

    if (searchByName) {
        apiUrl += `?searchByName=${encodeURIComponent(searchByName)}`;
    }

    const response = await fetch(apiUrl);
    return response.json();
}

async function fetchProducts(page, sortBy, searchByName) {
    let apiUrl = `/products?page=${page}&sortBy=${sortBy}`;

    if (searchByName) {
        apiUrl += `&searchByName=${encodeURIComponent(searchByName)}`;
    }

    const response = await fetch(apiUrl);
    return response.json();
}

let currentSortBy = '';

window.onload = async () => {
    const initialPage = 1;
    const sortBySelect = document.getElementById('sort-by-select');
    const searchInput = document.getElementById('search-input');
    const fetchAndDisplayProducts = async (page, sortBy, searchByName) => {
        const productList = await fetchProducts(page, sortBy, searchByName);

        // Ajusta la llamada a fetchProductsCount según si hay un nombre de búsqueda o no
        const { count: totalProducts } = await fetchProductsCount(searchByName || undefined);

        const totalPages = Math.ceil(totalProducts / 6);
        displayProducts(productList);
        displayPagination(totalPages, page, sortBy, searchByName);
    };

    await fetchAndDisplayProducts(initialPage, sortBySelect.value, '');

    sortBySelect.addEventListener('change', async function () {
        const searchByName = searchInput.value;
        currentSortBy = sortBySelect.value;
        await fetchAndDisplayProducts(1, currentSortBy, searchByName);
    });

    const handleSearch = async () => {
        const searchByName = searchInput.value;
        await fetchAndDisplayProducts(1, currentSortBy, searchByName);
    };

    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    });

    const searchButton = document.getElementById('search-button');
    if (searchButton) {
        searchButton.addEventListener('click', handleSearch);
    }
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

    const footerContainer = document.getElementById('footer-container');

    fetch('/footer/html/footer.html')
        .then(response => response.text())
        .then(html => {
            footerContainer.innerHTML = html;
        })
        .catch(error => console.error('Error al cargar el encabezado:', error));
});

function addToCart(product) {
    const token = localStorage.getItem('token');

    if (token) {
        const productData = {
            productId: product._id,
            productPrice: product.productPrice,
            productStock: product.productStock,
        };

        fetch('http://localhost:3000/carrito/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            body: JSON.stringify(productData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al añadir el producto al carrito');
            }
            return response.json();
        })
        .then(data => {
            showSuccessAlert('Producto añadido al carrito correctamente');
        })
        .catch(error => {
            showErrorAlert('Error al añadir el producto al carrito');
            console.error('Error al añadir el producto al carrito:', error);
        });
    } else {
        // Si el usuario no está autenticado, se redirige a la página de inicio de sesión
        window.location.href = 'http://localhost:3000/user/login';
    }
}