const {
    createOrder
} = require('../dal/order')

const {
    Order
} = require('../models');
const CartServices = require('./cart_services');


class OrderServices {
    constructor(stripeSession) {
        this.stripeSession = stripeSession;
    }
    // adding orders paid to order table
    async processOrder() {
        let {id,metadata,amount_total,payment_status} = this.stripeSession
        await createOrder(id,parseInt(metadata.user_id), metadata.orders, amount_total, payment_status);
    }
}

module.exports = OrderServices;

