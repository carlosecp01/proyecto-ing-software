document.addEventListener('DOMContentLoaded', () => {
    
    const API_BASE_URL = 'http://localhost:8080/api'; 
    
    const productGrid = document.querySelector('.product-grid'); 
    const addProductCard = document.querySelector('.add-product-card');
    const prodContainer = document.getElementById('product-prod-container'); 
    const closeButton = document.querySelector('.close-button');
    const modalContentContainer = document.getElementById('modal-content-container');
    
    // Elementos para la Búsqueda
    const searchInput = document.querySelector('.search-input');
    // brandFilter y categoryFilter ya no se usan
    
    const detailTemplate = document.getElementById('product-detail-template');
    const formTemplate = document.getElementById('product-form-template');
    
    let allProductsData = []; 

    // --- Funciones Auxiliares ---
    const showContainer = () => { prodContainer.style.display = 'flex'; };
    const hideContainer = () => { prodContainer.style.display = 'none'; modalContentContainer.innerHTML = ''; };

    // ------------------------------------------------------------------
    // A. LÓGICA DE CARGA Y BÚSQUEDA
    // ------------------------------------------------------------------
    
    const fetchAndRenderProducts = async () => {
        const searchText = searchInput.value.trim();

        // 1. Construir la URL con el parámetro de búsqueda
        const params = new URLSearchParams();
        
        // Si hay texto de búsqueda, lo añade al URL: /api/productos?search=texto
        if (searchText) {
            params.append('search', searchText); 
        }
        
        const url = `${API_BASE_URL}/productos?${params.toString()}`;
        console.log("Fetching URL:", url);

        try {
            const response = await fetch(url);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Fallo al obtener la lista de productos. Código: ${response.status}. Mensaje: ${errorText.substring(0, 150)}...`);
            }
            allProductsData = await response.json(); 
            
            // 2. Limpiar y mantener el botón de añadir
            productGrid.innerHTML = '';
            productGrid.appendChild(addProductCard); 

            if (allProductsData.length === 0) {
                const emptyMessage = document.createElement('p');
                emptyMessage.style.cssText = 'color: #333; font-size: 1.2em; grid-column: 1 / -1; text-align: center; margin-top: 50px;';
                emptyMessage.textContent = 'No se encontraron productos.';
                productGrid.insertBefore(emptyMessage, addProductCard);
                return; 
            }

            // 3. Renderizar productos
            allProductsData.forEach(product => {
                const card = createProductCard(product);
                productGrid.insertBefore(card, addProductCard); 
            });

            attachCardEventListeners(); 

        } catch (error) {
            console.error('Error al cargar productos:', error);
            productGrid.innerHTML = `<p style="color: red; grid-column: 1 / -1; text-align: center; margin-top: 50px;">
                ❌ Error al cargar productos: ${error.message}. 
                Asegúrate de que el servidor Spring Boot esté corriendo.
            </p>`;
        }
    };

    const createProductCard = (product) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-name', product.nombre || '');
        
        const displayPrice = product.precioVenta || product.precioCompra;
        card.setAttribute('data-price', `${displayPrice}$`); 
        
        card.setAttribute('data-image', product.logo || './img/default.png'); 
        card.setAttribute('data-description', product.descripcion || '');
        card.setAttribute('data-id', product.id); 
        
        card.innerHTML = `
            <div class="product-image-container">
                <img src="${product.logo || './img/default.png'}" alt="${product.nombre}" class="product-image" />
            </div>
            <p class="product-name">${product.nombre}</p>
            <p class="product-price">${displayPrice}$</p>
        `;
        return card;
    };
    
    const attachCardEventListeners = () => {
        const productCards = document.querySelectorAll('.product-card:not(.add-product-card)');
        productCards.forEach(card => {
            card.addEventListener('click', () => {
                loadProductDetail(card);
            });
        });
    }

    // ------------------------------------------------------------------
    // B. LÓGICA DE DETALLE Y ADMINISTRACIÓN (POST, PUT, DELETE)
    // ------------------------------------------------------------------

    const loadProductDetail = (card) => {
        modalContentContainer.innerHTML = ''; 
        const content = detailTemplate.content.cloneNode(true);
        modalContentContainer.appendChild(content);

        const productId = parseInt(card.getAttribute('data-id'));
        const productData = allProductsData.find(p => p.id === productId); 

        modalContentContainer.querySelector('#prod-name').textContent = card.getAttribute('data-name');
        modalContentContainer.querySelector('#prod-description').textContent = card.getAttribute('data-description');
        modalContentContainer.querySelector('#prod-price').textContent = card.getAttribute('data-price');
        
        const prodImage = modalContentContainer.querySelector('#prod-image');
        prodImage.src = card.getAttribute('data-image');
        prodImage.alt = card.getAttribute('data-name');

        const modifyButton = modalContentContainer.querySelector('.modify-button');
        const deleteButton = modalContentContainer.querySelector('.delete-button');

        if (deleteButton) {
            deleteButton.addEventListener('click', () => {
                if (confirm(`¿Estás seguro de que deseas eliminar el producto: ${card.getAttribute('data-name')}?`)) {
                    handleDeleteProduct(productId);
                }
            });
        }

        if (modifyButton) {
            modifyButton.addEventListener('click', () => {
                if (productData) {
                    loadModifyForm(productData); 
                } else {
                    alert("Error: No se encontraron datos del producto para modificar.");
                }
            });
        }

        showContainer();
    };
    
    const handleDeleteProduct = async (productId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/productos/${productId}`, {
                method: 'DELETE',
            });

            if (response.status === 204 || response.ok) { 
                alert('🗑️ Producto eliminado correctamente.');
                hideContainer();
                fetchAndRenderProducts(); 
            } else {
                alert(`❌ Error ${response.status}: Fallo al eliminar el producto. Revisa el log del servidor.`);
            }
        } catch (error) {
            console.error('Error de conexión/red al eliminar:', error);
            alert('❌ Error de conexión al eliminar. ¿El servidor Spring Boot está corriendo?');
        }
    };

    const loadModifyForm = (product) => {
        modalContentContainer.innerHTML = ''; 
        const content = formTemplate.content.cloneNode(true);
        modalContentContainer.appendChild(content);

        const form = modalContentContainer.querySelector('#add-product-form');
        const imageUrlInput = document.getElementById('new-product-image-url');
        
        // 1. PRELLENAR
        modalContentContainer.querySelector('h2').textContent = 'Modificar Producto';
        document.getElementById('new-product-name').value = product.nombre || '';
        document.getElementById('new-product-description').value = product.descripcion || '';
        
        const priceValue = product.precioVenta; 
        document.getElementById('new-product-price').value = priceValue ? priceValue.toString() : ''; 
        
        // Mantenemos los campos de Marca/Categoría para el CRUD (Creación/Modificación)
        document.getElementById('new-product-brand').value = (product.empresa?.nombre || '').toLowerCase();
        document.getElementById('new-product-category').value = (product.categoria?.nombre || '').toLowerCase();

        if (imageUrlInput) {
            imageUrlInput.value = product.logo || '';
        }
        
        // 2. CAMBIAR EL TEXTO DEL BOTÓN
        form.querySelector('.save-button').textContent = 'GUARDAR CAMBIOS';
        
        // 3. CAMBIAR EL EVENT LISTENER a una petición PUT
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            const modifiedProduct = {
                name: document.getElementById('new-product-name').value,
                description: document.getElementById('new-product-description').value,
                price: parseFloat(document.getElementById('new-product-price').value), 
                brand: document.getElementById('new-product-brand').value,
                category: document.getElementById('new-product-category').value,
                imageUrl: imageUrlInput ? imageUrlInput.value.trim() : product.logo || '', 
            };
            
            try {
                const response = await fetch(`${API_BASE_URL}/productos/${product.id}`, { 
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(modifiedProduct),
                });

                if (response.ok) {
                    alert('✅ Producto modificado correctamente.');
                    hideContainer();
                    fetchAndRenderProducts(); 
                } else {
                    alert(`❌ Error ${response.status}: Fallo al modificar el producto. Revisa el log del servidor.`);
                }
            } catch (error) {
                console.error('Error de conexión/red al modificar:', error);
                alert('❌ Error de conexión. ¿El servidor Spring Boot está corriendo?');
            }
        });
        
        showContainer();
    };

    const loadAddProductForm = () => {
        modalContentContainer.innerHTML = ''; 
        const content = formTemplate.content.cloneNode(true);
        modalContentContainer.appendChild(content);

        const form = modalContentContainer.querySelector('#add-product-form');
        const imageUrlInput = document.getElementById('new-product-image-url');
        
        modalContentContainer.querySelector('h2').textContent = 'Añadir Nuevo Producto';
        form.querySelector('.save-button').textContent = 'GUARDAR PRODUCTO';
        
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            const newProduct = {
                name: document.getElementById('new-product-name').value,
                description: document.getElementById('new-product-description').value,
                price: parseFloat(document.getElementById('new-product-price').value), 
                brand: document.getElementById('new-product-brand').value,
                category: document.getElementById('new-product-category').value,
                imageUrl: imageUrlInput ? imageUrlInput.value.trim() : ''
            };
            
            try {
                const response = await fetch(`${API_BASE_URL}/productos`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newProduct),
                });

                if (response.ok) {
                    alert('✅ Producto añadido correctamente. Actualizando catálogo...');
                    hideContainer();
                    fetchAndRenderProducts(); 
                } else {
                    alert(`❌ Error ${response.status}: Fallo al añadir el producto. Revisa el log del servidor.`);
                }
            } catch (error) {
                console.error('Error de conexión/red:', error);
                alert('❌ Error de conexión. ¿El servidor Spring Boot está corriendo en http://localhost:8080?');
            }
        });

        showContainer();
    };


    // ------------------------------------------------------------------
    // C. EVENTOS INICIALES
    // ------------------------------------------------------------------
    
    // Asignar evento de Búsqueda
    searchInput.addEventListener('input', fetchAndRenderProducts);
    // 🛑 Los eventos de brandFilter y categoryFilter han sido eliminados.
    
    // Asignar evento al botón de añadir
    addProductCard.addEventListener('click', (e) => {
        e.preventDefault(); 
        loadAddProductForm();
    });

    closeButton.addEventListener('click', hideContainer);

    window.addEventListener('click', (event) => {
        if (event.target === prodContainer) { 
            hideContainer();
        }
    });
    
    // INICIO DE LA LÓGICA AL CARGAR LA PÁGINA
    fetchAndRenderProducts(); 
});