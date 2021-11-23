const express = require('express');
const router = express.Router();

const CartServices = require('../services/cart_services')
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const bodyParser = require('body-parser');

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
            'amount': item.related('product').get('cost')*100,
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
        'success_url': 'https://3000-fuchsia-rodent-mn0r24w6.ws-us18.gitpod.io/checkout/success',
        'cancel_url': 'http://www.yahoo.com',
        // success_url: 'process.env.STRIPE_SUCCESS_URL' + '?sessionId={CHECKOUT_SESSION_ID}',
        // cancel_url: 'process.env.STRIPE_ERROR_URL',
        metadata: {
            'orders': metaData,
            'user_id': req.session.user.id
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

// Strip call webhook to process payment
router.post('/process_payment', bodyParser.raw({"type":"application/json"}), function(req,res){
    let payload = req.body;
    let endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
    let sigHeader = req.headers['stripe-signature'];
    let event;
    try {
        event = Stripe.webhooks.constructEvent(payload, sigHeader, endpointSecret);
    } catch(e) {
        res.send({
            'error':e.message
        })
        console.log(e.message);
    }
    let stripeSession = event.data.object;
    if (event.type == 'checkout.session.completed') {
        console.log(stripeSession);
    }

    res.send({'recieved': true})
})
module.exports = router;

