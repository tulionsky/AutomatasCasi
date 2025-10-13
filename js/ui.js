// ===== UI MANAGER =====

class UIManager {
    constructor() {
        this.elements = {
            productsGrid: null,
            selectedProduct: null,
            productPrice: null,
            insertedMoney: null,
            change: null,
            statusMessage: null,
            purchaseBtn: null,
            deliveryArea: null,
            modal: null,
            deliveredProduct: null,
            changeInfo: null
        };
    }

    /**
     * Initialize UI elements
     */
    init() {
        this.elements.productsGrid = document.getElementById('productsGrid');
        this.elements.selectedProduct = document.getElementById('selectedProduct');
        this.elements.productPrice = document.getElementById('productPrice');
        this.elements.insertedMoney = document.getElementById('insertedMoney');
        this.elements.change = document.getElementById('change');
        this.elements.statusMessage = document.getElementById('statusMessage');
        this.elements.purchaseBtn = document.getElementById('purchaseBtn');
        this.elements.deliveryArea = document.getElementById('deliveryArea');
        this.elements.modal = document.getElementById('deliveryModal');
        this.elements.deliveredProduct = document.getElementById('deliveredProduct');
        this.elements.changeInfo = document.getElementById('changeInfo');
    }

    /**
     * Render products grid
     */
    renderProducts() {
        const products = getAllProducts();
        this.elements.productsGrid.innerHTML = '';

        products.forEach(product => {
            const card = this.createProductCard(product);
            this.elements.productsGrid.appendChild(card);
        });
    }

    /**
     * Create product card element
     */
    createProductCard(product) {
        const card = document.createElement('div');
        card.className = `product-card ${product.stock === 0 ? 'out-of-stock' : ''}`;
        card.dataset.productId = product.id;

        card.innerHTML = `
            <div class="product-icon">
                ${product.icon.startsWith('image/') ? 
                    `<img src="${product.icon}" alt="${product.name}">` : 
                    product.icon}
            </div>
            <div class="product-code">${product.id}</div>
            <div class="product-name">${product.name}</div>
            <div class="product-artist">${product.artist}</div>
            <div class="product-footer">
                <span class="product-price">$${product.price}</span>
                <span class="product-stock">Stock: ${product.stock}</span>
            </div>
        `;

        if (product.stock > 0) {
            card.addEventListener('click', () => this.handleProductSelection(product.id));
        }

        return card;
    }

    /**
     * Handle product selection
     */
    handleProductSelection(productId) {
        const result = paymentManager.selectProduct(productId);

        if (result.success) {
            this.updateSelectedProduct(result.product);
            this.showStatus(result.message, 'success');
            this.highlightSelectedCard(productId);
        } else {
            this.showStatus(result.message, 'error');
        }

        this.updateDisplay();
    }

    /**
     * Highlight selected product card
     */
    highlightSelectedCard(productId) {
        const cards = document.querySelectorAll('.product-card');
        cards.forEach(card => {
            if (card.dataset.productId === productId) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        });
    }

    /**
     * Update selected product display
     */
    updateSelectedProduct(product) {
        if (product) {
            const iconDisplay = product.icon.startsWith('image/') ? 
                `<img src="${product.icon}" alt="${product.name}" style="width: 30px; height: 30px; vertical-align: middle;">` : 
                product.icon;
            this.elements.selectedProduct.innerHTML = `${iconDisplay} ${product.name}`;
            this.elements.productPrice.textContent = `$${product.price}`;
        } else {
            this.elements.selectedProduct.textContent = 'Ninguno';
            this.elements.productPrice.textContent = '$0';
        }
    }

    /**
     * Update money display
     */
    updateMoneyDisplay() {
        const inserted = paymentManager.getInsertedAmount();
        const change = paymentManager.calculateChange();

        this.elements.insertedMoney.textContent = `$${inserted}`;
        this.elements.change.textContent = `$${change}`;
    }

    /**
     * Update display
     */
    updateDisplay() {
        this.updateMoneyDisplay();
        this.updatePurchaseButton();
    }

    /**
     * Update purchase button state
     */
    updatePurchaseButton() {
        const canPurchaseResult = paymentManager.canPurchase();
        this.elements.purchaseBtn.disabled = !canPurchaseResult.canPurchase;

        if (!canPurchaseResult.canPurchase && canPurchaseResult.remaining) {
            this.showStatus(`Faltan $${canPurchaseResult.remaining}`, 'info');
        }
    }

    /**
     * Show status message
     */
    showStatus(message, type = 'info') {
        this.elements.statusMessage.textContent = message;
        this.elements.statusMessage.className = `status-message ${type}`;

        setTimeout(() => {
            this.elements.statusMessage.textContent = '';
            this.elements.statusMessage.className = 'status-message';
        }, 3000);
    }

    /**
     * Show delivery animation
     */
    showDeliveryAnimation(product) {
        const iconDisplay = product.icon.startsWith('image/') ? 
            `<img src="${product.icon}" alt="${product.name}" style="width: 100px; height: 100px;">` : 
            `<div style="font-size: 3rem;">${product.icon}</div>`;
        this.elements.deliveryArea.innerHTML = `
            <div style="animation: slideDown 0.5s ease;">
                <div style="margin-bottom: 10px;">${iconDisplay}</div>
                <div style="font-weight: bold; color: #2a5298;">${product.name}</div>
                <div style="font-size: 0.9rem; color: #666;">${product.artist}</div>
            </div>
        `;

        setTimeout(() => {
            this.clearDeliveryArea();
        }, 5000);
    }

    /**
     * Clear delivery area
     */
    clearDeliveryArea() {
        this.elements.deliveryArea.innerHTML = '<p class="slot-text">Tu vinilo aparecerá aquí</p>';
    }

    /**
     * Show success modal
     */
    showSuccessModal(product, change) {
        const iconDisplay = product.icon.startsWith('image/') ? 
            `<img src="${product.icon}" alt="${product.name}" style="width: 30px; height: 30px; vertical-align: middle;">` : 
            product.icon;
        this.elements.deliveredProduct.innerHTML = `${iconDisplay} ${product.name} - ${product.artist}`;
        
        if (change > 0) {
            this.elements.changeInfo.textContent = `Cambio devuelto: $${change}`;
        } else {
            this.elements.changeInfo.textContent = 'Pago exacto';
        }

        this.elements.modal.classList.add('active');
    }

    /**
     * Hide modal
     */
    hideModal() {
        // Detener la música cuando se cierre el modal
        if (typeof stopCurrentAudio === 'function') {
            stopCurrentAudio();
        }
        this.elements.modal.classList.remove('active');
    }

    /**
     * Reset UI
     */
    resetUI() {
        this.elements.selectedProduct.textContent = 'Ninguno';
        this.elements.productPrice.textContent = '$0';
        this.elements.insertedMoney.textContent = '$0';
        this.elements.change.textContent = '$0';
        this.elements.statusMessage.textContent = '';
        this.elements.statusMessage.className = 'status-message';
        this.elements.purchaseBtn.disabled = true;

        const cards = document.querySelectorAll('.product-card');
        cards.forEach(card => card.classList.remove('selected'));
    }
}

// Add slide down animation CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            transform: translateY(-100px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Create global UI manager instance
const uiManager = new UIManager();