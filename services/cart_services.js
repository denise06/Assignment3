const {
    createCartItem,
    getCartItemByUserAndProduct,
    removeFromCart,
    updateQuantity,
    getCart
} = require('../dal/cartItems')

const {
    CartItem
} = require('../models')


class CartServices {
    constructor(user_id) {
        this.user_id = user_id;
    }
    // adding items to cart, up quanity if item already exist
    async addToCart(productId, quantity) {
        let cartItem = await getCartItemByUserAndProduct(this.user_id, productId);

        if (cartItem) {
            cartItem.set('quantity', cartItem.get('quantity') + 1);
            cartItem.save();
            return cartItem;
        } else {
            let newCartItem = createCartItem(this.user_id, productId, quantity);
            return newCartItem;
        }
    }
    // remove item from cart 
    async removeFromCart(productId) {
        return await removeFromCart(this.user_id, productId);
    }
    
    // update cart quantity
    async updateQuantity(productId, quantity) {
        return await updateQuantity(this.user_id, productId, quantity);
    }
    
    // get all items in cart for a particular user
    async getCart() {
        return await getCart(this.user_id);
    }
}

module.exports = CartServices;

