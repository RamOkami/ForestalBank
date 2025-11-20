// =========================================
// LÓGICA DEL TEMA (OSCURO/CLARO)
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
    
    // Inicializar la tienda al cargar
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
// SISTEMA DE STOCK Y TRUEQUE (CON NIVELES)
// =========================================

// 1. Base de Datos actualizada con Nivel y Especies solicitadas
const seedsData = [
    // NIVEL FÁCIL
    { id: 1, name: "Quillay", scientific: "Quillaja saponaria", difficulty: "facil", stock: 850, img: "content/quillay.png" },
    { id: 2, name: "Peumo", scientific: "Cryptocarya alba", difficulty: "facil", stock: 1200, img: "content/peumo.png" },
    
    // NIVEL MEDIO
    { id: 3, name: "Araucaria", scientific: "Araucaria araucana", difficulty: "medio", stock: 500, img: "content/araucaria.png" },
    { id: 4, name: "Hualo", scientific: "Nothofagus glauca", difficulty: "medio", stock: 400, img: "content/hualo.png" },
    { id: 5, name: "Lenga", scientific: "Nothofagus pumilio", difficulty: "medio", stock: 250, img: "content/lenga.png"},
    
    // NIVEL DIFÍCIL
    { id: 6, name: "Queule", scientific: "Gomortega keule", difficulty: "dificil", stock: 100, img: "content/queule.png" },
    { id: 7, name: "Pitao", scientific: "Pitavia punctata", difficulty: "dificil", stock: 80, img: "content/pitao.png" }
];

// Configuración de los niveles para el renderizado
const levelsConfig = {
    facil: { 
        title: "🌱 Nivel Fácil", 
        desc: "Árboles resistentes y fáciles de cuidar.",
        color: "#8AA878" // Verde
    },
    medio: { 
        title: "🌾 Nivel Medio", 
        desc: "Árboles que pueden requerir más cuidado y condiciones específicas.",
        color: "#F39C12" // Naranja/Amarillo
    },
    dificil: { 
        title: "🔥 Nivel Difícil (Especies Vulnerables)", 
        desc: "Especies difíciles de trabajar y requieren manejo especial.",
        color: "#C0392B" // Rojo
    }
};

let tradeCart = [];

// 2. Renderizar Stock por Categorías
function renderStock() {
    const container = document.getElementById('seed-container');
    container.innerHTML = ''; 
    container.classList.remove('grid-seeds'); 

    ['facil', 'medio', 'dificil'].forEach(levelKey => {
        const groupSeeds = seedsData.filter(s => s.difficulty === levelKey);
        
        if (groupSeeds.length > 0) {
            const config = levelsConfig[levelKey];
            const levelSection = document.createElement('div');
            levelSection.className = 'level-section';
            
            levelSection.innerHTML = `
                <div class="level-header" style="border-left-color: ${config.color};">
                    <h2 style="color: ${config.color};">${config.title}</h2>
                    <p>${config.desc}</p>
                </div>
                <div class="grid-seeds"></div>
            `;

            const grid = levelSection.querySelector('.grid-seeds');

            groupSeeds.forEach(seed => {
                const card = document.createElement('div');
                card.className = 'seed-card';
                card.style.borderTop = `5px solid ${config.color}`;
                
                card.innerHTML = `
                    <img src="${seed.img}" alt="Foto de ${seed.name}">
                    <h3>${seed.name}</h3>
                    <p style="font-style: italic; color: #555; margin-bottom: 10px; margin-top: -5px;">${seed.scientific}</p>
                    <div class="stock-badge">Stock: <span id="stock-${seed.id}">${seed.stock}</span> g</div>
                    <div class="seed-actions">
                        <input type="number" id="qty-${seed.id}" min="10" step="10" max="${seed.stock}" value="50">
                        <span style="font-size: 0.8em; margin-left: 5px; margin-right: 10px;">g</span>
                        <button class="btn-add" onclick="addToTrade(${seed.id})" style="background-color:${config.color}">Añadir</button>
                    </div>
                `;
                grid.appendChild(card);
            });
            container.appendChild(levelSection);
        }
    });
}

