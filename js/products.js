// ===== PRODUCTS DATABASE =====
const products = [
    {
        id: 'A1',
        name: 'Abbey Road',
        artist: 'The Beatles',
        price: 32,
        stock: 3,
        icon: 'image/Abbey Road.png'
    },
    {
        id: 'A2',
        name: 'Dark Side of the Moon',
        artist: 'Pink Floyd',
        price: 25,
        stock: 2,
        icon: 'image/Dark Side of the Moon.png'
    },
    {
        id: 'A3',
        name: 'Keep Me Fed',
        artist: 'The Warning',
        price: 28,
        stock: 5,
        icon: 'image/TheWarning.png'
    },
    {
        id: 'B1',
        name: 'Rumours',
        artist: 'Fleetwood Mac',
        price: 29,
        stock: 4,
        icon: 'image/Rumours.png'
    },
    {
        id: 'B2',
        name: 'Led Zeppelin IV',
        artist: 'Led Zeppelin',
        price: 24,
        stock: 3,
        icon: 'image/Led Zeppelin IV.png'
    },
    {
        id: 'B3',
        name: 'Back in Black',
        artist: 'AC/DC',
        price: 27,
        stock: 6,
        icon: 'image/Back in Black.png'
    },
    {
        id: 'C1',
        name: 'Hotel California',
        artist: 'Eagles',
        price: 33,
        stock: 5,
        icon: 'image/Hotel California.png'
    },
    {
        id: 'C2',
        name: 'Nevermind',
        artist: 'Nirvana',
        price: 22,
        stock: 7,
        icon: 'image/Nevermind.png'
    },
    {
        id: 'C3',
        name: 'Weight of the World',
        artist: 'Nier: Automata',
        price: 35,
        stock: 3,
        icon: 'image/The Wall.png'
    },
    {
        id: 'D1',
        name: 'Appetite for Destruction',
        artist: 'Guns N\' Roses',
        price: 26,
        stock: 8,
        icon: 'image/Appetite for Destruction.png'
    },
    {
        id: 'D2',
        name: 'Tu Ultima Cancion',
        artist: 'Kirby Temerario',
        price: 25,
        stock: 6,
        icon: 'image/Born to Run.png'
    },
    {
        id: 'D3',
        name: 'Purple Rain',
        artist: 'Prince',
        price: 29,
        stock: 21,
        icon: 'image/Purple Rain.png'
    },
    {
        id: 'E1',
        name: 'Bohemian Rhapsody',
        artist: 'Queen',
        price: 31,
        stock: 5,
        icon: 'image/Bohemian Rhapsody.png'
    },
    {
        id: 'E2',
        name: 'Even In Arcadia',
        artist: 'Sleep Token',
        price: 34,
        stock: 15,
        icon: 'image/Even in Arcadia.png'
    },
    {
        id: 'E3',
        name: 'Like a Rolling Stone',
        artist: 'Bob Dylan',
        price: 27,
        stock: 9,
        icon: 'image/Like a Rolling Stone.png'
    }
];

// ===== PRODUCT MANAGEMENT FUNCTIONS =====

/**
 * Get all products
 */
function getAllProducts() {
    return products;
}

/**
 * Get product by ID
 */
function getProductById(id) {
    return products.find(product => product.id === id);
}

/**
 * Check if product is available
 */
function isProductAvailable(id) {
    const product = getProductById(id);
    return product && product.stock > 0;
}

/**
 * Decrease product stock
 */
function decreaseStock(id) {
    const product = getProductById(id);
    if (product && product.stock > 0) {
        product.stock--;
        
        // Save stock to localStorage after purchase
        if (typeof stockManager !== 'undefined' && stockManager.saveStockToStorage) {
            stockManager.saveStockToStorage();
        }
        
        return true;
    }
    return false;
}

/**
 * Get product price
 */
function getProductPrice(id) {
    const product = getProductById(id);
    return product ? product.price : 0;
}

/**
 * Get products sorted by price
 */
function getProductsSortedByPrice() {
    return [...products].sort((a, b) => b.price - a.price);
}