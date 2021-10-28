const express = require('express');
const router = express.Router();

const CartServices = require('../services/cart_services')
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

// Define checkout route
router.get('/', async (req, res) => {
    const cart = new CartServices(req.session.user.id);

    // get all the items from the cart
    let items = await cart.getCart();

    // create array of all the products user is purchasing
    let lineItems = [];
    let meta = [];
    for (let item of items) {
        const lineItem = {
            'name': item.related('product').get('name'),
            'amount': item.related('product').get('cost'),
            'quantity': item.get('quantity'),
            'currency': 'SGD'
        }
        if (item.related('product').get('image_url')) {
            lineItem['images'] = [item.related('product').get('image_url')]
        }
        lineItems.push(lineItem);
        // save product and corresponding quantity
        meta.push({
            'product_id' : item.get('product_id'),
            'quantity': item.get('quantity')
        })
    }

    // set up stripe payment session
    let metaData = JSON.stringify(meta);
    const payment = {
        payment_method_types: ['card'],
        line_items: lineItems,
        'success_url': 'http://www.google.com',
        'cancel_url': 'http://www.yahoo.com',
        // success_url: 'process.env.STRIPE_SUCCESS_URL' + '?sessionId={CHECKOUT_SESSION_ID}',
        // cancel_url: 'process.env.STRIPE_ERROR_URL',
        metadata: {
            'orders': metaData
        }
    }

    // create payment session with the payment object
    let stripeSession = await Stripe.checkout.sessions.create(payment)
    res.render('checkout/checkout', {
        'sessionId': stripeSession.id, 
        'publishableKey': process.env.STRIPE_PUBLISHABLE_KEY
    })
})

router.get('/success', function(req,res){
    res.render('checkout/success')
})

router.get('/cancelled', function(req,res){
    res.render('checkout/cancelled')
})


module.exports = router;

