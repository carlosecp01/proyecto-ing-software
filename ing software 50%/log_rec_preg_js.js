document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');

    // Event listener para el envío del formulario (al hacer clic en el botón de flecha)
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Detiene el envío del formulario si no es válido

        clearErrors();

        let isValid = true;
        
        // IDs de los 3 campos de respuesta a validar
        const fieldIds = [
            'CRRespuesta_1', 
            'CRRespuesta_2',
            'CRRespuesta_3'
        ];

        // 1. Validar campos no vacíos
        for (const id of fieldIds) {
            const input = document.getElementById(id);
            if (input && input.value.trim() === '') {
                // Obtener el nombre de la pregunta para el mensaje de error
                const labelElement = document.querySelector(`label[for="${id}"]`);
                const questionName = labelElement ? labelElement.textContent : `Campo ${id.replace('CR', '').replace('_', ' ')}`;
                
                showError(input, `La respuesta a "${questionName}" es obligatoria.`);
                isValid = false;
            }
        }

        if (isValid) {
            // Si todos los campos son válidos, se envía el formulario
            form.submit(); 
        }
    });

    // --- Funciones auxiliares de error ---
    function showError(inputElement, message) {
        // Busca el elemento div con el ID de error correspondiente al input
        const errorElement = document.getElementById(`error-${inputElement.id}`);
        
        if (errorElement) {
            errorElement.textContent = message;
        }
        // Asume que el borde por defecto es '2px solid #222'
        inputElement.style.border = '2px solid red';
    }

    function clearErrors() {
        // Limpia todos los mensajes de error y restaura los bordes de los inputs
        const form = document.querySelector('form');
        const allErrorElements = form.querySelectorAll('.error-message');
        const allInputs = form.querySelectorAll('input');

        allErrorElements.forEach(errorDiv => {
            errorDiv.textContent = '';
        });
        
        allInputs.forEach(input => {
            input.style.border = '2px solid #222'; // Restaurar borde original
        });
    }

    // Opcional: Limpiar error al escribir
    const allInputs = form.querySelectorAll('input');
    allInputs.forEach(input => {
        input.addEventListener('input', () => {
            if (input.value.trim() !== '') {
                // Limpia el mensaje de error y restaura el borde si el campo no está vacío
                const errorElement = document.getElementById(`error-${input.id}`);
                if (errorElement) {
                    errorElement.textContent = '';
                }
                input.style.border = '2px solid #222'; // Restaura el borde
            }
        });
    });
});