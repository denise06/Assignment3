const { Order } = require('../models');


// adding successful checkout to order
const createOrder= async(orderId, usersId, orderDetails, totalAmount)=> {

    let orderItem = new Order({
        'id': orderId,
        'users_id': usersId,
        'order_details': orderDetails,
        'total_amount': totalAmount/100,
    })
    await orderItem.save(null,{method:"insert"});
    return orderItem;
}

// get all orders
const getAllOrders = async () => {
    return await Order.fetchAll().map((orders) => {
        return [orders.get('id'), orders.get('total_amount'),orders.get('users_id'),orders.get('order_details')];
    })
}

module.exports = {createOrder,getAllOrders}



