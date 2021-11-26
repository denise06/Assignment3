const { Order } = require('../models');


// adding successful checkout to order
const createOrder= async(orderId, usersId, orderDetails, totalAmount, status)=> {

    let orderItem = new Order({
        'id': orderId,
        'users_id': usersId,
        'order_details': orderDetails,
        'total_amount': totalAmount/100,
        'order_status': status
    })
    await orderItem.save(null,{method:"insert"});
    return orderItem;
}

// get all orders
const getAllOrders = async () => {
    return await Order.fetchAll().map((orders) => {
        return [orders.get('id'), orders.get('total_amount'),orders.get('users_id'),orders.get('order_details'), orders.get('order_status')];
    })
}

// get order by id
const getOrderById = async (orderId) => {
    return await Order.where({
        'order_id': parseInt(orderId)
    }).fetch({
        require: true,
    });
}

module.exports = {createOrder,getAllOrders, getOrderById}



