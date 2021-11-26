const {
    createOrder, getAllOrders
} = require('../dal/order')

const {
    Order
} = require('../models')


class OrderServices {
    constructor(stripeSession) {
        this.stripeSession = stripeSession;
    }
    // adding items to cart, up quanity if item already exist
    async processOrder() {
        let {id,metadata,amount_total} = this.stripeSession
        await createOrder(id,parseInt(metadata.user_id), metadata.orders, amount_total);
        
    }
      // get all orders
      async getCart() {
        return await getAllOrders();
    }

}

module.exports = OrderServices;

