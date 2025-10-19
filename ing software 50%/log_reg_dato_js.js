document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    
    // Referencias a los campos
    const nombreInput = document.getElementById('nombre');
    const apellidoInput = document.getElementById('apellido');
    const fechaNacimientoInput = document.getElementById('fecha_nacimiento');
    const cedulaInput = document.getElementById('cedula');
    const telefonoInput = document.getElementById('telefono');
    const emailInput = document.getElementById('correo');

    // Expresiones Regulares
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const numericRegex = /^\d+$/;
    const cedulaRegex = /^\d{7,8}$/; // 7 u 8 dígitos
    const minAge = 18;

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        clearErrors();

        let isValid = true;
        
        // Array de campos a validar (solo vacío)
        const requiredFields = [
            { input: nombreInput, name: 'Nombre' },
            { input: apellidoInput, name: 'Apellido' },
            { input: fechaNacimientoInput, name: 'Fecha de Nacimiento' },
            { input: cedulaInput, name: 'Cédula' },
            { input: telefonoInput, name: 'Teléfono' },
            { input: emailInput, name: 'Correo' }
        ];

        // 1. Validar campos no vacíos
        requiredFields.forEach(field => {
            if (field.input.value.trim() === '') {
                showError(field.input, `El campo ${field.name} es obligatorio.`);
                isValid = false;
            }
        });

        // 2. Validar formato de correo
        if (emailInput.value.trim() !== '' && !emailRegex.test(emailInput.value.trim())) {
            showError(emailInput, 'El formato del correo es inválido. Verifique el campo.');
            isValid = false;
        }

        // 3. Validar Teléfono (Solo números)
        if (telefonoInput.value.trim() !== '' && !numericRegex.test(telefonoInput.value.trim())) {
            showError(telefonoInput, 'El Teléfono debe contener únicamente números (ej: 4125551234).');
            isValid = false;
        }

        // 4. Validar Cédula (7 u 8 números)
        if (cedulaInput.value.trim() !== '' && !cedulaRegex.test(cedulaInput.value.trim())) {
            showError(cedulaInput, 'La Cédula debe contener 7 u 8 dígitos numéricos.');
            isValid = false;
        }

        // 5. Validar mayoría de edad
        if (fechaNacimientoInput.value.trim() !== '') {
            const birthDate = new Date(fechaNacimientoInput.value);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            const dayDiff = today.getDate() - birthDate.getDate();

            if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
                age--;
            }

            if (age < minAge) {
                showError(fechaNacimientoInput, `⛔ Debe ser mayor de ${minAge} años para registrarse.`);
                isValid = false;
            }
        }

        if (isValid) {
            form.submit(); // Redirige a login_registrar2.html
        }
    });

    // --- Funciones auxiliares de error ---
    function showError(inputElement, message) {
        // En login_registrar.html el error-message está DENTRO del .input-group,
        // al final. Usaremos el ID directo.
        const errorElement = document.getElementById(`error-${inputElement.id}`);
        
        // Caso especial para Cédula, el error está fuera del input principal pero dentro del .input-group
        if (!errorElement) {
            const cedulaInputContainer = inputElement.closest('.cedula-input-container');
            if (cedulaInputContainer) {
                errorElement = document.getElementById(`error-cedula`);
            }
        }

        if (errorElement) {
            errorElement.textContent = message;
        }
        inputElement.style.border = '2px solid red';
    }

    function clearErrors() {
        const allInputs = form.querySelectorAll('input');
        allInputs.forEach(input => {
            input.style.border = '2px solid #222'; // Restaurar borde original
        });

        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(el => el.textContent = '');
    }
});