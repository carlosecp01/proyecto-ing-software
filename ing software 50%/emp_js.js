document.addEventListener("DOMContentLoaded", () => {
  const companyGrid = document.querySelector(".company-grid");
  const modalContainer = document.getElementById("company-prod-container");
  const modalContentContainer = document.getElementById("modal-content-container");
  const closeButton = document.querySelector(".close-button");
  const detailTemplate = document.getElementById("company-detail-template");

  // ========== FUNCIÓN: ABRIR MODAL CON LA EMPRESA ==========
  function attachCardEvents(card) {
    card.addEventListener("click", () => {
      const name = card.dataset.name || "Empresa";
      const description = card.dataset.description || "Sin descripción.";
      const logo = card.dataset.logo || "";
      const placeholderText = card.querySelector(".logo-placeholder")?.textContent || "";

      // Limpiar contenido anterior del modal
      modalContentContainer.innerHTML = "";

      // Clonar template
      const clone = detailTemplate.content.cloneNode(true);
      const compName = clone.querySelector("#comp-name");
      const compDesc = clone.querySelector("#comp-description");
      const compLogo = clone.querySelector("#comp-logo");
      const modalLogoText = clone.querySelector(".modal-logo-text");

      compName.textContent = name;
      compDesc.textContent = description;

      if (logo) {
        compLogo.src = logo;
        compLogo.style.display = "block";
        modalLogoText.style.display = "none";
      } else {
        compLogo.style.display = "none";
        modalLogoText.textContent = placeholderText || name.charAt(0).toUpperCase();
        modalLogoText.style.display = "block";
      }

      modalContentContainer.appendChild(clone);
      modalContainer.style.display = "block";
    });
  }

  // Adjuntar evento a las empresas que ya existen en el HTML
  document.querySelectorAll(".company-card").forEach(card => {
    attachCardEvents(card);
  });

  // ========== CERRAR MODAL ==========
  closeButton.addEventListener("click", () => {
    modalContainer.style.display = "none";
  });

  modalContainer.addEventListener("click", (e) => {
    if (e.target === modalContainer) {
      modalContainer.style.display = "none";
    }
  });

  // ========== FORMULARIO: AGREGAR NUEVAS EMPRESAS ==========
  const addCompanyForm = document.getElementById("add-company-form");
  if (addCompanyForm) {
    addCompanyForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const nameInput = document.getElementById("new-name");
      const descInput = document.getElementById("new-description");
      const logoListInput = document.getElementById("new-logo-list");
      const logoModalInput = document.getElementById("new-logo-modal");
      const placeholderInput = document.getElementById("new-placeholder");

      const name = nameInput.value.trim();
      const description = descInput.value.trim();
      const logoList = logoListInput.value.trim();
      const logoModal = logoModalInput.value.trim();
      const placeholder = (placeholderInput.value.trim() || name.substring(0, 3)).toUpperCase();

      if (!name || !description) {
        alert("Por favor, completa al menos el nombre y la descripción.");
        return;
      }

      // Crear nueva tarjeta de empresa
      const card = document.createElement("div");
      card.classList.add("company-card");
      card.dataset.name = name;
      card.dataset.description = description;
      card.dataset.logo = logoModal || logoList; // Prioriza logo para modal

      const logoContainer = document.createElement("div");
      logoContainer.classList.add("company-logo-container");

      if (logoList) {
        const img = document.createElement("img");
        img.src = logoList;
        img.alt = "Logo " + name;
        img.classList.add("company-logo");
        logoContainer.appendChild(img);
      }

      const placeholderEl = document.createElement("p");
      placeholderEl.classList.add("logo-placeholder");
      placeholderEl.textContent = placeholder;
      logoContainer.appendChild(placeholderEl);

      const nameEl = document.createElement("p");
      nameEl.classList.add("company-name");
      nameEl.textContent = name;

      card.appendChild(logoContainer);
      card.appendChild(nameEl);

      // Añadir al grid
      companyGrid.appendChild(card);

      // Activar click para abrir modal en la nueva empresa
      attachCardEvents(card);

      // Limpiar formulario
      addCompanyForm.reset();
      alert("Empresa agregada correctamente (solo visual).");
    });
  }
});
