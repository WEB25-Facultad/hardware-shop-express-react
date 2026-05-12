const productsService = require('./productsService');

const cartService = {
    // Inicializar el carrito en la sesión si no existe
    initializeCart: (session) => {
        if (!session.cart) {
            session.cart = [];
        }
        return session.cart;
    },

    // Obtener los productos del carrito con todos sus detalles para la vista
    getCartDetails: (session) => {
        const cart = cartService.initializeCart(session);
        return cart.map(item => {
            const product = productsService.findById(item.productId);
            if (!product) return null;
            return {
                ...product,
                quantity: item.quantity,
                subtotal: (product.price || 0) * item.quantity
            };
        }).filter(item => item !== null);
    },

    // Calcular el total general del carrito
    calculateTotal: (session) => {
        const cartDetails = cartService.getCartDetails(session);
        return cartDetails.reduce((acc, curr) => acc + curr.subtotal, 0);
    },

    // Calcular la cantidad total de ítems (para el badge del header)
    calculateItemCount: (session) => {
        const cart = cartService.initializeCart(session);
        return cart.reduce((total, item) => total + item.quantity, 0);
    },

    // Agregar un producto al carrito
    addProduct: (session, productId) => {
        const cart = cartService.initializeCart(session);
        const product = productsService.findById(productId);
        
        // Validar que el producto exista y tenga stock
        if (!product || product.stock === 0) {
            return false;
        }

        const productIndex = cart.findIndex(item => item.productId === productId);

        if (productIndex !== -1) {
            // Si ya existe, incrementar cantidad
            cart[productIndex].quantity += 1;
        } else {
            // Si no existe, agregarlo
            cart.push({
                productId: productId,
                quantity: 1
            });
        }
        return true;
    },

    // Modificar cantidad: Incrementar
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

    // Modificar cantidad: Disminuir
    decreaseQuantity: (session, productId) => {
        const cart = cartService.initializeCart(session);
        const productIndex = cart.findIndex(item => item.productId === productId);

        if (productIndex !== -1) {
            cart[productIndex].quantity -= 1;
            // Si llega a 0, se elimina
            if (cart[productIndex].quantity <= 0) {
                cart.splice(productIndex, 1);
            }
            return true;
        }
        return false;
    },

    // Quitar producto completamente
    removeProduct: (session, productId) => {
        const cart = cartService.initializeCart(session);
        session.cart = cart.filter(item => item.productId !== productId);
    },

    // Vaciar todo el carrito
    clearCart: (session) => {
        session.cart = [];
    }
};

module.exports = cartService;
