// ===== MAIN APPLICATION CONTROLLER =====

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Theme Manager first
    themeManager.init();
    
    // Initialize Stock Manager (loads saved stock data)
    stockManager.init();
    
    // Initialize UI Manager
    uiManager.init();
    uiManager.renderProducts();

    // ===== EVENT LISTENERS =====

    /**
     * Money button click handler
     */
    const moneyButtons = document.querySelectorAll('.money-btn');
    moneyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const amount = parseInt(button.dataset.value);
            handleMoneyInsertion(amount);
        });
    });

    /**
     * Purchase button click handler
     */
    const purchaseBtn = document.getElementById('purchaseBtn');
    purchaseBtn.addEventListener('click', handlePurchase);

    /**
     * Cancel button click handler
     */
    const cancelBtn = document.getElementById('cancelBtn');
    cancelBtn.addEventListener('click', handleCancel);

    /**
     * Close modal button handler
     */
    const closeModalBtn = document.getElementById('closeModal');
    closeModalBtn.addEventListener('click', () => {
        // Detener la música cuando se cierre el modal
        stopCurrentAudio();
        uiManager.hideModal();
    });

    /**
     * Close modal on background click
     */
    const modal = document.getElementById('deliveryModal');
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            // Detener la música cuando se cierre el modal
            stopCurrentAudio();
            uiManager.hideModal();
        }
    });
});

// ===== HANDLER FUNCTIONS =====

/**
 * Handle money insertion
 */
function handleMoneyInsertion(amount) {
    const result = paymentManager.insertMoney(amount);

    if (result.success) {
        uiManager.updateDisplay();
        uiManager.showStatus(`💵 $${amount} insertado. Total: $${result.total}`, 'success');

        // Add animation effect to money button
        animateMoneyInsertion(amount);
    } else {
        uiManager.showStatus(result.message, 'error');
    }
}

/**
 * Handle purchase
 */
function handlePurchase() {
    const result = paymentManager.processPurchase();

    if (result.success) {
        // Show delivery animation
        uiManager.showDeliveryAnimation(result.product);

        // Show success modal
        setTimeout(() => {
            uiManager.showSuccessModal(result.product, result.change);
        }, 500);

        // Update products display
        uiManager.renderProducts();

        // Reset UI
        uiManager.resetUI();

        // Play success sound effect (visual feedback)
        playSuccessAnimation();

        // 🎵 REPRODUCIR LA CANCIÓN DEL PRODUCTO COMPRADO
        setTimeout(() => {
            playProductSong(result.product.id);
        }, 1000); // Esperar 1 segundo para que se vea la animación de entrega
        
    } else {
        uiManager.showStatus(result.message, 'error');
    }
}

/**
 * Handle cancel/return money
 */
function handleCancel() {
    // Detener música si está reproduciéndose
    stopCurrentAudio();
    
    const result = paymentManager.cancelTransaction();

    if (result.returnedAmount > 0) {
        uiManager.showStatus(`💰 ${result.message}`, 'info');
        animateMoneyReturn(result.returnedAmount);
    } else {
        uiManager.showStatus(result.message, 'info');
    }

    uiManager.resetUI();
    uiManager.renderProducts();
}

// ===== ANIMATION FUNCTIONS =====

/**
 * Animate money insertion
 */
function animateMoneyInsertion(amount) {
    const insertedMoneyElement = document.getElementById('insertedMoney');
    insertedMoneyElement.style.transform = 'scale(1.2)';
    insertedMoneyElement.style.color = '#00ff00';

    setTimeout(() => {
        insertedMoneyElement.style.transform = 'scale(1)';
        insertedMoneyElement.style.color = '';
    }, 300);
}

/**
 * Animate money return
 */
function animateMoneyReturn(amount) {
    const changeElement = document.getElementById('change');
    changeElement.textContent = `$${amount}`;
    changeElement.style.transform = 'scale(1.3)';
    changeElement.style.color = '#ffd700';

    setTimeout(() => {
        changeElement.style.transform = 'scale(1)';
        changeElement.style.color = '';
        changeElement.textContent = '$0';
    }, 2000);
}

/**
 * Play success animation
 */
function playSuccessAnimation() {
    const purchaseBtn = document.getElementById('purchaseBtn');
    purchaseBtn.style.animation = 'pulse 0.5s';

    setTimeout(() => {
        purchaseBtn.style.animation = '';
    }, 500);
}

// Add pulse animation CSS
const pulseStyle = document.createElement('style');
pulseStyle.textContent = `
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
    }
`;
document.head.appendChild(pulseStyle);

// ===== UTILITY FUNCTIONS =====

/**
 * Format currency
 */
function formatCurrency(amount) {
    return `$${amount.toFixed(2)}`;
}

/**
 * Log transaction (for debugging)
 */
function logTransaction(type, data) {
    if (window.console && window.console.log) {
        console.log(`[${type}]`, data);
    }
}

// ===== KEYBOARD SHORTCUTS (OPTIONAL) =====

