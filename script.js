// Obtiene el botón y el cuerpo de la página
const toggleButton = document.getElementById('theme-toggle');
const body = document.body;

// Función para aplicar el tema
function applyTheme(theme) {
    if (theme === 'dark') {
        body.classList.add('dark-mode');
        // Cambia el icono a Sol (indicando que se puede cambiar a Claro)
        toggleButton.textContent = '✹'; 
    } else {
        body.classList.remove('dark-mode');
        // Cambia el icono a Luna (indicando que se puede cambiar a Oscuro)
        toggleButton.textContent = '✦'; 
    }
}

// 1. Cargar la preferencia del usuario (si existe)
document.addEventListener('DOMContentLoaded', () => {
    // Intenta obtener el tema guardado
    const savedTheme = localStorage.getItem('theme'); 
    
    // Si hay un tema guardado, aplícalo. Si no, usa 'light' por defecto.
    applyTheme(savedTheme || 'light');
});

// 2. Manejar el click del botón
toggleButton.addEventListener('click', () => {
    
    // Verifica si el modo oscuro está activo actualmente
    const isDarkMode = body.classList.contains('dark-mode');
    
    if (isDarkMode) {
        // Si está en oscuro, cambia a claro y guarda
        applyTheme('light');
        localStorage.setItem('theme', 'light');
    } else {
        // Si está en claro, cambia a oscuro y guarda
        applyTheme('dark');
        localStorage.setItem('theme', 'dark');
    }
});