// ===== STOCK MANAGEMENT SYSTEM =====

/**
 * Stock Manager - Handles inventory management and persistence
 */
const stockManager = {
    // Storage key for persisting stock data
    STORAGE_KEY: 'vinilos-plus-stock',

    /**
     * Initialize stock management
     */
    init() {
        this.loadStockFromStorage();
        this.setupEventListeners();
    },

    /**
     * Load stock from localStorage and update products array
     */
    loadStockFromStorage() {
        try {
            const savedStock = localStorage.getItem(this.STORAGE_KEY);
            
            if (savedStock) {
                const stockData = JSON.parse(savedStock);
                
                // Update products array with saved stock values
                products.forEach(product => {
                    if (stockData[product.id] !== undefined) {
                        product.stock = stockData[product.id];
                    }
                });
                
                console.log('✅ Stock cargado desde localStorage');
            } else {
                // Si no hay datos guardados, guardar el stock inicial
                this.saveStockToStorage();
                console.log('📦 Stock inicial guardado');
            }
        } catch (error) {
            console.warn('❌ Error al cargar stock desde localStorage:', error);
        }
    },

    /**
     * Save current stock to localStorage
     */
    saveStockToStorage() {
        try {
            const stockData = {};
            products.forEach(product => {
                stockData[product.id] = product.stock;
            });
            
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stockData));
            console.log('💾 Stock guardado en localStorage');
        } catch (error) {
            console.warn('❌ Error al guardar stock en localStorage:', error);
        }
    },

    /**
     * Update stock for a specific product
     * @param {string} productId - Product ID
     * @param {number} newStock - New stock value
     */
    updateProductStock(productId, newStock) {
        const product = products.find(p => p.id === productId);
        if (product) {
            product.stock = Math.max(0, parseInt(newStock) || 0);
            this.saveStockToStorage();
            
            // Update UI if products are currently displayed
            if (typeof uiManager !== 'undefined' && uiManager.renderProducts) {
                uiManager.renderProducts();
            }
            
            return true;
        }
        return false;
    },

    /**
     * Reset all products to their default stock values
     */
    resetAllStock() {
        const defaultStockValues = {
            'A1': 3, 'A2': 2, 'A3': 5,
            'B1': 4, 'B2': 3, 'B3': 6,
            'C1': 5, 'C2': 7, 'C3': 3,
            'D1': 8, 'D2': 6, 'D3': 21,
            'E1': 5, 'E2': 15, 'E3': 9
        };

        products.forEach(product => {
            if (defaultStockValues[product.id] !== undefined) {
                product.stock = defaultStockValues[product.id];
            }
        });

        this.saveStockToStorage();
        
        // Update UI
        if (typeof uiManager !== 'undefined' && uiManager.renderProducts) {
            uiManager.renderProducts();
        }
        
        // Update stock modal if it's open
        this.renderStockModal();
        
        console.log('🔄 Stock restablecido a valores por defecto');
    },

    /**
     * Setup event listeners for stock management
     */
    setupEventListeners() {
        // Stock button click
        const stockBtn = document.getElementById('stockBtn');
        if (stockBtn) {
            stockBtn.addEventListener('click', () => {
                this.showStockModal();
            });
        }

        // Close stock modal button
        const closeStockModal = document.getElementById('closeStockModal');
        if (closeStockModal) {
            closeStockModal.addEventListener('click', () => {
                this.hideStockModal();
            });
        }

        // Save stock button
        const saveStockBtn = document.getElementById('saveStockBtn');
        if (saveStockBtn) {
            saveStockBtn.addEventListener('click', () => {
                this.saveStockFromModal();
            });
        }

        // Reset stock button
        const resetStockBtn = document.getElementById('resetStockBtn');
        if (resetStockBtn) {
            resetStockBtn.addEventListener('click', () => {
                if (confirm('¿Estás seguro de que quieres restablecer todo el stock a los valores por defecto?')) {
                    this.resetAllStock();
                }
            });
        }

        // Close modal on background click
        const stockModal = document.getElementById('stockModal');
        if (stockModal) {
            stockModal.addEventListener('click', (e) => {
                if (e.target === stockModal) {
                    this.hideStockModal();
                }
            });
        }

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            // ESC to close stock modal
            if (e.key === 'Escape') {
                const stockModal = document.getElementById('stockModal');
                if (stockModal && stockModal.classList.contains('active')) {
                    this.hideStockModal();
                }
            }
        });
    },

    /**
     * Show stock management modal
     */
    showStockModal() {
        const modal = document.getElementById('stockModal');
        if (modal) {
            this.renderStockModal();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    },

    /**
     * Hide stock management modal
     */
    hideStockModal() {
        const modal = document.getElementById('stockModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    },

    /**
     * Render stock management modal content
     */
    renderStockModal() {
        const stockGrid = document.getElementById('stockGrid');
        if (!stockGrid) return;

        stockGrid.innerHTML = '';

        products.forEach(product => {
            const stockItem = document.createElement('div');
            stockItem.className = 'stock-item';
            stockItem.innerHTML = `
                <div class="stock-item-image">
                    <img src="${product.icon}" alt="${product.name}" onerror="this.style.display='none'; this.parentElement.textContent='🎵';">
                </div>
                <div class="stock-item-name">${product.name}</div>
                <div class="stock-item-artist">${product.artist}</div>
                <div class="stock-control">
                    <button class="stock-btn-control" data-action="decrease" data-product="${product.id}">-</button>
                    <input type="number" class="stock-input" value="${product.stock}" min="0" max="999" data-product="${product.id}">
                    <button class="stock-btn-control" data-action="increase" data-product="${product.id}">+</button>
                </div>
            `;

            stockGrid.appendChild(stockItem);
        });

        // Add event listeners for stock controls
        this.setupStockControls();
    },

    /**
     * Setup event listeners for stock controls in modal
     */
    setupStockControls() {
        // Stock control buttons
        document.querySelectorAll('.stock-btn-control').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                const productId = e.target.dataset.product;
                const input = document.querySelector(`input[data-product="${productId}"]`);
                
                if (input) {
                    let currentValue = parseInt(input.value) || 0;
                    
                    if (action === 'increase') {
                        currentValue = Math.min(999, currentValue + 1);
                    } else if (action === 'decrease') {
                        currentValue = Math.max(0, currentValue - 1);
                    }
                    
                    input.value = currentValue;
                    this.updateProductStock(productId, currentValue);
                }
            });
        });

        // Stock input fields
        document.querySelectorAll('.stock-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const productId = e.target.dataset.product;
                const newValue = Math.max(0, Math.min(999, parseInt(e.target.value) || 0));
                e.target.value = newValue;
                this.updateProductStock(productId, newValue);
            });

            // Allow only numbers
            input.addEventListener('input', (e) => {
                let value = e.target.value.replace(/[^0-9]/g, '');
                if (value.length > 3) value = value.slice(0, 3);
                e.target.value = value;
            });
        });
    },

    /**
     * Save stock changes from modal inputs
     */
    saveStockFromModal() {
        const inputs = document.querySelectorAll('.stock-input');
        let changesMade = false;

        inputs.forEach(input => {
            const productId = input.dataset.product;
            const newStock = parseInt(input.value) || 0;
            const product = products.find(p => p.id === productId);
            
            if (product && product.stock !== newStock) {
                product.stock = newStock;
                changesMade = true;
            }
        });

        if (changesMade) {
            this.saveStockToStorage();
            
            // Update main UI
            if (typeof uiManager !== 'undefined' && uiManager.renderProducts) {
                uiManager.renderProducts();
            }
            
            // Show success message
            this.showStockMessage('✅ Stock actualizado correctamente', 'success');
        } else {
            this.showStockMessage('ℹ️ No se realizaron cambios', 'info');
        }
    },

    /**
     * Show a temporary message in the stock modal
     * @param {string} message - Message to show
     * @param {string} type - Message type (success, error, info)
     */
    showStockMessage(message, type = 'info') {
        // Remove existing message
        const existingMessage = document.querySelector('.stock-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `stock-message stock-message-${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : '#3498db'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(messageDiv);

        // Animate in
        setTimeout(() => {
            messageDiv.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            messageDiv.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 300);
        }, 3000);
    },

    /**
     * Get total products count
     * @returns {number} Total number of products in stock
     */
    getTotalProductsCount() {
        return products.reduce((total, product) => total + product.stock, 0);
    },

    /**
     * Get products with low stock (less than 3 items)
     * @returns {Array} Products with low stock
     */
    getLowStockProducts() {
        return products.filter(product => product.stock < 3);
    },

    /**
     * Get stock summary for logging/debugging
     * @returns {Object} Stock summary
     */
    getStockSummary() {
        return {
            totalProducts: this.getTotalProductsCount(),
            lowStockCount: this.getLowStockProducts().length,
            outOfStockCount: products.filter(p => p.stock === 0).length,
            products: products.map(p => ({ id: p.id, name: p.name, stock: p.stock }))
        };
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = stockManager;
}