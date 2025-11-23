document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const emailInput = document.getElementById('usuario');
    const passwordInput = document.getElementById('contrasena');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Lista de usuarios regulares permitidos (correo y contraseña)
    const VALID_USERS = [
        { email: 'albierialaña01@gmail.com', password: '12345678' },
        { email: 'helimenesgarcia02@gmail.com', password: '12345678' },
        { email: 'paulomoutela03@gmail.com', password: '12345678' },
        { email: 'luisquintero04@gmail.com', password: '12345678' },
        { email: 'carloscastillo05@gmail.com', password: '12345678' },
        { email: 'josoro2000@gmail.com', password: '12345678' }
    ];

    // Credenciales del Administrador
    const ADMIN_EMAIL = 'admin@wayne.com';
    const ADMIN_PASSWORD = '12345678';

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        clearErrors();

        let isValid = true;
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Validaciones de campo vacío y formato de correo
        if (email === '') {
            showError(emailInput, 'Por favor, ingrese su correo electrónico.');
            isValid = false;
        } else if (!emailRegex.test(email)) {
            showError(emailInput, 'El formato del correo es inválido. Debe ser del tipo "usuario@dominio.com".');
            isValid = false;
        }

        if (password === '') {
            showError(passwordInput, 'Por favor, ingrese su contraseña.');
            isValid = false;
        }
        
        if (isValid) {
            
            // 1. Verificar si es el administrador
            if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
                window.location.href = 'ini_adm.html';
                return; // Detener la ejecución
            }

            // 2. Verificar si es un usuario regular válido
            const isRegularUser = VALID_USERS.some(user => 
                user.email === email && user.password === password
            );

            if (isRegularUser) {
                window.location.href = 'ini_log.html';
                return; // Detener la ejecución
            }

            // 3. Si no es admin ni usuario válido, mostrar error general
            showError(passwordInput, 'Credenciales inválidas. Verifique su correo y contraseña.');
        }
    });

    // Función para mostrar el error debajo del input
    function showError(inputElement, message) {
        // Usa el div.error-message asociado al input de contraseña
        const targetInput = inputElement.id === 'usuario' ? emailInput : passwordInput;
        const inputGroupParent = targetInput.closest('.input-group');
        let errorElement = null;
        
        if (inputGroupParent && inputGroupParent.nextElementSibling && inputGroupParent.nextElementSibling.classList.contains('error-message')) {
            errorElement = inputGroupParent.nextElementSibling;
        }
        
        if (errorElement) {
            errorElement.textContent = message;
        }
        targetInput.style.border = '2px solid red';
    }

    // Función para limpiar todos los errores
    function clearErrors() {
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(el => el.textContent = '');

        emailInput.style.border = '2px solid #222';
        passwordInput.style.border = '2px solid #222';
    }
});