// 3. Añadir al intercambio
function addToTrade(id) {
    const seed = seedsData.find(s => s.id === id);
    const inputQty = document.getElementById(`qty-${id}`);
    const qty = parseInt(inputQty.value);

    if (isNaN(qty) || qty <= 0) {
        showToast("Ingresa una cantidad válida.", true); // true = es un error
        return;
    }
    if (qty > seed.stock) {
        showToast(`¡Stock insuficiente! Solo quedan ${seed.stock} g.`, true);
        return;
    }

    const existingItem = tradeCart.find(item => item.id === id);

    if (existingItem) {
        if (existingItem.qty + qty > seed.stock) {
            showToast(`No puedes llevar más del stock total.`, true);
            return;
        }
        existingItem.qty += qty;
    } else {
        tradeCart.push({
            id: seed.id,
            name: seed.name,
            scientific: seed.scientific,
            qty: qty
        });
    }

    updateTradeList();
    // AQUÍ EL ÉXITO:
    showToast(`Has añadido ${qty} g de ${seed.name}.`);
}

// 4. Actualizar lista visual
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
            <div>
                <strong>${item.name}</strong> <small>(${item.scientific})</small>
                <br>
                <span style="color: #3C4A3B;">Cant: ${item.qty} g</span>
            </div>
            <button onclick="removeFromTrade(${index})" style="color: #d9534f; border:none; background:none; cursor:pointer; font-weight:bold;">✕</button>
        `;
        list.appendChild(li);
    });
}

// 5. Eliminar item
function removeFromTrade(index) {
    tradeCart.splice(index, 1);
    updateTradeList();
}

// 6. MANEJO DEL FORMULARIO CON EMAILJS (VERSIÓN BLINDADA)
document.getElementById('trade-form').addEventListener('submit', (e) => {
    e.preventDefault(); 

    // --- TUS CREDENCIALES EXACTAS ---
    const SERVICE_ID = 'service_nib3nwc';
    const TEMPLATE_ID = 'template_4iwa5of';
    const PUBLIC_KEY = 'KuBkrJG6RziEyJpBl';
    // --------------------------------

    if (tradeCart.length === 0) {
        alert("Tu canasta está vacía. Selecciona semillas del stock primero.");
        return;
    }

    // 1. Obtener datos
    const userEmail = document.getElementById('user-email').value;
    const userSeed = document.getElementById('user-seed').value;
    const userQty = document.getElementById('user-qty').value;
    const userNotes = document.getElementById('user-notes').value;

    // 2. Formatear lista
    let cartDetailsString = tradeCart.map(item => 
        `- ${item.name} (${item.qty} g)`
    ).join('\n');

    // 3. Parámetros
    const templateParams = {
        to_email: userEmail,
        offer_seed: userSeed,
        offer_qty: userQty,
        cart_details: cartDetailsString,
        notes: userNotes
    };

    // Feedback visual
    const btn = document.querySelector('.btn-trade');
    const originalText = btn.innerText;
    btn.innerText = "ENVIANDO...";

    // 4. FORZAR INICIALIZACIÓN (Esto arregla el error 422)
    try {
        emailjs.init(PUBLIC_KEY);
    } catch (err) {
        console.log("Error al inicializar:", err);
    }

    // 5. Enviar
    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams)
        .then(function() {
            // Éxito
            console.log("✅ Correo enviado correctamente");
            showToast(`¡Solicitud Enviada! Revisa tu correo.`); // Reemplaza el alert largo
            
            tradeCart = [];
            updateTradeList();
            document.getElementById('trade-form').reset();
            btn.innerText = originalText;

        }, function(error) {
            // Error
            showToast("Hubo un error al enviar. Intenta nuevamente.", true);
            
            // Mensaje específico para ti si sigue siendo 422
            if(error.status === 422) {
                alert("Error de autenticación (422). El servidor no reconoce la Public Key. Revisa si tienes activado un AdBlocker.");
            } else {
                alert("Hubo un error al enviar. Revisa la consola (F12) para más detalles.");
            }
            btn.innerText = originalText;
        });
});

// FUNCIÓN PARA MOSTRAR NOTIFICACIONES
function showToast(message, isError = false) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    
    // Agregamos clases base
    toast.className = 'toast';
    
    // Si es error, agregamos la clase 'error' para que se vea rojo
    if (isError) {
        toast.classList.add('error');
        toast.innerHTML = `<span>⚠️</span> <p>${message}</p>`;
    } else {
        toast.innerHTML = `<span>✅</span> <p>${message}</p>`;
    }

    container.appendChild(toast);

    // Eliminar el elemento del DOM después de 3.5 segundos
    setTimeout(() => {
        toast.remove();
    }, 3500);
}