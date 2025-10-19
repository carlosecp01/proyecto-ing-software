document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtener elementos principales del DOM
    const companyCards = document.querySelectorAll('.company-card');
    const prodContainer = document.getElementById('company-prod-container'); 
    const closeButton = prodContainer.querySelector('.close-button'); 
    const modalContentContainer = prodContainer.querySelector('#modal-content-container');
    
    // Obtener la plantilla de detalle de empresa
    const companyDetailTemplate = document.getElementById('company-detail-template');

    // ------------------------------------------------------------------
    // A. LÓGICA DE LA VENTANA EMERGENTE (MODAL)
    // ------------------------------------------------------------------
    
    const showModal = () => {
        prodContainer.style.display = 'flex'; 
    };

    const hideModal = () => {
        prodContainer.style.display = 'none'; 
        modalContentContainer.innerHTML = ''; 
    };
    
    const loadCompanyDetail = (companyCard) => {
        modalContentContainer.innerHTML = ''; 
        
        // Clonar la plantilla de detalle de empresa
        const content = companyDetailTemplate.content.cloneNode(true);
        modalContentContainer.appendChild(content);

        // Obtener referencias a los elementos inyectados dentro de la plantilla
        const compName = modalContentContainer.querySelector('#comp-name'); 
        const compDescription = modalContentContainer.querySelector('#comp-description');
        const compLogoImage = modalContentContainer.querySelector('#comp-logo');
        const modalLogoText = modalContentContainer.querySelector('.modal-logo-text'); 

        // Obtener datos del atributo data-* de la tarjeta
        const name = companyCard.getAttribute('data-name');
        const description = companyCard.getAttribute('data-description');
        const logoUrl = companyCard.getAttribute('data-logo');

        // Llenar el contenido principal del modal
        compName.textContent = name;
        compDescription.textContent = description;
        
        // Lógica de carga y visualización de logo (IMAGEN vs. TEXTO)
        if (logoUrl) {
            compLogoImage.src = logoUrl;
            compLogoImage.alt = `Logo de ${name}`;
            compLogoImage.style.display = 'block'; 
            
            modalLogoText.textContent = ''; 
            modalLogoText.style.display = 'none'; 
        } else {
            compLogoImage.style.display = 'none'; 
            
            modalLogoText.textContent = name; 
            modalLogoText.style.display = 'block'; 
        }

        // Simular contenido de lista de puntos
        const ulElement = modalContentContainer.querySelector('.comp-info ul');
        if (ulElement) {
            ulElement.innerHTML = `
                <li>Desarrollo de productos</li>
                <li>Estrategias de mercado</li>
                <li>Innovación constante</li>
            `; 
        }
        
        // Listener para el botón "Ver Productos"
        const viewProductsButton = modalContentContainer.querySelector('.view-products-button');
        if (viewProductsButton) {
            viewProductsButton.addEventListener('click', (event) => {
                event.preventDefault(); 
                // Navega a catalogo1.html y pasa el nombre de la empresa en minúsculas en el URL
                // El slug debe coincidir con el valor del filtro en catalogo1.html (ej: "sc-johnson")
                const companySlug = name.toLowerCase().replace(/\s+/g, '-');
                window.location.href = `catalogo1.html?empresa=${encodeURIComponent(companySlug)}`;
            });
        }

        showModal(); 
    };

    // Asignar eventos de clic a cada tarjeta de empresa
    companyCards.forEach(card => {
        card.addEventListener('click', () => {
            loadCompanyDetail(card);
        });
    });

    // Eventos para cerrar el modal
    closeButton.addEventListener('click', hideModal);

    // Cerrar el modal al hacer clic fuera de su contenido
    window.addEventListener('click', (event) => {
        if (event.target === prodContainer) { 
            hideModal();
        }
    });

    // Lógica para el menú lateral
    const menuToggle = document.getElementById('menu-toggle');
    const overlay = document.getElementById('overlay');
    if (menuToggle && overlay) {
        overlay.addEventListener('click', () => {
            menuToggle.checked = false;
        });
    }
});