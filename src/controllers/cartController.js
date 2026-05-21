const cartService = require('../services/cartService');
const productsService = require('../services/productsService');

const cartController = {
    index: (req, res) => {
        const cartProducts = cartService.getCartDetails(req.session);
        const total = cartService.calculateTotal(req.session);

        res.render('cart', { 
            cartProducts, 
            total 
        });
    },

    add: (req, res) => {
        // La validación 400 y 404 de ID ya la hizo el middleware
        const productId = req.normalizedId;
        const success = cartService.addProduct(req.session, productId);
        
        if (!success) {
            return res.redirect('back');
        }

        res.redirect(`/products/${productId}?added=true`);
    },

    increase: (req, res) => {
        cartService.increaseQuantity(req.session, req.normalizedId);
        res.redirect('/cart');
    },

    decrease: (req, res) => {
        cartService.decreaseQuantity(req.session, req.normalizedId);
        res.redirect('/cart');
    },

    remove: (req, res) => {
        cartService.removeProduct(req.session, req.normalizedId);
        res.redirect('/cart');
    },

    clear: (req, res) => {
        cartService.clearCart(req.session);
        res.redirect('/cart');
    }
};

module.exports = cartController;
