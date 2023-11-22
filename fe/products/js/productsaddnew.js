document.addEventListener('DOMContentLoaded', function () {
    const addProductForm = document.getElementById('addProductForm');

    addProductForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const productName = document.getElementById('productName').value;
        const productPrice = document.getElementById('productPrice').value;
        const productStock = document.getElementById('productStock').value;
        const productImage = document.getElementById('productImage').value;
        const productDescription = document.getElementById('productDescription').value;

        try {
            const response = await fetch('http://localhost:3000/products/addnew', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productName: productName,
                    productPrice: productPrice,
                    productStock: productStock,
                    productImage: productImage,
                    productDescription: productDescription,
                }),
            });

            if (response.ok) {
                const addedProduct = await response.json();
                console.log('Producto agregado:', addedProduct);

                // Puedes redirigir al usuario a la página de productos o hacer algo más
            } else {
                console.error('Error al agregar el producto');
            }
        } catch (error) {
            console.error('Error de red:', error);
        }
    });
});
