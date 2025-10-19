document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtener elementos principales del DOM
    const productCards = document.querySelectorAll('.product-card:not(.add-product-card)');
    const addProductCard = document.querySelector('.add-product-card');
    const prodContainer = document.getElementById('product-prod-container'); 
    const closeButton = document.querySelector('.close-button');
    const modalContentContainer = document.getElementById('modal-content-container');
    
    // Elementos para el Filtrado y Búsqueda
    const searchInput = document.querySelector('.search-input');
    const brandFilter = document.getElementById('brand-filter'); 
    const categoryFilter = document.getElementById('category-filter');
    
    // Obtener las plantillas (templates)
    const detailTemplate = document.getElementById('product-detail-template');
    const formTemplate = document.getElementById('product-form-template');

    // ------------------------------------------------------------------
    // A. LÓGICA DE FILTRADO Y BÚSQUEDA
    // ------------------------------------------------------------------
    
    const filterProducts = () => {
        const searchText = searchInput.value.toLowerCase().trim();
        const selectedBrand = brandFilter.value; 
        const selectedCategory = categoryFilter.value;

        productCards.forEach(card => {
            // Usamos data-name, data-brand y data-category
            const name = card.getAttribute('data-name').toLowerCase();
            const brand = card.getAttribute('data-brand');
            const category = card.getAttribute('data-category');
            
            let matchesSearch = true;
            let matchesBrand = true;
            let matchesCategory = true;

            // 1. Filtrar por búsqueda de texto 
            if (searchText && !name.includes(searchText)) {
                matchesSearch = false;
            }

            // 2. Filtrar por Empresa (Marca)
            if (selectedBrand !== 'all' && brand !== selectedBrand) {
                matchesBrand = false;
            }

            // 3. Filtrar por Categoría
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
    
    // Función para leer el parámetro de la URL y aplicar el filtro
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
    // B. LÓGICA DE CONTENEDOR DE PRODUCTO
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

        const prodName = modalContentContainer.querySelector('#prod-name'); 
        const prodDescription = modalContentContainer.querySelector('#prod-description');
        const prodPrice = modalContentContainer.querySelector('#prod-price');
        const prodImage = modalContentContainer.querySelector('#prod-image');

        const name = product.getAttribute('data-name');
        const price = product.getAttribute('data-price');
        const image = product.getAttribute('data-image');
        const description = product.getAttribute('data-description');

        prodName.textContent = name;
        prodPrice.textContent = price;
        prodImage.src = image;
        prodImage.alt = name;
        prodDescription.textContent = description;

        showContainer();
    };

    // Función para llenar el contenedor con el FORMULARIO de añadir (CORREGIDA)
    const loadAddProductForm = () => {
        modalContentContainer.innerHTML = ''; 
        const content = formTemplate.content.cloneNode(true);
        modalContentContainer.appendChild(content);

        const form = modalContentContainer.querySelector('#add-product-form');
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            
            // Obtener todos los valores del formulario
            const name = document.getElementById('new-product-name').value;
            const description = document.getElementById('new-product-description').value;
            const price = document.getElementById('new-product-price').value;
            const brand = document.getElementById('new-product-brand').value;
            const category = document.getElementById('new-product-category').value;
            
            // Obtener el nombre del archivo subido
            const fileInput = document.getElementById('new-product-image-file');
            const fileName = fileInput.files.length > 0 ? fileInput.files[0].name : "N/A";
            
            // Mensaje de simulación con todos los datos
            const alertMessage = `
                Producto listo para enviar al servidor:
                Nombre: ${name}
                Descripción: ${description.substring(0, 30)}...
                Precio: $${price}
                Empresa: ${brand}
                Categoría: ${category}
                Archivo Subido: ${fileName}
                
                (El archivo ${fileName} solo puede ser procesado por código de servidor/backend.)
            `;

            alert(alertMessage);
            hideContainer();
        });

        showContainer();
    };

    // Asignar eventos de clic 
    productCards.forEach(card => {
        card.addEventListener('click', () => {
            loadProductDetail(card);
        });
    });

    addProductCard.addEventListener('click', () => {
        loadAddProductForm();
    });

    // Eventos para cerrar el contenedor
    closeButton.addEventListener('click', hideContainer);

    window.addEventListener('click', (event) => {
        if (event.target === prodContainer) { 
            hideContainer();
        }
    });
    
    checkUrlForFilter();
});