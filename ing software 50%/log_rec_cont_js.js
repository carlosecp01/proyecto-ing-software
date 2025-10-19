document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('recuperar-form');
    const successMessage = document.getElementById('success-message');
    const inputContrasena = document.getElementById('Rcontrasena');
    const inputConfirmar = document.getElementById('Rconfirmar_contrasena');
    
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
        
        // --- 1. Validar Contraseña (No vacía y 8 caracteres) ---
        if (inputContrasena.value.trim() === '') {
            showError(inputContrasena, 'La contraseña es obligatoria.');
            isValid = false;
        } else if (inputContrasena.value.length < 8) { 
            showError(inputContrasena, 'La contraseña debe tener al menos 8 caracteres.');
            isValid = false;
        }

        // --- 2. Validar Confirmar Contraseña (No vacía) ---
        if (inputConfirmar.value.trim() === '') {
            showError(inputConfirmar, 'La confirmación de contraseña es obligatoria.');
            // Solo se invalida si la contraseña original no falló en la longitud
            if (inputContrasena.value.length >= 8) { 
                isValid = false; 
            }
        }

        // --- 3. Validar Coincidencia ---
        if (isValid && inputContrasena.value !== inputConfirmar.value) {
            showError(inputConfirmar, 'Las contraseñas no coinciden.');
            isValid = false;
        }

        if (isValid) {
            // ÉXITO: Oculta los campos, MUESTRA el mensaje de éxito y luego redirige.
            form.querySelectorAll('.input-group-row, .arrow-btn').forEach(element => {
                element.style.display = 'none';
            });
            
            successMessage.style.display = 'block';

            setTimeout(() => {
                window.location.href = form.getAttribute('action'); // Redirige a 'login.html'
            }, 2000); 

        } else {
            successMessage.style.display = 'none';
        }
    });
});