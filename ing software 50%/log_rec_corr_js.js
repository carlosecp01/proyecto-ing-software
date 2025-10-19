document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('recuperar-correo-form');
    const inputCorreo = document.getElementById('Confirmar_Correo');
    
    // Regex simple para validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function showError(inputElement, message) {
        const errorElement = document.getElementById(`error-${inputElement.id}`);
        if (errorElement) {
            errorElement.textContent = message;
        }
        inputElement.style.border = '2px solid red';
    }

    function clearErrors() {
        const allInputs = form.querySelectorAll('input');
        allInputs.forEach(input => {
            input.style.border = '';
        });
        const allErrors = form.querySelectorAll('.error-message');
        allErrors.forEach(error => {
            error.textContent = '';
        });
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        clearErrors();

        let isValid = true;
        const correo = inputCorreo.value.trim();
        
        // 1. Validar campo no vacío
        if (correo === '') {
            showError(inputCorreo, 'El correo electrónico es obligatorio.');
            isValid = false;
        } 
        // 2. Validar formato de correo
        else if (!emailRegex.test(correo)) {
            showError(inputCorreo, 'Por favor, ingrese un formato de correo válido.');
            isValid = false;
        }

        if (isValid) {
            // ÉXITO: Redirección inmediata sin mensaje.
            window.location.href = form.getAttribute('action'); // Redirige a login_recuperar2.html
        }
    });
});