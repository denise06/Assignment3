const express = require('express')
const router = express.Router();
const { bootstrapField,SearchOrderForm, orderStatusForm} = require('../forms');
const {Product, Order} = require ('../models')
const dataLayer = require('../dal/order')

// displaying all orders based on search criteria
router.get('/', async function (req, res) {
    let orders = await Order.collection().fetch();
    let searchForm = SearchOrderForm(orders);
    let q = Order.collection();  

    searchForm.handle(req,{
        'success': async function(form) {
            if (form.data.max_amount) {
                q.where('total_amount', '<=', form.data.max_amount);
            }
            if (form.data.order_id) {
                q = q.where('id', 'like', '%' + req.query.order_id + '%')
            }
            if (form.data.user_id) {
                // q= q.where('users_id', 'like', '%' + req.query.user_id + '%')
                q.where('users_id', '=', form.data.user_id);
            }
            let orders = await q.fetch();
            res.render('orders/index',{
                'form': form.toHTML(bootstrapField),
                'orders': orders.toJSON()
                
            });
        },
        'empty': async function (form) {
            let orders = await Order.collection().fetch();
        
            res.render('orders/index',{
                'form': form.toHTML(bootstrapField),
                'orders': orders.toJSON()
                
            });
        }
    })
})

// update order status
router.get('/:order_id/update', async(req,res)=>{
    // let orders = await Order.collection().fetch();
    let orderId = await req.params.order_id
    let order = await dataLayer.getOrderById(orderId);
    let statusForm = orderStatusForm();
    
    statusForm.fields.order_status.value = order.get('order_status')

    res.render('orders/update',{
        'form': statusForm.toHTML(bootstrapField),
        'order': order.toJSON()
    })
})

// process order status
router.post('/:order_id/update', async (req, res) => {
    let orderId = await req.params.order_id
    let order = await dataLayer.getOrderById(orderId);
    let statusForm = orderStatusForm();
    statusForm.handle(req,{
        'success': async(form) =>{
            order.set(form.data);
            order.save();
            res.redirect('/orders')
        },
        'error': async (form) => {
            res.render('orders/update', {
                'form': statusForm.toHTML(bootstrapField),
                'order': order.toJSON()
            })
        }
    })
})
// delete an order
router.get('/:order_id/delete', async(req,res)=>{
    // let orders = await Order.collection().fetch();
    let orderId = await req.params.order_id
    let order = await Order.where({
        'order_id': req.params.order_id
    }).fetch({
        require: true
    });
    
    res.render('orders/delete',{
        'order': order.toJSON()
    })
})

//process the delete
router.post('/:order_id/delete', async (req, res) => {
    let order = await Order.where({
        'order_id': req.params.order_id
    }).fetch({
        require: true
    });
    await order.destroy();
    res.redirect('/orders')
})

module.exports = router;