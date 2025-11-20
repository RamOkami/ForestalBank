// =========================================
// CODIGO EXISTENTE (Mantenlo igual)
// =========================================
const toggleButton = document.getElementById('theme-toggle');
const body = document.body;

function applyTheme(theme) {
    if (theme === 'dark') {
        body.classList.add('dark-mode');
        toggleButton.textContent = '✹'; 
    } else {
        body.classList.remove('dark-mode');
        toggleButton.textContent = '✦'; 
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme'); 
    applyTheme(savedTheme || 'light');
    
    // NUEVO: Inicializar la tienda al cargar
    renderStock();
});

toggleButton.addEventListener('click', () => {
    const isDarkMode = body.classList.contains('dark-mode');
    if (isDarkMode) {
        applyTheme('light');
        localStorage.setItem('theme', 'light');
    } else {
        applyTheme('dark');
        localStorage.setItem('theme', 'dark');
    }
});

// =========================================
// NUEVO CÓDIGO: SISTEMA DE STOCK Y TRUEQUE
// =========================================

// 1. "Base de Datos" de semillas (Simulada)
const seedsData = [
    { id: 1, name: "Araucaria", stock: 'Disponible', img: "🌲" },
    { id: 2, name: "Peumo", stock: 'Disponible', img: "🍃" },
    { id: 3, name: "Quillay", stock: 'Disponible', img: "🌿" },
    { id: 4, name: "Copihue", stock: 'Disponible', img: "🌺" },
    { id: 5, name: "Alerce", stock: 'Disponible', img: "🌳" },
    { id: 6, name: "Murtilla", stock: 'Disponible', img: "🫐" }
];

// Carrito de intercambio (Array vacío al inicio)
let tradeCart = [];

// 2. Función para renderizar (dibujar) el stock en pantalla
function renderStock() {
    const container = document.getElementById('seed-container');
    container.innerHTML = ''; // Limpiar contenido previo

    seedsData.forEach(seed => {
        // Crear tarjeta HTML
        const card = document.createElement('div');
        card.className = 'seed-card';
        
        // Usamos emojis como imagen placeholder, pero podrías usar <img> reales
        card.innerHTML = `
            <div style="font-size: 4em;">${seed.img}</div>
            <h3>${seed.name}</h3>
            <p class="stock-info">Stock: <span id="stock-${seed.id}">${seed.stock}</span></p>
            <div class="seed-actions">
                <input type="number" id="qty-${seed.id}" min="1" max="${seed.stock}" value="1">
                <button class="btn-add" onclick="addToTrade(${seed.id})">Añadir</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// 3. Función para añadir al intercambio
function addToTrade(id) {
    const seed = seedsData.find(s => s.id === id);
    const inputQty = document.getElementById(`qty-${id}`);
    const qty = parseInt(inputQty.value);

    // Validaciones
    if (qty <= 0) {
        alert("Por favor selecciona una cantidad válida.");
        return;
    }
    if (qty > seed.stock) {
        alert(`¡No tenemos suficiente stock! Solo quedan ${seed.stock} unidades.`);
        return;
    }

    // Buscar si ya está en el carrito para sumar cantidad
    const existingItem = tradeCart.find(item => item.id === id);

    if (existingItem) {
        if (existingItem.qty + qty > seed.stock) {
            alert("No puedes añadir más de lo que hay en stock.");
            return;
        }
        existingItem.qty += qty;
    } else {
        tradeCart.push({
            id: seed.id,
            name: seed.name,
            qty: qty
        });
    }

    // Restar visualmente del stock disponible (opcional, para realismo)
    // seed.stock -= qty; 
    // renderStock(); // Si descomentas esto, el stock bajará en tiempo real al añadir

    updateTradeList();
    alert(`${qty} semillas de ${seed.name} agregadas a tu canasta.`);
}

// 4. Actualizar la lista visual del carrito (Lado Izquierdo)
function updateTradeList() {
    const list = document.getElementById('trade-list');
    list.innerHTML = '';

    if (tradeCart.length === 0) {
        list.innerHTML = '<li class="empty-msg">Aún no has seleccionado semillas.</li>';
        return;
    }

    tradeCart.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span><strong>${item.name}</strong> (x${item.qty})</span>
            <button onclick="removeFromTrade(${index})" style="color:red; border:none; background:none; cursor:pointer;">✕</button>
        `;
        list.appendChild(li);
    });
}

// 5. Eliminar item del carrito
function removeFromTrade(index) {
    tradeCart.splice(index, 1);
    updateTradeList();
}

// 6. Manejo del formulario de confirmación
document.getElementById('trade-form').addEventListener('submit', (e) => {
    e.preventDefault(); // Evita que se recargue la página

    if (tradeCart.length === 0) {
        alert("Tu canasta está vacía. Selecciona semillas del stock primero.");
        return;
    }

    const userSeed = document.getElementById('user-seed').value;
    const userQty = document.getElementById('user-qty').value;

    // Simulación de éxito
    alert(`¡Intercambio Exitoso!\n\nTe enviaremos tus semillas a cambio de: ${userQty} semillas de ${userSeed}.\n\nGracias por contribuir a Forestal Bank.`);

    // Resetear todo
    tradeCart = [];
    updateTradeList();
    document.getElementById('trade-form').reset();
});