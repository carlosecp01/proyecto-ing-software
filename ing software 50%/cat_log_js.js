document.addEventListener('DOMContentLoaded', () => {
    
    // ⚠️ IMPORTANTE: Ajusta esta URL si tu puerto de Spring Boot es diferente a 8080
    const API_BASE_URL = 'http://localhost:8080/api'; 
    
    // 1. Obtener elementos principales del DOM
    const productGrid = document.querySelector('.product-grid'); 
    const prodContainer = document.getElementById('product-prod-container'); 
    const closeButton = document.querySelector('.close-button');
    const modalContentContainer = document.getElementById('modal-content-container');
    const cartIcon = document.getElementById('open-cart-btn');
    const cartCountElement = document.getElementById('cart-count');
    
    // Elementos para la Búsqueda (solo se mantiene searchInput)
    const searchInput = document.querySelector('.search-input');
    // 🛑 brandFilter y categoryFilter han sido eliminados de aquí
    
    // Obtener las plantillas (templates)
    const detailTemplate = document.getElementById('product-detail-template');
    const cartTemplate = document.getElementById('cart-template'); 

    // Estado del Carrito
    let shoppingCart = [];
    let allProductsData = []; 

    // --- Funciones Auxiliares del Modal ---
    const showContainer = () => { prodContainer.style.display = 'flex'; };
    const hideContainer = () => { prodContainer.style.display = 'none'; modalContentContainer.innerHTML = ''; };

    // ------------------------------------------------------------------
    // Funciones de Persistencia (Local Storage)
    // ------------------------------------------------------------------

    const saveCartToStorage = () => {
        localStorage.setItem('wayneCorpCart', JSON.stringify(shoppingCart));
    };

    const loadCartFromStorage = () => {
        const storedCart = localStorage.getItem('wayneCorpCart');
        if (storedCart) {
            shoppingCart = JSON.parse(storedCart);
        }
        updateCartCount();
    };

    // ------------------------------------------------------------------
    // Funciones de Carrito de Compras (SIN MODIFICACIONES)
    // ------------------------------------------------------------------
    
    const updateCartCount = () => {
        const totalItems = shoppingCart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = totalItems;
    };
    
    const removeFromCart = (itemName) => {
        shoppingCart = shoppingCart.filter(item => item.name !== itemName);
        updateCartDisplay();
        saveCartToStorage();
    };
    
    const changeQuantity = (itemName, newQuantity) => {
        const item = shoppingCart.find(i => i.name === itemName);
        const quantity = parseInt(newQuantity);

        if (item && !isNaN(quantity) && quantity > 0) {
            item.quantity = quantity;
        } else if (item && quantity <= 0) {
            removeFromCart(itemName);
            return; 
        }
        updateCartDisplay(); 
        saveCartToStorage();
    };

    const updateCartDisplay = () => {
        const listContainer = document.getElementById('cart-items-list');
        const totalItemsElement = document.getElementById('cart-total-items');
        const totalPriceElement = document.getElementById('cart-total-price');
        
        if (!listContainer) return; 
        
        listContainer.innerHTML = '';
        
        let totalItems = 0;
        let totalPrice = 0;

        if (shoppingCart.length === 0) {
            listContainer.innerHTML = '<p style="text-align: center; margin-top: 20px; color: #777;">El carrito está vacío.</p>';
        } else {
            shoppingCart.forEach((item) => {
                const subtotal = item.price * item.quantity;
                totalItems += item.quantity;
                totalPrice += subtotal;
                
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('cart-item');
                const shortName = item.name.length > 25 ? item.name.substring(0, 22) + '...' : item.name;
                
                itemDiv.innerHTML = `
                    <div class="item-name-info">${shortName}</div>
                    <div class="item-controls">
                        <input type="number" 
                                class="quantity-input-cart" 
                                value="${item.quantity}" 
                                min="1" 
                                data-name="${item.name}"
                        >
                        <span class="price-display">x ${item.price.toFixed(2)}$ = ${subtotal.toFixed(2)}$</span>
                        <button class="remove-item-btn" data-name="${item.name}">&times;</button>
                    </div>
                `;
                listContainer.appendChild(itemDiv);
            });
            
            document.querySelectorAll('.quantity-input-cart').forEach(input => {
                input.addEventListener('change', (e) => {
                    const name = e.target.getAttribute('data-name');
                    changeQuantity(name, e.target.value);
                });
            });

            document.querySelectorAll('.remove-item-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const name = e.target.getAttribute('data-name');
                    removeFromCart(name);
                });
            });
        }
        
        totalItemsElement.textContent = totalItems;
        totalPriceElement.textContent = totalPrice.toFixed(2) + '$';
        updateCartCount();
    };
    
    const addToCart = (productName, productPrice, quantity) => {
        
        const existingItem = shoppingCart.find(item => item.name === productName);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            shoppingCart.push({
                name: productName,
                price: productPrice,
                quantity: quantity
            });
        }
        
        updateCartCount();
        saveCartToStorage();
        hideContainer(); 
    };
    
    const loadCart = () => {
        modalContentContainer.innerHTML = ''; 
        const content = cartTemplate.content.cloneNode(true);
        modalContentContainer.appendChild(content);
        
        updateCartDisplay(); 
        
        const checkoutBtn = modalContentContainer.querySelector('.checkout-button');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (shoppingCart.length === 0) {
                    alert("El carrito está vacío. Añade productos antes de finalizar la compra.");
                    return;
                }
                
                const finalPrice = shoppingCart.reduce((total, item) => total + (item.price * item.quantity), 0);
                
                const orderData = {
                    items: shoppingCart,
                    total: finalPrice.toFixed(2),
                    timestamp: new Date().toISOString()
                };
                localStorage.setItem('lastOrderData', JSON.stringify(orderData));
                
                window.location.href = `tra_log.html?total=${finalPrice.toFixed(2)}`;
            });
        }
        
        showContainer();
    };

    // ------------------------------------------------------------------
    // A. LÓGICA DE CARGA Y BÚSQUEDA (LLAMA AL BACKEND)
    // ------------------------------------------------------------------
    
    const fetchAndRenderProducts = async () => {
        const searchText = searchInput.value.trim();

        // 1. Construir la URL con parámetros de consulta
        const params = new URLSearchParams();
        
        // 🛑 SOLO AÑADIMOS EL PARÁMETRO DE BÚSQUEDA
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
            
            // 2. Limpiar la cuadrícula
            productGrid.innerHTML = '';

            if (allProductsData.length === 0) {
                const emptyMessage = document.createElement('p');
                emptyMessage.style.cssText = 'color: #333; font-size: 1.2em; grid-column: 1 / -1; text-align: center; margin-top: 50px;';
                emptyMessage.textContent = searchText ? `No se encontraron resultados para "${searchText}".` : 'No hay productos disponibles.';
                productGrid.appendChild(emptyMessage);
                return; 
            }

            // 3. Renderizar productos
            allProductsData.forEach(product => {
                const card = createProductCard(product);
                productGrid.appendChild(card); 
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
        
        const displayPrice = product.precioVenta || 'N/A';
        card.setAttribute('data-price', displayPrice); 
        
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
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            card.addEventListener('click', () => {
                loadProductDetail(card);
            });
        });
    }


    // ------------------------------------------------------------------
    // B. LÓGICA DE DETALLE Y CARRITO (MANTENIDA)
    // ------------------------------------------------------------------
    
    const loadProductDetail = (card) => {
        modalContentContainer.innerHTML = ''; 
        const content = detailTemplate.content.cloneNode(true);
        modalContentContainer.appendChild(content);

        const name = card.getAttribute('data-name');
        const price = parseFloat(card.getAttribute('data-price')); 
        const image = card.getAttribute('data-image');
        const description = card.getAttribute('data-description');

        const prodNameElement = modalContentContainer.querySelector('#prod-name'); 
        const prodDescriptionElement = modalContentContainer.querySelector('#prod-description');
        const prodPriceElement = modalContentContainer.querySelector('#prod-price');
        const prodImageElement = modalContentContainer.querySelector('#prod-image');
        const addToCartBtn = modalContentContainer.querySelector('#add-to-cart-btn');
        const quantityInput = modalContentContainer.querySelector('#product-quantity');
        
        const prodDataName = modalContentContainer.querySelector('#prod-data-name');
        const prodDataPrice = modalContentContainer.querySelector('#prod-data-price');


        prodNameElement.textContent = name;
        prodPriceElement.textContent = price.toFixed(2) + '$';
        prodImageElement.src = image;
        prodImageElement.alt = name;
        prodDescriptionElement.textContent = description;
        
        prodDataName.value = name;
        prodDataPrice.value = price;

        addToCartBtn.addEventListener('click', () => {
            const itemName = prodDataName.value;
            const itemPrice = parseFloat(prodDataPrice.value);
            const quantity = parseInt(quantityInput.value); 

            if (isNaN(quantity) || quantity <= 0) {
                alert("Por favor, introduce una cantidad válida (número positivo) en el campo 'Cantidad'.");
                return;
            }
            
            addToCart(itemName, itemPrice, quantity);
        });

        showContainer();
    };

    // ------------------------------------------------------------------
    // C. EVENTOS INICIALES
    // ------------------------------------------------------------------
    
    // Conectar el input de búsqueda con la función que llama al backend
    searchInput.addEventListener('input', fetchAndRenderProducts);
    // 🛑 Los eventos de brandFilter y categoryFilter han sido eliminados.
    
    // Evento para abrir el carrito
    cartIcon.addEventListener('click', loadCart);

    // Eventos para cerrar el contenedor
    closeButton.addEventListener('click', hideContainer);

    // Cierre al hacer clic fuera del modal
    window.addEventListener('click', (event) => {
        if (event.target === prodContainer) { 
            hideContainer();
        }
    });

    // 🛑 La función checkUrlForFilter() fue eliminada ya que no hay filtros que aplicar desde URL.

    // Inicialización: Cargar el carrito guardado y los productos al cargar la página.
    loadCartFromStorage();
    fetchAndRenderProducts(); 
});