document.addEventListener('keydown', (e) => {
    // ESC to cancel
    if (e.key === 'Escape') {
        handleCancel();
    }

    // Enter to purchase (if button is enabled)
    if (e.key === 'Enter') {
        const purchaseBtn = document.getElementById('purchaseBtn');
        if (!purchaseBtn.disabled) {
            handlePurchase();
        }
    }

    // Space to stop current music
    if (e.key === ' ' && currentAudio) {
        e.preventDefault(); // Prevenir scroll de página
        stopCurrentAudio();
        uiManager.showStatus(`🎵 Música detenida`, 'info');
    }

    // Number keys for money insertion
    const moneyValues = { '1': 1, '2': 5, '3': 10, '4': 20, '5': 50 };
    if (moneyValues[e.key]) {
        handleMoneyInsertion(moneyValues[e.key]);
    }
});

// ===== AUDIO FUNCTIONS =====

/**
 * Mapa de productos a archivos de audio
 */
const productAudioMap = {
    'A1': 'musica/Abbey Road.wav',           // Abbey Road - The Beatles
    'A2': 'musica/Dark side of the Moon.wav',   // Dark Side of the Moon - Pink Floyd  
    'A3': 'musica/Automatic Sun.wav',              // Automatic Sun- The Warning
    'B1': 'musica/Rumours.wav',             // Rumours - Fleetwood Mac
    'B2': 'musica/Led Zeppelin IV.wav',     // Led Zeppelin IV - Led Zeppelin
    'B3': 'musica/Back in Black.wav',       // Back in Black - AC/DC
    'C1': 'musica/Hotel California.wav',    // Hotel California - Eagles
    'C2': 'musica/Nevermind.wav',          // Nevermind - Nirvana
    'C3': 'musica/The Wall.wav',           // The Wall - Pink Floyd
    'D1': 'musica/Appetite for Destruction.wav', // Appetite for Destruction - Guns N' Roses
    'D2': 'musica/Born to Run.wav',        // Born to Run - Bruce Springsteen
    'D3': 'musica/Purple Rain.wav',        // Purple Rain - Prince
    'E1': 'musica/Bohemain Rhapsody.wav',  // Bohemian Rhapsody - Queen
    'E2': 'musica/Even in Arcadia.wav',    // Even In Arcadia - Sleep Token
    'E3': 'musica/Like a Rolling Stone.wav' // Like a Rolling Stone - Bob Dylan
};

/**
 * Variable global para controlar el audio actual
 */
let currentAudio = null;

/**
 * Reproduce la canción del producto comprado
 */
function playProductSong(productId) {
    // Detener cualquier audio que esté reproduciéndose
    stopCurrentAudio();
    
    const audioPath = productAudioMap[productId];
    
    if (!audioPath) {
        console.warn(`No se encontró archivo de audio para el producto ${productId}`);
        return;
    }
    
    try {
        // Crear nuevo elemento de audio
        currentAudio = new Audio(audioPath);
        
        // Configurar volumen (ajustable)
        currentAudio.volume = 0.7;
        
        // Manejar errores de carga
        currentAudio.addEventListener('error', (e) => {
            console.error(`Error al cargar el audio para ${productId}:`, e);
            uiManager.showStatus(`🎵 No se pudo reproducir la canción`, 'warning');
        });
        
        // Manejar cuando la canción comienza a reproducirse
        currentAudio.addEventListener('loadstart', () => {
            const product = getProductById(productId);
            uiManager.showStatus(`🎵 Reproduciendo: ${product.name} - ${product.artist}`, 'success');
        });
        
        // Manejar cuando la canción termina
        currentAudio.addEventListener('ended', () => {
            uiManager.showStatus(`🎵 Canción terminada`, 'info');
            currentAudio = null;
        });
        
        // Reproducir la canción
        currentAudio.play().catch((error) => {
            console.error(`Error al reproducir el audio:`, error);
            uiManager.showStatus(`🎵 Error al reproducir la canción`, 'error');
        });
        
    } catch (error) {
        console.error(`Error al crear el audio:`, error);
        uiManager.showStatus(`🎵 Error al cargar la canción`, 'error');
    }
}

/**
 * Detiene el audio actual si está reproduciéndose
 */
function stopCurrentAudio() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }
}

/**
 * Controla el volumen del audio (0.0 a 1.0)
 */
function setAudioVolume(volume) {
    if (currentAudio) {
        currentAudio.volume = Math.max(0, Math.min(1, volume));
    }
}

// ===== INITIALIZATION MESSAGE =====
console.log('%c🎵 Vinyl Vending Machine Initialized! 🎵', 'color: #667eea; font-size: 16px; font-weight: bold;');
console.log('%cAtajos de teclado:', 'color: #2a5298; font-weight: bold;');
console.log('1-5: Insertar dinero ($1, $5, $10, $20, $50)');
console.log('Enter: Comprar (si está habilitado)');
console.log('Esc: Cancelar transacción');
console.log('Espacio: Detener música actual');
console.log('%c🎵 Audio habilitado - Las canciones se reproducirán después de la compra', 'color: #e74c3c; font-weight: bold;');
console.log('%c📦 Gestión de stock habilitada - Usa el botón "Stock" en el footer para gestionar inventario', 'color: #2ecc71; font-weight: bold;');
console.log('%c💾 Stock persistente - Los cambios en inventario se guardan automáticamente', 'color: #f39c12; font-weight: bold;');