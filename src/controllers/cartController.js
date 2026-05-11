const productModel = require('../models/productModel');

const cartController = {
    index: (req, res) => {
        // Inicializar el carrito si no existe
        if (!req.session.cart) {
            req.session.cart = [];
        }

        // Obtener datos completos de los productos combinando la sesión con el JSON
        const cartProducts = req.session.cart.map(item => {
            const product = productModel.findById(item.productId);
            if (!product) return null;
            return {
                ...product,
                quantity: item.quantity,
                subtotal: (product.price || 0) * item.quantity
            };
        }).filter(item => item !== null);

        // Calcular el total general
        const total = cartProducts.reduce((acc, curr) => acc + curr.subtotal, 0);

        res.render('cart', { 
            cartProducts, 
            total 
        });
    },

    add: (req, res) => {
        const productId = parseInt(req.params.id);
        
        if (!req.session.cart) {
            req.session.cart = [];
        }

        const productIndex = req.session.cart.findIndex(item => item.productId === productId);

        if (productIndex !== -1) {
            // Si ya existe, incrementar cantidad
            req.session.cart[productIndex].quantity += 1;
        } else {
            // Si no existe, agregar nuevo item
            req.session.cart.push({
                productId: productId,
                quantity: 1
            });
        }

        res.redirect(`/products/${productId}?added=true`);
    },

    increase: (req, res) => {
        const productId = parseInt(req.params.id);
        const productIndex = req.session.cart.findIndex(item => item.productId === productId);

        if (productIndex !== -1) {
            req.session.cart[productIndex].quantity += 1;
        }

        res.redirect('/cart');
    },

    decrease: (req, res) => {
        const productId = parseInt(req.params.id);
        const productIndex = req.session.cart.findIndex(item => item.productId === productId);

        if (productIndex !== -1) {
            req.session.cart[productIndex].quantity -= 1;

            // Si la cantidad llega a 0, eliminar el producto
            if (req.session.cart[productIndex].quantity <= 0) {
                req.session.cart.splice(productIndex, 1);
            }
        }

        res.redirect('/cart');
    },

    remove: (req, res) => {
        const productId = parseInt(req.params.id);
        req.session.cart = req.session.cart.filter(item => item.productId !== productId);
        res.redirect('/cart');
    },

    clear: (req, res) => {
        req.session.cart = [];
        res.redirect('/cart');
    }
};

module.exports = cartController;
