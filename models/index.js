const bookshelf = require('../bookshelf')

// products DB
const Product = bookshelf.model('Product', {
    tableName:'products',
    category() {
        return this.belongsTo('Category')
    },
    tags(){
        return this.belongsToMany('Tag');
    }
});

// categories DB
const Category = bookshelf.model('Category',{
    tableName: 'categories',
    products() {
        return this.hasMany('Product');
    }
});

// tags DB
const Tag = bookshelf.model('Tag',{
    tableName: 'tags',
    products() {
        return this.belongsToMany('Product')
    }
})

// user DB
const User = bookshelf.model('User',{
    tableName: 'users',
    orders(){
        return this.hasMany('Order')
    }
})

// shopping cart items DB 
const CartItem = bookshelf.model('CartItem', {
    tableName: 'cart_items',
    product() {
        return this.belongsTo('Product')
    }

})

// orders DB
const Order = bookshelf.model('Order', {
    tableName:'orders',
});

// export out the model
module.exports = { Product, Category, Tag, User, CartItem, Order};

