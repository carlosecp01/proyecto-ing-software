document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const passwordInput = document.getElementById('contrasena');
    const confirmPasswordInput = document.getElementById('confirmar_contrasena');
    const minLength = 8;

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        clearErrors();

        let isValid = true;
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        // 1. Validar contraseñas no vacías
        if (password === '') {
            showError(passwordInput, 'Debe ingresar una contraseña.');
            isValid = false;
        }
        if (confirmPassword === '') {
            showError(confirmPasswordInput, 'Debe confirmar la contraseña.');
            isValid = false;
        }
        
        // 2. Validar longitud mínima
        if (password !== '' && password.length < minLength) {
            showError(passwordInput, `La contraseña debe tener al menos ${minLength} caracteres.`);
            isValid = false;
        }

        // 3. Validar coincidencia
        if (password !== '' && confirmPassword !== '' && password.length >= minLength && password !== confirmPassword) {
            const message = 'Las contraseñas ingresadas no coinciden.';
            showError(confirmPasswordInput, message);
            showError(passwordInput, message);
            isValid = false;
        }

        if (isValid) {
            form.submit(); // Redirige a login_registrar3.html
        }
    });

    // --- Funciones auxiliares de error ---
    function showError(inputElement, message) {
        const errorElement = document.getElementById(`error-${inputElement.id}`);
        
        if (errorElement) {
            errorElement.textContent = message;
        }
        inputElement.style.border = '2px solid red';
    }

    function clearErrors() {
        passwordInput.style.border = '2px solid #222';
        confirmPasswordInput.style.border = '2px solid #222';
        
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(el => el.textContent = '');
    }
});