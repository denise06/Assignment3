const express = require("express");
const router = express.Router();

const CartServices = require('../services/cart_services');


// adding item to shopping cart
router.get('/:product_id/add', async (req,res)=>{
    let cart = new CartServices(req.session.user.id);
    cart.addToCart(req.params.product_id, 1);
    req.flash('success_messages', "It's in your cart!")
    res.redirect('/shoppingCart')
})

// removing item from shopping cart
router.get('/:product_id/remove', async function(req,res){
    let cart = new CartServices(req.session.user.id);
    let removed =cart.removeFromCart(req.params.product_id);
    if (removed) {
        req.flash('success_messages', "Item removed from cart");
    } else {
        req.flash("error_messages", "Please add item into cart");
    }
    res.redirect('/shoppingCart')
})

// update quantity amount
router.post('/:product_id/quantity', async function(req,res){
    let newQuantity = req.body.newQuantity;
    let cart = new CartServices(req.session.user.id);
    let status = await cart.updateQuantity(req.params.product_id, newQuantity);
    if (status) {
        req.flash("success_messages", "Quantity updated");
        res.redirect('/shoppingCart');
    } else {
        res.flash('error_messages', "Error, please try again");
        res.redirect('/shoppingCart');
    }
})

router.get('/', async function(req,res){
    let cart = new CartServices(req.session.user.id);
    let cartContent = await cart.getCart();
    res.render('cart/index',{
        'shoppingCart': cartContent.toJSON()
    })
})

module.exports = router;