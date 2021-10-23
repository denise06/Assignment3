const bookshelf = require('../bookshelf')

// products DB
const Product = bookshelf.model('Product', {
    tableName:'products',
    category() {
        return this.belongsTo('Category')
    }
});

// categories DB
const Category = bookshelf.model('Category',{
    tableName: 'categories',
    products() {
        return this.hasMany('Product');
    }

})



// export out the model
module.exports = { Product, Category};

