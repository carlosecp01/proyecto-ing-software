document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtener elementos principales del DOM
    const productCards = document.querySelectorAll('.product-card'); 
    const prodContainer = document.getElementById('product-prod-container'); 
    const closeButton = document.querySelector('.close-button');
    const modalContentContainer = document.getElementById('modal-content-container');
    const cartIcon = document.getElementById('open-cart-btn'); // Elemento para abrir el carrito
    const cartCountElement = document.getElementById('cart-count');
    
    // Elementos para el Filtrado y Búsqueda
    const searchInput = document.querySelector('.search-input');
    const brandFilter = document.getElementById('brand-filter'); 
    const categoryFilter = document.getElementById('category-filter');
    
    // Obtener las plantillas (templates)
    const detailTemplate = document.getElementById('product-detail-template');
    const cartTemplate = document.getElementById('cart-template'); 

    // Estado del Carrito
    let shoppingCart = [];

    // ------------------------------------------------------------------
    // Funciones de Persistencia (Local Storage)
    // ------------------------------------------------------------------

    /** Guarda el estado actual del carrito en el Local Storage del navegador. */
    const saveCartToStorage = () => {
        localStorage.setItem('wayneCorpCart', JSON.stringify(shoppingCart));
    };

    /** Carga el carrito guardado del Local Storage al inicio. */
    const loadCartFromStorage = () => {
        const storedCart = localStorage.getItem('wayneCorpCart');
        if (storedCart) {
            // Si hay datos, se parsean y se cargan
            shoppingCart = JSON.parse(storedCart);
        }
        updateCartCount(); // Actualiza el contador en el icono
    };

    // ------------------------------------------------------------------
    // Funciones de Carrito de Compras
    // ------------------------------------------------------------------
    
    const updateCartCount = () => {
        const totalItems = shoppingCart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = totalItems;
    };
    
    /**
     * Elimina un producto del carrito y actualiza la persistencia.
     */
    const removeFromCart = (itemName) => {
        shoppingCart = shoppingCart.filter(item => item.name !== itemName);
        updateCartDisplay();
        saveCartToStorage(); // <-- Guardar después de modificar
    };
    
    /**
     * Cambia la cantidad de un producto existente y actualiza la persistencia.
     */
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
        saveCartToStorage(); // <-- Guardar después de modificar
    };

    /**
     * Dibuja el contenido del carrito con los nuevos controles.
     */
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
            
            // Adjuntar eventos de escucha para los nuevos elementos creados
            document.querySelectorAll('.quantity-input-cart').forEach(input => {
                input.addEventListener('change', (e) => {
                    const name = e.target.getAttribute('data-name');
                    changeQuantity(name, e.target.value);
                });
            });

            document.querySelectorAll('.remove-item-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const name = e.target.getAttribute('data-name');
                    // Eliminación instantánea (sin popup)
                    removeFromCart(name);
                });
            });
        }
        
        totalItemsElement.textContent = totalItems;
        totalPriceElement.textContent = totalPrice.toFixed(2) + '$';
        updateCartCount();
    };
    
    /**
     * Añade un producto al carrito sin mostrar ningún mensaje de confirmación feo (popup).
     */
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
        saveCartToStorage(); // <-- Guardar después de modificar
        hideContainer(); // Cierra el modal inmediatamente.
    };
    
    /**
     * Carga el modal del carrito y adjunta la lógica de finalización de compra.
     */
    const loadCart = () => {
        modalContentContainer.innerHTML = ''; 
        const content = cartTemplate.content.cloneNode(true);
        modalContentContainer.appendChild(content);
        
        // Rellenar el contenido del carrito
        updateCartDisplay(); 
        
        // Asignar evento al botón de finalizar compra (REDIRECCIÓN A PASARELA)
        const checkoutBtn = modalContentContainer.querySelector('.checkout-button');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (shoppingCart.length === 0) {
                    alert("El carrito está vacío. Añade productos antes de finalizar la compra.");
                    return;
                }
                
                // Cálculo del precio final 
                const finalPrice = shoppingCart.reduce((total, item) => total + (item.price * item.quantity), 0);
                
                // 1. Guardar el carrito actual como "última orden" para su posterior procesamiento en tra_log.html (MODIFICACIÓN)
                const orderData = {
                    items: shoppingCart,
                    total: finalPrice.toFixed(2),
                    timestamp: new Date().toISOString()
                };
                localStorage.setItem('lastOrderData', JSON.stringify(orderData));
                
                // 2. Redirigir a tra_log.html pasando solo el total (para rellenar el campo)
                window.location.href = `tra_log.html?total=${finalPrice.toFixed(2)}`;
            });
        }
        
        showContainer();
    };

    // ------------------------------------------------------------------
    // A. LÓGICA DE FILTRADO Y BÚSQUEDA (Sin Cambios)
    // ------------------------------------------------------------------
    
    const filterProducts = () => {
        const searchText = searchInput.value.toLowerCase().trim();
        const selectedBrand = brandFilter.value; 
        const selectedCategory = categoryFilter.value;

        productCards.forEach(card => {
            const name = card.getAttribute('data-name').toLowerCase();
            const brand = card.getAttribute('data-brand');
            const category = card.getAttribute('data-category');
            
            let matchesSearch = true;
            let matchesBrand = true;
            let matchesCategory = true;

            if (searchText && !name.includes(searchText)) {
                matchesSearch = false;
            }

            if (selectedBrand !== 'all' && brand !== selectedBrand) {
                matchesBrand = false;
            }

            if (selectedCategory !== 'all' && category !== selectedCategory) {
                matchesCategory = false;
            }

            if (matchesSearch && matchesBrand && matchesCategory) {
                card.style.display = 'block'; 
            } else {
                card.style.display = 'none';
            }
        });
    };
    
    const checkUrlForFilter = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const companyParam = urlParams.get('empresa'); 

        if (companyParam) {
            const filterValue = companyParam.replace(/-/g, ' '); 
            const option = brandFilter.querySelector(`option[value="${filterValue}"]`);
            
            if (option) {
                brandFilter.value = filterValue;
            }
        }
        filterProducts();
    };

    searchInput.addEventListener('input', filterProducts);
    brandFilter.addEventListener('change', filterProducts);
    categoryFilter.addEventListener('change', filterProducts);
    
    // ------------------------------------------------------------------
    // B. LÓGICA DE CONTENEDOR DE MODAL (Sin Cambios en Show/Hide)
    // ------------------------------------------------------------------
    
    const showContainer = () => {
        prodContainer.style.display = 'flex'; 
    };

    const hideContainer = () => {
        prodContainer.style.display = 'none'; 
        modalContentContainer.innerHTML = '';
    };
    
    const loadProductDetail = (product) => {
        modalContentContainer.innerHTML = ''; 
        const content = detailTemplate.content.cloneNode(true);
        modalContentContainer.appendChild(content);

        const prodNameElement = modalContentContainer.querySelector('#prod-name'); 
        const prodDescriptionElement = modalContentContainer.querySelector('#prod-description');
        const prodPriceElement = modalContentContainer.querySelector('#prod-price');
        const prodImageElement = modalContentContainer.querySelector('#prod-image');
        const addToCartBtn = modalContentContainer.querySelector('#add-to-cart-btn');
        const quantityInput = modalContentContainer.querySelector('#product-quantity');
        
        const prodDataName = modalContentContainer.querySelector('#prod-data-name');
        const prodDataPrice = modalContentContainer.querySelector('#prod-data-price');


        const name = product.getAttribute('data-name');
        const price = parseFloat(product.getAttribute('data-price')); 
        const image = product.getAttribute('data-image');
        const description = product.getAttribute('data-description');

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

    // Asignar eventos de clic a las tarjetas de producto
    productCards.forEach(card => {
        card.addEventListener('click', () => {
            loadProductDetail(card);
        });
    });

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
    
    // Inicialización: Cargar el carrito guardado al cargar la página.
    checkUrlForFilter();
    loadCartFromStorage(); 
});