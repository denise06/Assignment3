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



// export out the model
module.exports = { Product, Category, Tag};

