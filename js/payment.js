// ===== PAYMENT MANAGER =====

class PaymentManager {
    constructor() {
        this.insertedAmount = 0;
        this.selectedProduct = null;
        this.MAX_AMOUNT = 50; // Límite máximo de dinero acumulado
    }

    /**
     * Select a product
     */
    selectProduct(productId) {
        const product = getProductById(productId);
        
        if (!product) {
            return {
                success: false,
                message: 'Producto no encontrado'
            };
        }

        if (!isProductAvailable(productId)) {
            return {
                success: false,
                message: 'Producto agotado'
            };
        }

        this.selectedProduct = product;
        return {
            success: true,
            message: `${product.name} seleccionado`,
            product: product
        };
    }

    /**
     * Insert money
     */
    insertMoney(amount) {
        if (amount <= 0) {
            return {
                success: false,
                message: 'Cantidad inválida'
            };
        }

        // Verificar si se excedería el límite máximo
        if (this.insertedAmount + amount > this.MAX_AMOUNT) {
            return {
                success: false,
                message: `No se puede exceder el límite de $${this.MAX_AMOUNT}`,
                limitReached: true
            };
        }

        this.insertedAmount += amount;
        
        return {
            success: true,
            message: `$${amount} insertado`,
            total: this.insertedAmount,
            limitReached: this.insertedAmount >= this.MAX_AMOUNT
        };
    }

    /**
     * Check if limit is reached
     */
    isLimitReached() {
        return this.insertedAmount >= this.MAX_AMOUNT;
    }

    /**
     * Check if can purchase
     */
    canPurchase() {
        if (!this.selectedProduct) {
            return {
                canPurchase: false,
                message: 'No hay producto seleccionado'
            };
        }

        if (!isProductAvailable(this.selectedProduct.id)) {
            return {
                canPurchase: false,
                message: 'Producto agotado'
            };
        }

        if (this.insertedAmount < this.selectedProduct.price) {
            const remaining = this.selectedProduct.price - this.insertedAmount;
            return {
                canPurchase: false,
                message: `Faltan $${remaining}`,
                remaining: remaining
            };
        }

        return {
            canPurchase: true,
            message: 'Puede comprar'
        };
    }

    /**
     * Process purchase
     */
    processPurchase() {
        const purchaseCheck = this.canPurchase();

        if (!purchaseCheck.canPurchase) {
            return {
                success: false,
                message: purchaseCheck.message
            };
        }

        const change = this.insertedAmount - this.selectedProduct.price;
        const productInfo = { ...this.selectedProduct };

        // Decrease stock
        decreaseStock(this.selectedProduct.id);

        // Reset payment
        this.reset();

        return {
            success: true,
            message: 'Compra exitosa',
            product: productInfo,
            change: change
        };
    }

    /**
     * Calculate change
     */
    calculateChange() {
        if (!this.selectedProduct) {
            return 0;
        }
        
        const change = this.insertedAmount - this.selectedProduct.price;
        return change > 0 ? change : 0;
    }

    /**
     * Get inserted amount
     */
    getInsertedAmount() {
        return this.insertedAmount;
    }

    /**
     * Get selected product
     */
    getSelectedProduct() {
        return this.selectedProduct;
    }

    /**
     * Reset payment
     */
    reset() {
        this.insertedAmount = 0;
        this.selectedProduct = null;
    }

    /**
     * Cancel transaction and return money
     */
    cancelTransaction() {
        const returnedAmount = this.insertedAmount;
        this.reset();
        
        return {
            success: true,
            message: returnedAmount > 0 ? `Devolución: ${returnedAmount}` : 'Transacción cancelada',
            returnedAmount: returnedAmount
        };
    }
}

// Create global payment manager instance
const paymentManager = new PaymentManager();