const express = require("express");
const router = express.Router();

// #1 import in the Product model
const { Product} = require('../models')

// import in  Forms
const { bootstrapField, createProductForm } = require('../forms');



router.get('/', async (req,res)=>{
    // #2 - fetch all the products (ie, SELECT * from products)
    let products = await Product.collection().fetch();
    res.render('products/index', {
        'products': products.toJSON() // #3 - convert collection to JSON
    })
})

// Create new listing in Minime
router.get('/create', async (req, res) => {
    const productForm = createProductForm();
    res.render('products/create',{
        'form': productForm.toHTML(bootstrapField)
    })
})

//process submitted create product listing form
router.post('/create', async(req,res)=>{
    const productForm = createProductForm();
    productForm.handle(req, {
        'success': async (form) => {
            const product = new Product();
            product.set('name', form.data.name);
            product.set('cost', form.data.cost);
            product.set('description', form.data.description);
            product.set('ageGroup', form.data.ageGroup);
            product.set('brand', form.data.brand);
            product.set('condition', form.data.condition);
            await product.save();
            res.redirect('/products');
        },
        'empty': function(req){
            res.send("None of the fields are filled in")
        },

        'error': function (form) {
            res.render('products/create', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})


// Update existing listing
router.get('/:product_id/update', async (req, res) => {
    // retrieve the product
    const productId = req.params.product_id
    const product = await Product.where({
        'id': productId
    }).fetch({
        require: true
    });

    const productForm = createProductForm();


    productForm.fields.name.value = product.get('name');
    productForm.fields.cost.value = product.get('cost');
    productForm.fields.description.value = product.get('description');
    productForm.fields.ageGroup.value = product.get('ageGroup');
    productForm.fields.brand.value = product.get('brand');
    productForm.fields.condition.value = product.get('condition');

    res.render('products/update', {
        'form': productForm.toHTML(bootstrapField),
        'product': product.toJSON()
    })

})

//process the item update form
router.post('/:product_id/update', async (req, res) => {

    // fetch the product that we want to update
    const product = await Product.where({
        'id': req.params.product_id
    }).fetch({
        require: true
    });

    // process the form
    const productForm = createProductForm();
    productForm.handle(req, {
        'success': async (form) => {
            product.set(form.data);
            product.save();
            res.redirect('/products');
        },
        'error': async (form) => {
            res.render('products/update', {
                'form': form.toHTML(bootstrapField),
                'product': product.toJSON()
            })
        }
    })
})

// Deleting a product listing
// fetch product that we are deleting
router.get('/:product_id/delete', async(req,res)=>{
    const product = await Product.where({
        'id': req.params.product_id
    }).fetch({
        require: true
    });

    res.render('products/delete', {
        'product': product.toJSON()
    })
});

// process the delete via destroy
router.post('/:product_id/delete', async(req,res)=>{
    const product = await Product.where({
        'id': req.params.product_id
    }).fetch({
        require: true
    });
    await product.destroy();
    res.redirect('/products')
})



module.exports = router;