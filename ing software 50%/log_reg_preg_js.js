document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const successMessage = document.getElementById('success-message');

    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Evita la redirección inmediata del formulario

        clearErrors();

        let isValid = true;
        
        // IDs de los 6 campos a validar
        const fieldIds = [
            'CPregunta_1', 'CRespuesta_1',
            'CPregunta_2', 'CRespuesta_2',
            'CPregunta_3', 'CRespuesta_3'
        ];

        // 1. Validar campos no vacíos
        for (const id of fieldIds) {
            const input = document.getElementById(id);
            if (input && input.value.trim() === '') {
                const friendlyName = id.replace('C', '').replace('_', ' ');
                showError(input, `El campo ${friendlyName} es obligatorio.`);
                isValid = false;
            }
        }

        if (isValid) {
            // OCULTAR el formulario
            form.querySelectorAll('.input-group-row, .arrow-btn').forEach(element => {
                element.style.display = 'none';
            });
            
            // MOSTRAR el mensaje de éxito
            successMessage.style.display = 'block';

            // Redirigir después de 2 segundos (2000 milisegundos)
            setTimeout(() => {
                // Redirige a la página de login (la URL de destino en el action del form)
                window.location.href = form.getAttribute('action'); 
            }, 2000); 

        } else {
            // Si no es válido, el mensaje de éxito debe estar oculto
            successMessage.style.display = 'none';
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
        const allInputs = form.querySelectorAll('input');
        allInputs.forEach(input => {
            input.style.border = '2px solid #222'; // Restaurar borde original
        });
        const allErrors = form.querySelectorAll('.error-message');
        allErrors.forEach(error => {
            error.textContent = ''; // Limpiar mensajes de error
        });
    }
});