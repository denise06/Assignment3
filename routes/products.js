const express = require("express");
const router = express.Router();
const { bootstrapField, createProductForm,createSearchForm } = require('../forms');
const { checkIfAuthenticated } = require('../middlewares');

// #1 import in the Product, category and tag model
const { Product, Category, Tag} = require('../models')

// Get all products, including search engine
router.get('/', async function (req, res) {
    // retrieve an array of all available categories
    const allCategories = await Category.fetchAll().map(function (category) {
        return [category.get('id'), category.get('name')]
    })

    // create a fake category that represents search all
    allCategories.unshift([0, '----'])

    // retrieve an array of all the tags
    const allTags = await Tag.fetchAll().map(tag => [tag.get('id'), tag.get('name')]);


    let searchForm = createSearchForm(allCategories, allTags);

    // create a base query object which is deferred this is the eqv. of "select * from products"
    let q = Product.collection();  
   
    searchForm.handle(req,{
        'success': async function(form) {
            if (form.data.name) {
                q.where('name', 'like', '%' + form.data.name + '%')
            }

            if (form.data.min_cost) {
                q.where('cost', '>=', form.data.min_cost);
            }

            if (form.data.max_cost) {
                q.where('cost', '<=', form.data.max_cost);
            }

            if (form.data.category_id && form.data.category_id != "0") {
                q.where('category_id', '=', form.data.category_id)
            }

            if (form.data.tags) {
                q.query('join', 'products_tags', 'products.id', 'product_id')
                .where('tag_id', 'in', form.data.tags.split(','))
            }

            let products = await q.fetch({
                withRelated:['category', 'tags']
            })

            res.render('products/index',{
                'form': form.toHTML(bootstrapField),
                'products': products.toJSON()
            })
        },
        'error': async function() {
            let products = await q.fetch({
                withRelated:['category', 'tags']
            });
            res.render('products/index',{
                'products': products.toJSON(),
                'form': form.toHTML(bootstrapField)
            })
        },
        'empty': async function(form) {
            let products = await q.fetch({
                withRelated:['category', 'tags']
            });
            res.render('products/index',{
                'products': products.toJSON(),
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})

// Create new listing in Minime
router.get('/create', checkIfAuthenticated, async (req, res) => {
    // retrieve all available categories
    const allCategories = await Category.fetchAll().map(function(category){
        return [ category.get('id'), category.get('name')]
    })
    // retrieve all tags
    const allTags = await Tag.fetchAll().map( tag => [tag.get('id'), tag.get('name')]);
    const productForm = createProductForm(allCategories, allTags);

    res.render('products/create', {
        'form': productForm.toHTML(bootstrapField),
        'cloudinaryName': process.env.CLOUDINARY_NAME,
        'cloudinaryApiKey': process.env.CLOUDINARY_API_KEY,
        'cloudinaryPreset': process.env.CLOUDINARY_UPLOAD_PRESET
    })
})

//process submitted create product listing form
router.post('/create',checkIfAuthenticated ,async(req,res)=>{
    const allCategories = await Category.fetchAll().map(function(category){
        return [ category.get('id'), category.get('name')]
    })

    // retrieve all tags
    const allTags = await (await Tag.fetchAll()).map(function(tag){
        return [ tag.get('id'), tag.get('name')]
    })

    const productForm = createProductForm(allCategories,allTags);

    productForm.handle(req, {
        'success': async (form) => {
            const product = new Product();
            product.set('name', form.data.name);
            product.set('cost', form.data.cost);
            product.set('description', form.data.description);
            product.set('ageGroup', form.data.ageGroup);
            product.set('brand', form.data.brand);
            product.set('condition', form.data.condition);
            product.set('category_id', form.data.category_id);
            product.set('image_url', form.data.image_url);

            
            await product.save();

            if (form.data.tags) {
                await product.tags().attach(form.data.tags.split(","));
            }
            req.flash("success_messages", `New Product ${product.get('name')} has been created`)

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
    
    // retrieve all categories
    const allCategories = await Category.fetchAll().map(function(category){
        return [ category.get('id'), category.get('name')]
    })
    // retrieve all tags
    const allTags = await Tag.fetchAll().map( tag => [tag.get('id'), tag.get('name')]);
    
    // retrieve the product
    const productId = req.params.product_id
    
    const product = await Product.where({
        'id': productId
    }).fetch({
        require: true,
        withRelated:['tags']

    });

    const productForm = createProductForm(allCategories, allTags);

    productForm.fields.name.value = product.get('name');
    productForm.fields.cost.value = product.get('cost');
    productForm.fields.description.value = product.get('description');
    productForm.fields.ageGroup.value = product.get('ageGroup');
    productForm.fields.brand.value = product.get('brand');
    productForm.fields.condition.value = product.get('condition');
    productForm.fields.category_id.value = product.get('category_id');
    productForm.fields.tags.value = product.get('tags');
    productForm.fields.image_url.value = product.get('image_url');

    //multi select for tags
    let selectedTags = await product.related('tags').pluck('id');
    productForm.fields.tags.value= selectedTags;

    res.render('products/update', {
        'form': productForm.toHTML(bootstrapField),
        'product': product.toJSON(),
        // cloudinary info
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET

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
    // fetch all the categories
    const allCategories = await Category.fetchAll().map(function(category){
        return [ category.get('id'), category.get('name')]
    })

    // process the form
    const productForm = createProductForm(allCategories);
    productForm.handle(req, {
        'success': async (form) => {
            let {tags, ...productData} = form.data;
            product.set(productData);
            product.save();
            // update relationship
            let tagIds = tags.split(',')

            let existingTagIds = await product.related('tags').pluck('id')

            let toRemove = existingTagIds.filter(function(id){
                return tagIds.includes(id) === false
            })

            await product.tags().detach(toRemove);

            // add in all the tags that are selected
            await product.tags().attach(tagIds);    

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

// View each product details
router.get('/:product_id/details', async (req, res) => {
    
    // retrieve all categories
    const allCategories = await Category.fetchAll().map(function(category){
        return [ category.get('id'), category.get('name')]
    })
    // retrieve all tags
    const allTags = await Tag.fetchAll().map( tag => [tag.get('id'), tag.get('name')]);
    
    // retrieve the product
    const productId = req.params.product_id
    
    const product = await Product.where({
        'id': productId
    }).fetch({
        require: true,
        withRelated:['tags']

    });

    product.get('name');
    product.get('cost');
    product.get('description');
    product.get('ageGroup');
    product.get('brand');
    product.get('condition');
    product.get('category_id');
    product.get('tags');

    //multi select for tags
    let selectedTags = await product.related('tags').pluck('id');
    
    
    
    // res.redirect('/products')
    res.render('products/details')
})


module.exports = router;