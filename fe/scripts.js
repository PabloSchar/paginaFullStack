

function addToCart(productId) {
    // Lógica para agregar productos al carrito
    console.log('Producto agregado al carrito:', productId);
}

function viewProduct(productId) {
    // Redirige a la página del producto individual
    window.location.href = `http://localhost:3000/product/${productId}`;
}

function displayProducts(productList) {
    let productsHTML = '';

    productList.forEach(element => {
        productsHTML +=
        `<div class="product-container">
            <h3>${element.productName}</h3>
            <img src="${element.productImage}" />
            <h1>${element.productPrice}</h1>
        </div>`
    });
    document.getElementById('page-content').innerHTML = productsHTML;
}

window.onload = async () => {
    const page = 1;
    const productlist = await (await fetch(`/products?page=${page}`)).json();
    displayProducts(productlist);
};

document.addEventListener("DOMContentLoaded", function () {
    const authButtonsContainer = document.getElementById("authButtons");
    const agregarProductoBtn = document.getElementById("agregarProductoBtn");

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

        if (agregarProductoBtn) {
            agregarProductoBtn.style.display = "block"; // Mostrar el botón de agregar productos
        }
    } else {
        // Si no hay un token, mostrar botón de iniciar sesión
        const loginButton = document.createElement("a");
        loginButton.href = "/user/login";
        loginButton.classList.add("btn", "btn-primary");
        loginButton.textContent = "Iniciar Sesión";
        authButtonsContainer.appendChild(loginButton);

        if (agregarProductoBtn) {
            agregarProductoBtn.style.display = "none"; // Ocultar el botón de agregar productos
        }
    }

    agregarProductoBtn.addEventListener("click", function () {
        // Redirige a la página para agregar nuevos productos
        window.location.href = "http://localhost:3000/products/addnew";
    });
});