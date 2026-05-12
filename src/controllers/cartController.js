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
        const productId = productsService.normalizeId(req.params.id);
        if (!productId) return res.status(400).send('Bad Request: ID inválido');
        
        const success = cartService.addProduct(req.session, productId);
        
        if (!success) {
            return res.redirect('back');
        }

        res.redirect(`/products/${productId}?added=true`);
    },

    increase: (req, res) => {
        const productId = productsService.normalizeId(req.params.id);
        if (productId) cartService.increaseQuantity(req.session, productId);
        res.redirect('/cart');
    },

    decrease: (req, res) => {
        const productId = productsService.normalizeId(req.params.id);
        if (productId) cartService.decreaseQuantity(req.session, productId);
        res.redirect('/cart');
    },

    remove: (req, res) => {
        const productId = productsService.normalizeId(req.params.id);
        if (productId) cartService.removeProduct(req.session, productId);
        res.redirect('/cart');
    },

    clear: (req, res) => {
        cartService.clearCart(req.session);
        res.redirect('/cart');
    }
};

module.exports = cartController;
