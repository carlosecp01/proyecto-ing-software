document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const emailInput = document.getElementById('usuario');
    const passwordInput = document.getElementById('contrasena');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        clearErrors();

        let isValid = true;

        if (emailInput.value.trim() === '') {
            showError(emailInput, 'Por favor, ingrese su correo electrónico.');
            isValid = false;
        } else if (!emailRegex.test(emailInput.value.trim())) {
            showError(emailInput, 'El formato del correo es inválido. Debe ser del tipo "usuario@dominio.com".');
            isValid = false;
        }

        if (passwordInput.value === '') {
            showError(passwordInput, 'Por favor, ingrese su contraseña.');
            isValid = false;
        }
        
        if (isValid) {
            form.submit();
        }
    });

    // Función para mostrar el error debajo del input
    function showError(inputElement, message) {
        // Busca el div.error-message que debe estar justo después del div.input-group padre
        // En la estructura corregida, el input está dentro de .input-group y el error-message está justo después.
        const inputGroupParent = inputElement.closest('.input-group');
        let errorElement = null;
        if (inputGroupParent && inputGroupParent.nextElementSibling && inputGroupParent.nextElementSibling.classList.contains('error-message')) {
            errorElement = inputGroupParent.nextElementSibling;
        }
        
        if (errorElement) {
            errorElement.textContent = message;
        }
        inputElement.style.border = '2px solid red';
    }

    // Función para limpiar todos los errores
    function clearErrors() {
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(el => el.textContent = '');

        emailInput.style.border = '2px solid #222';
        passwordInput.style.border = '2px solid #222';
    }
});