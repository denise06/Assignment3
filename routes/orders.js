const express = require('express')
const router = express.Router();
const { bootstrapField,SearchOrderForm} = require('../forms');
const {Product, Order} = require ('../models')

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


module.exports = router;