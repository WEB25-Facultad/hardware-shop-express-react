const productsService = require('./productsService');

const cartService = {
    // Patrón Singleton: Si la sesión no tiene carrito, lo crea vacío; si lo tiene, lo devuelve.
    initializeCart: (session) => {
        if (!session.cart) {
            session.cart = [];
        }
        return session.cart;
    },

    // "Hidratación" del carrito: Mezcla los IDs guardados en sesión con los datos reales de la BD
    getCartDetails: (session) => {
        const cart = cartService.initializeCart(session);
        if (cart.length === 0) return [];

        // 1. Optimización: Extraemos IDs y hacemos 1 sola consulta a la DB (evita el problema N+1)
        const productIds = cart.map(item => item.productId);
        const productsFromDb = productsService.findByIds(productIds);
        
        // 2. Diccionario (Hash Map) para acceso instantáneo a los datos
        const productMap = {};
        for (const p of productsFromDb) {
            productMap[p.id] = p;
        }

        const hydratedCart = [];
        const validCartItems = []; 

        for (const item of cart) {
            const product = productMap[item.productId];
            
            // 3. Autolimpieza: Si el producto aún existe, lo agregamos al carrito final
            if (product) {
                validCartItems.push(item);
                hydratedCart.push({
                    ...product,
                    quantity: item.quantity,
                    subtotal: (product.price || 0) * item.quantity
                });
            }
        }

        // 4. Sincronización: Si un producto fue borrado de la DB por el Admin, lo borramos de la sesión
        if (validCartItems.length !== cart.length) {
            session.cart = validCartItems;
        }

        return hydratedCart;
    },

    // Cálculo del total delegando en getCartDetails para asegurar precios actualizados
    calculateTotal: (session) => {
        const cartDetails = cartService.getCartDetails(session);
        return cartDetails.reduce((acc, curr) => acc + curr.subtotal, 0);
    },

    // Cálculo rápido de ítems sumando cantidades (sin llamar a la DB)
    calculateItemCount: (session) => {
        const cart = cartService.initializeCart(session);
        return cart.reduce((total, item) => total + item.quantity, 0);
    },

    // Inserción o actualización de cantidad
    addProduct: (session, productId) => {
        const cart = cartService.initializeCart(session);
        const product = productsService.findById(productId);
        
        // Validación de negocio: No se puede agregar si no existe o no hay stock
        if (!product || product.stock === 0) {
            return false;
        }

        const productIndex = cart.findIndex(item => item.productId === productId);

        if (productIndex !== -1) {
            cart[productIndex].quantity += 1;
        } else {
            cart.push({
                productId: productId,
                quantity: 1
            });
        }
        return true;
    },

    increaseQuantity: (session, productId) => {
        const cart = cartService.initializeCart(session);
        const product = productsService.findById(productId);
        
        if (!product || product.stock === 0) return false;

        const productIndex = cart.findIndex(item => item.productId === productId);
        if (productIndex !== -1) {
            cart[productIndex].quantity += 1;
            return true;
        }
        return false;
    },

    decreaseQuantity: (session, productId) => {
        const cart = cartService.initializeCart(session);
        const productIndex = cart.findIndex(item => item.productId === productId);

        if (productIndex !== -1) {
            cart[productIndex].quantity -= 1;
            // Si la cantidad llega a 0, removemos el objeto del array (splice)
            if (cart[productIndex].quantity <= 0) {
                cart.splice(productIndex, 1);
            }
            return true;
        }
        return false;
    },

    removeProduct: (session, productId) => {
        const cart = cartService.initializeCart(session);
        session.cart = cart.filter(item => item.productId !== productId);
    },

    clearCart: (session) => {
        session.cart = [];
    }
};

module.exports = cartService;