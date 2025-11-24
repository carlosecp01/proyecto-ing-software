document.addEventListener('DOMContentLoaded', () => {
    
    const API_BASE_URL = 'http://localhost:8080/api'; 
    
    const productGrid = document.querySelector('.product-grid'); 
    // 🛑 ELIMINADO: const addProductCard = document.querySelector('.add-product-card');
    const prodContainer = document.getElementById('product-prod-container'); 
    const closeButton = document.querySelector('.close-button');
    const modalContentContainer = document.getElementById('modal-content-container');
    
    // Elementos para la Búsqueda
    const searchInput = document.querySelector('.search-input');
    
    const detailTemplate = document.getElementById('product-detail-template');
    // 🛑 ELIMINADO: const formTemplate = document.getElementById('product-form-template');
    
    let allProductsData = []; 

    // --- Funciones Auxiliares ---
    const showContainer = () => { prodContainer.style.display = 'flex'; };
    const hideContainer = () => { prodContainer.style.display = 'none'; modalContentContainer.innerHTML = ''; };

    // ------------------------------------------------------------------
    // A. LÓGICA DE CARGA Y BÚSQUEDA
    // ------------------------------------------------------------------
    
    const fetchAndRenderProducts = async () => {
        const searchText = searchInput.value.trim();

        const params = new URLSearchParams();
        
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
            
            // 2. Limpiar el grid (Ya no se mantiene el botón de añadir)
            productGrid.innerHTML = '';
            
            if (allProductsData.length === 0) {
                const emptyMessage = document.createElement('p');
                emptyMessage.style.cssText = 'color: #333; font-size: 1.2em; grid-column: 1 / -1; text-align: center; margin-top: 50px;';
                emptyMessage.textContent = 'No se encontraron productos.';
                productGrid.appendChild(emptyMessage);
                return; 
            }

            // 3. Renderizar productos
            allProductsData.forEach(product => {
                const card = createProductCard(product);
                productGrid.appendChild(card); // Añadido directamente al final
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
        // Seleccionamos todas las tarjetas de producto
        const productCards = document.querySelectorAll('.product-card'); 
        productCards.forEach(card => {
            card.addEventListener('click', () => {
                loadProductDetail(card);
            });
        });
    }

    // ------------------------------------------------------------------
    // B. LÓGICA DE DETALLE (Solo visualización)
    // ------------------------------------------------------------------

    const loadProductDetail = (card) => {
        modalContentContainer.innerHTML = ''; 
        const content = detailTemplate.content.cloneNode(true);
        modalContentContainer.appendChild(content);

        // Se cargan los datos, el botón de COMPRAR/Login es manejado por el HTML (cat_SR.html)
        modalContentContainer.querySelector('#prod-name').textContent = card.getAttribute('data-name');
        modalContentContainer.querySelector('#prod-description').textContent = card.getAttribute('data-description');
        modalContentContainer.querySelector('#prod-price').textContent = card.getAttribute('data-price');
        
        const prodImage = modalContentContainer.querySelector('#prod-image');
        prodImage.src = card.getAttribute('data-image');
        prodImage.alt = card.getAttribute('data-name');
        
        // 🛑 ELIMINADO: Lógica para botones de modificar y eliminar
        
        showContainer();
    };
    
    // 🛑 ELIMINADO: Funciones handleDeleteProduct, loadModifyForm, loadAddProductForm

    // ------------------------------------------------------------------
    // C. EVENTOS INICIALES
    // ------------------------------------------------------------------
    
    // Asignar evento de Búsqueda
    searchInput.addEventListener('input', fetchAndRenderProducts);
    
    // 🛑 ELIMINADO: Asignar evento al botón de añadir (addProductCard)

    closeButton.addEventListener('click', hideContainer);

    window.addEventListener('click', (event) => {
        if (event.target === prodContainer) { 
            hideContainer();
        }
    });
    
    // INICIO DE LA LÓGICA AL CARGAR LA PÁGINA
    fetchAndRenderProducts(); 
});