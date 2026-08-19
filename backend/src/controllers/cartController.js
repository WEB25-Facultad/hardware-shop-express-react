// solo coordina.
const cartService = require('../services/cartService');
const productsService = require('../services/productsService');

// usamos "Express Sessions" para crear un espacio en la memoria y  pasarla a una cookie secreta del navegador 
// asi recordamos que productos metio al carro por mas que navegue en otras paginas
const cartController = {
    index: (req, res) => {
        const cartProducts = cartService.getCartDetails(req.session);
        const total = cartService.calculateTotal(req.session);

        // Renderiza el carrito desde la carpeta views/pages/   SSR
        // el servidor compila un archivo EJS. envia archivo HTML ya armado
        res.render('pages/cart', { 
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
 // Este Controlador del Carrito pertenece a nuestra arquitectura original de Monolito, por eso usa res.render()
 // para mezclar los datos con la vista EJS en el servidor y enviar HTML directo al navegador, y usa res.redirect() para forzar recargas de página.}

 //manejo de session: basicamente por que la web no tiene memoria por defecto 